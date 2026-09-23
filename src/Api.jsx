const BASE = import.meta.env.VITE_SURVEY_API_URL?.replace(/\/$/, "") ?? "";

async function _post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

async function _get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// Landing: has this prolific_id already submitted the post-usage survey?
export async function checkUidExistsPost(prolificId) {
  try {
    const data = await _get(`/survey_post/check?prolific_id=${encodeURIComponent(prolificId)}`);
    return data.exists === true;
  } catch {
    // return false; // fail open — let them proceed
    console.error("Error checking UID existence");
  }
}

// Landing: record participant arrival
export async function startSurveyPost(prolificId) {
  return _post("/survey_post/start", { prolific_id: prolificId });
}

// SurveyPage: save progress after each subsection
export async function saveProgressPost(prolificId, subsection, answers) {
  return _post("/survey_post/progress", {
    prolific_id: prolificId,
    subsection,
    answers,
  });
}

// SurveyPage: final submission after last subsection
export async function submitSurveyPost({ uid, answers }) {
  return _post("/survey_post/submit", {
    prolific_id: uid,
    answers,
  });
}