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
