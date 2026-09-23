import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "./SurveyPage.css";
import "survey-core/survey-core.min.css";
import { submitSurveyPost, saveProgressPost, checkUidExistsPost } from "./Api";

// ── Which survey.json page names count as subsection completions ─────────────
// Order matters: index+1 = subsection number.
// Adjust to match your actual page names in survey.json.
const SUBSECTION_PAGES = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"];

function useUid() {
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  return params.get("uid") || localStorage.getItem("survey_uid") || "";
}

export default function SurveyPage() {
  const uid = useUid();
  const navigate = useNavigate();
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // Track which subsections have already been saved to avoid duplicate POSTs
  const savedSubsections = useMemo(() => new Set(), []);

  // ── Load survey.json ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!uid) {
      alert("Unique ID missing. Please start from the landing page.");
      navigate("/");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        // Guard: redirect if already completed
        const alreadyDone = await checkUidExistsPost(uid);
        if (alreadyDone) {
          alert(
            "Our records show that you have already completed this survey. Thank you!",
          );
          navigate("/");
          return;
        }

        const res = await fetch("/survey.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load survey.json");
        const j = await res.json();
        if (!cancelled) setSchema(JSON.parse(JSON.stringify(j)));
      } catch (e) {
        if (!cancelled) setError(e.message || "Error loading survey");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid, navigate]);

  // ── Build model ────────────────────────────────────────────────────────────
  const model = useMemo(() => {
    if (!schema) return null;
    const m = new Model(schema);

    if (!schema.pageNextText) m.pageNextText = "Next subsection";
    if (!schema.completeText) m.completeText = "Submit";

    // ── On every page change: save progress ──────────────────────────────────
    m.onCurrentPageChanged.add(async (sender, options) => {
      const prevPage = options?.oldCurrentPage?.name;

      // Save progress whenever leaving a subsection page (once per page)
      if (
        prevPage &&
        SUBSECTION_PAGES.includes(prevPage) &&
        !savedSubsections.has(prevPage)
      ) {
        savedSubsections.add(prevPage);
        const subsectionIndex = SUBSECTION_PAGES.indexOf(prevPage);
        try {
          await saveProgressPost(uid, prevPage, sender.data);
          // Also persist to localStorage as backup
          localStorage.setItem(
            `survey_progress_${uid}`,
            JSON.stringify({
              lastPage: prevPage,
              subsection: subsectionIndex + 1,
              answers: sender.data,
            }),
          );
        } catch (e) {
          console.warn("Failed to save progress", e);
          // Don't block the user — localStorage already saved
        }
      }
    });

    // ── Per-question render hooks ─────────────────────────────────────────────
    m.onAfterRenderQuestion.add((sender, options) => {
      const el = options?.htmlElement;
      if (!el) return;

      // Wire custom break-page "Ready for next section" buttons
      const btn = el.querySelector('button[id$="-btn"]');
      if (btn) btn.onclick = () => sender.nextPage();

      
    });

    // ── Break page body class ─────────────────────────────────────────────────
    const BREAK_PAGES = new Set(["A_BREAK", "B_BREAK"]);
    const updateBodyClass = () => {
      const name = m?.currentPage?.name || "";
      document.body.classList.toggle("break-page", BREAK_PAGES.has(name));
    };
    m.onCurrentPageChanged.add(updateBodyClass);
    updateBodyClass();

    // ── Final submission ──────────────────────────────────────────────────────
    m.onComplete.add(async (sender, options) => {
      options.showSaveInProgress();
      try {
        await submitSurveyPost({ uid, answers: sender.data });
        localStorage.removeItem("survey_uid");
        localStorage.removeItem(`survey_progress_${uid}`);
        options.showSaveSuccess("Thanks! Your response has been recorded.");
      } catch (e) {
        console.error(e);
        const exists = await checkUidExistsPost(uid).catch(() => false);
        if (exists) {
          options.showSaveError(
            "Our records show you have already completed this survey. Thank you!",
          );
        } else {
          options.showSaveError(
            e.message || "Submission failed. Please try again.",
          );
        }
      }
    });

    return m;
  }, [schema, uid, savedSubsections]);

  // ── Render states ──────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="container">
        <div className="card">
          <h2>Loading survey…</h2>
          <p className="muted">
            ID: <b>{uid || "—"}</b>
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container">
        <div className="card">
          <h2>Study on Understanding User Perceptions of a Data Dashboard [Post Usage]</h2>
          <p className="muted">
            ID: <b>{uid}</b>
          </p>
          <p style={{ color: "salmon" }}>Error: {error}</p>
          <button onClick={() => location.reload()}>Retry</button>
        </div>
      </div>
    );

  if (!model) return null;

  return (
    <div className="container survey-container">
    <div className="card survey-card">
    {/* <div className="container">
      <div className="card"> */}
        <h2>Study on Understanding User Perceptions of Data Dashboard [Post Usage]</h2>
        <Survey model={model} />
      </div>
    </div>
  );
}
