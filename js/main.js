// Entry point: boots the app by rendering the dashboard once.
import { renderDashboard } from "./ui/render.js";
import { updateClock } from "./ui/clock.js";

renderDashboard();
setInterval(updateClock, 1000);
