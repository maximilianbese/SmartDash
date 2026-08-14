// Entry point: boots the app by rendering the dashboard once.
import { renderDashboard } from "./ui/render.js";
import { updateClock } from "./ui/clock.js";
import { applySavedTheme, toggleTheme } from "./ui/theme.js";

applySavedTheme();
renderDashboard();
setInterval(updateClock, 1000);

document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
