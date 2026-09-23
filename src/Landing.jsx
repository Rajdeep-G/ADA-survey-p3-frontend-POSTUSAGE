import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUidExistsPost, startSurveyPost } from "./Api";
import "./Landing.css";

export default function Landing() {
  const [uid, setUid] = useState("");
  const [consent, setConsent] = useState(null); // "yes" | "no" | null
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onStart = async (e) => {
    e.preventDefault();

    if (consent !== "yes") {
      return alert("Please indicate your consent before proceeding.");
    }

    const trimmed = uid.trim();
    if (!trimmed) return alert("Please enter your Prolific ID.");

    setBusy(true);
    try {
      const exists = await checkUidExistsPost(trimmed);
      if (exists) {
        alert(
          "Our records show that you have already completed this survey. Thank you!",
        );
        return;
      }
      // send both consent + uid together in one call
      await startSurveyPost(trimmed, consent);

      localStorage.setItem("survey_uid", trimmed);
      localStorage.setItem("survey_consent", consent);
      navigate(`/survey?uid=${encodeURIComponent(trimmed)}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="l-root">
      <div className="l-card">
        {/* ── Header ── */}
        <h1 className="l-title">
          Understanding User Perceptions of a Data Dashboard [Post Usage Survey]
        </h1>
        <p className="l-salutation">Dear Participant,</p>

        <div className="l-section">
          {/* <span className="l-eyebrow">Welcome Back</span> */}
          <p>
            Thank you for returning to complete the final part of this study. This survey marks the concluding stage of our multi-part research on how users like yourself understand, interpret, and manage their Google “My Activity” data with the help of the ADA extension.

          </p>
        </div>

        {/* ── Recap ── */}
        <div className="l-section">
          {/* <span className="l-eyebrow">A Quick Recap</span> */}
          <p>
            Earlier, in Part-1 (Pre-usage survey), you shared your initial perceptions about Google-collected activity data, and then you installed the ADA browser extension and used it for a period of (atleast) 7 days. During this time, ADA helped you view your Google Activity entries in a personalized dashboard and offered privacy-focused actions such as reviewing and deleting specific activity items on your personal device.

          </p>
        </div>

        {/* ── Goal ── */}
        <div className="l-section">
          {/* <span className="l-eyebrow">Study Goal</span> */}
          <p>
            The goal of this final survey is to understand your overall experience using ADA, how (if at all) your perceptions and comfort related to your Google Activity data have changed over the week, and whether ADA influenced your awareness, privacy habits, or sense of control over your digital trace.
          </p>
        </div>

        {/* ── Defining Sensitive — signature callout ── */}
        <div className="l-callout">
          <span className="l-eyebrow">Defining "Sensitive"</span>
          <p>
            Throughout this survey, we will again use the word "sensitive" to
            refer to sensitive personal information — information people
            generally prefer to keep private. Examples may include personal
            data revealing religious or political views, sexual orientation,
            location patterns, financial transactions, health-related
            information, personal relationships, or any information that may
            cause discomfort or harm if misused or accessed without consent.
          </p>
        </div>

        {/* ── Instructions ── */}
        <div className="l-section">
          {/* <span className="l-eyebrow">Instructions</span> */}
          <p>

            Please answer the questions thoughtfully based on your experience
            of using the extension over the past 7 days. This survey will
            take approximately <strong>30 minutes</strong> to complete.
          </p>
        </div>

        <hr className="l-divider" />


        {/* ── Consent ── */}
        <div className="l-section">
          <span className="l-eyebrow">Consent</span>
          <p>
            By consenting, you confirm that you are at least 18 years old, have
            read and understood the information above, and agree to participate.
          </p>

          <div className="l-consent-options">
            <label className="l-radio-option">
              <input
                type="radio"
                name="consent"
                value="yes"
                checked={consent === "yes"}
                onChange={() => setConsent("yes")}
                disabled={busy}
              />
              <span>{" "}I consent, begin the study{" \t      "}</span>
            </label>
            <label className="l-radio-option">
              <input
                type="radio"
                name="consent"
                value="no"
                checked={consent === "no"}
                onChange={() => setConsent("no")}
                disabled={busy}
              />
              <span>{" "}I do not consent, I do not wish to participate</span>
            </label>
          </div>

          {consent === "no" && (
            <p className="l-consent-decline">
              As you do not wish to participate in this study, please return
              your submission on Prolific by clicking{" "}
              <a
                href="https://app.prolific.com/submissions/complete"
                className="l-decline-link"
              >
                here
              </a>

            </p>
          )}
        </div>

        {/* ── Prolific ID (only enabled once consent is given) ── */}
        <p className="l-form-label">
          Please enter your <strong>Prolific ID</strong> to begin. We need this
          to compensate you for your participation.
        </p>
        <form onSubmit={onStart}>
          <div className="l-form-row">
            <input
              className="l-input"
              type="text"
              placeholder="e.g. P1234ABCD"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              disabled={busy || consent !== "yes"}
            />
            <button
              className="l-btn"
              type="submit"
              disabled={busy || consent !== "yes" || !uid.trim()}
            >
              {busy ? "Please wait…" : "Start Survey →"}
            </button>
          </div>
        </form>
        <p className="l-hint">
          Your responses are saved anonymously under this Prolific ID.
        </p>
      </div>
    </div>
  );
}
