import { APP_NAME } from "./config.js";
import { livingRoomLight } from "./state/lights.js";

function renderLight() {
  const dashboard = document.getElementById("dashboard");
  const status = livingRoomLight.isOn ? "an" : "aus";

  dashboard.innerHTML = `
  <div class="card">
  <p class="card__name">${livingRoomLight.name}</p>
  <p class="card__status">${status}</p>
  <button id="toggle-btn" class="card__button">Schalten</button>
  </div>`;

  const toggleButton = document.getElementById("toggle-btn");
  toggleButton.addEventListener("click", toggleLight);
}

function toggleLight() {
  livingRoomLight.isOn = !livingRoomLight.isOn;
  renderLight();
}

renderLight();

console.log("Lichtobjekt:", livingRoomLight);
