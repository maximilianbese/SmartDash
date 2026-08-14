// Entry point: boots the app by rendering the dashboard once.
import { renderDashboard, updateClock } from "./ui/render.js";

renderDashboard();
setInterval(updateClock, 1000);
