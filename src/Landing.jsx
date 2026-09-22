import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUidExists, startSurvey } from "./Api";
import "./Landing.css";

export default function Landing() {
  // const [uid, setUid] = useState("");
  // const [busy, setBusy] = useState(false);
  // const navigate = useNavigate();
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
      const exists = await checkUidExists(trimmed);
      if (exists) {
        alert(
          "Our records show that you have already completed this survey. Thank you!",
        );
        return;
      }
      // send both consent + uid together in one call
      await startSurvey(trimmed, consent);

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
          Understanding User Perceptions of a Data Dashboard
        </h1>
        <p className="l-salutation">Dear Participant,</p>

        {/* ── Background ── */}
        <div className="l-section">
          {/* <span className="l-eyebrow">Background</span> */}
          <p>
            {/* Today, a wide range of online services offered by Google—such as Search, YouTube,
            Maps, Chrome, and others—collect and store detailed records of users' digital
            activities to improve personalization and service quality. */}
            We are a team of researchers from IIT Kharagpur, India, and MPI-SP,
            Germany, working towards the goal of supporting users to better
            manage privacy of their online activity data. Companies can collect
            a lot of personal and sensitive information about users (like
            yourself) from their online activity, often unknown to the user.
            However, using data dashboards, it is possible to see and understand
            what companies know about you.
          </p>
        </div>

        {/* ── About ── */}
        <div className="l-section">
          {/* <span className="l-eyebrow">About This Study</span> */}
          <p>
            To better facilitate this understanding, we built ADA (Adaptive data
            DAshboard): a data dashboard for auditing your online activity. ADA
            organizes your Google Activity data (You may explore the
            Google activity dashboard&nbsp;
            <a
              href="https://myactivity.google.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            ). ADA supports you in visualising the collected data, helping you
            audit your online activity and taking control of your privacy. To
            preserve your privacy, ADA works locally, i.e., your data never
            leaves your browser.
          </p>
        </div>

        {/* ── Goals ── */}
        <div className="l-section">
          {/* <span className="l-eyebrow">Study Goals</span> */}
          <p>The goal of our study is to understand three things:</p>

          <div className="l-goals-grid">
            <div className="l-goal-card">
              <span className="l-goal-icon">🔍</span>
              <h4>Awareness</h4>
              <p>
                What types of activity data Google collects across its services.
              </p>
            </div>
            <div className="l-goal-card">
              <span className="l-goal-icon">🔒</span>
              <h4>Sensitivity</h4>
              <p>How you perceive the sensitivity of this stored data.</p>
            </div>
            <div className="l-goal-card">
              <span className="l-goal-icon">🎛️</span>
              <h4>Control</h4>
              <p>
                The extent of control you feel you have over your digital
                activity records.
              </p>
            </div>
          </div>

          <p>
            Your thoughtful and honest responses will directly contribute to
            this understanding. Please read the instructions carefully and
            answer all questions thoughtfully. This survey will take
            approximately <strong>35 minutes</strong> to complete.
          </p>
        </div>

        {/* ── Instructions ── */}
        <div className="l-section">
          {/* <span className="l-eyebrow">Instructions</span> */}
          <p>
            Throughout the survey, you will be asked questions in the context of
            the <strong>Google Account and device you use most often</strong>,
            unless stated otherwise.
          </p>
        </div>

        {/* ── Defining Sensitive — signature callout ── */}
        <div className="l-callout">
          <span className="l-eyebrow">Defining "Sensitive"</span>
          <p>
            The term <strong>"sensitive"</strong> refers to sensitive personal
            information stored within your Google "My Activity" dashboard — data
            a person may prefer to keep private. This may include personal data
            revealing racial or ethnic origin, political opinions, religious or
            philosophical beliefs, biometric or health-related information,
            financial information, sexual orientation, or any personal activity
            that could cause discomfort, embarrassment, harm, or privacy risks
            if exposed. Loss, misuse, modification, or unauthorized access to
            such information can adversely affect the privacy or welfare of an
            individual depending on the level of sensitivity and nature of the
            information.
          </p>
        </div>

        {/* ── Data & Privacy ── */}
        <div className="l-section">
          <div className="l-privacy-split">
            {/* Left: 75% — main privacy content */}
            <div className="l-privacy-main">
              <span className="l-eyebrow">Data &amp; Privacy</span>
              <p>
                Your responses will be used{" "}
                <strong>strictly for academic research</strong> — to understand
                the challenges users face when managing their data through the
                Google "My Activity" dashboard, and to help design better tools
                for privacy awareness and user control.
              </p>

              <ul className="l-privacy-list">
                <li>
                  <span className="l-privacy-icon">✅</span>
                  <span>
                    <strong>We only collect</strong> interaction logs with the
                    extension.
                  </span>
                </li>
                <li>
                  <span className="l-privacy-icon">🚫</span>
                  <span>
                    <strong>We never publish</strong> any personally
                    identifiable information in any report or publication.
                  </span>
                </li>
                <li>
                  <span className="l-privacy-icon">🎓</span>
                  <span>
                    <strong>Used only</strong> for academic research purposes.
                  </span>
                </li>
              </ul>
            </div>

            {/* Right: 25% — contact */}
            <div className="l-contact-box">
              <span className="l-contact-icon">✉️</span>
              <span className="l-contact-label">
                Questions about the study?
              </span>
              <a href="mailto:usabilityresearch.iitkgp25@gmail.com">
                usabilityresearch.iitkgp25@gmail.com
              </a>
            </div>
          </div>
        </div>

        <hr className="l-divider" />

        {/* <p className="l-form-label">
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
              disabled={busy}
            />
            <button className="l-btn" type="submit" disabled={busy}>
              {busy ? "Please wait…" : "Start Survey →"}
            </button>
          </div>
        </form>
        <p className="l-hint">
          Your responses are saved anonymously under this Prolific ID.
        </p> */}
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
