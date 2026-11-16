// Set via REACT_APP_FLASK_BACKEND_URL in .env / .env.macos (read when the dev server starts)
export const FLASK_BACKEND_URL =
  process.env.REACT_APP_FLASK_BACKEND_URL || "http://localhost:5000";
