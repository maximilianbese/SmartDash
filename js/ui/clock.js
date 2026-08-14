// Live clock: refreshes the time display once per second.
export function updateClock() {
  const timeEl = document.getElementById("clock-time");
  if (timeEl) {
    const jetzt = new Date();
    const stunde = jetzt.getHours();
    const minute = jetzt.getMinutes();
    timeEl.textContent = `${stunde}:${String(minute).padStart(2, "0")}`;
  }
}
