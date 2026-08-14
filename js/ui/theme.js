// Theme switch: toggles light/dark and remember the choice.

const STORAGE_KEY = "smartdash.theme";

function updateIcon() {
  const button = document.getElementById("theme-toggle");
  const isLight = document.documentElement.classList.contains("theme-light");
  button.textContent = isLight ? "☀️" : "🌙";
}

export function applySavedTheme() {
  if (localStorage.getItem(STORAGE_KEY) === "light") {
    document.documentElement.classList.add("theme-light");
  }
  updateIcon();
}

export function toggleTheme() {
  const isLight = document.documentElement.classList.toggle("theme-light");
  localStorage.setItem(STORAGE_KEY, isLight ? "light" : "dark");
  updateIcon();
}
