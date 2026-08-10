import { livingRoomLight, toggleLight } from "../state/lights.js";
import {
  livingRoomThermostat,
  increaseTemperature,
  decreaseTemperature,
} from "../state/thermostat.js";

function lightCardHTML() {
  const status = livingRoomLight.isOn ? "an" : "aus";
  const cardClass = livingRoomLight.isOn ? "card card--on" : "card";
  return `<div class="${cardClass}">
  <p class="card__name">${livingRoomLight.name}</p>
  <p class="card__status">${status}</p>
  <button id ="toggle-btn" class="card__button">Schalten</button>
  </div>
  `;
}

function thermostatCardHTML() {
  return `
  <div class="card">
  <p class="card__name">${livingRoomThermostat.name}</p>
  <p class="card__status">${livingRoomThermostat.temperature}°C</p>
  <button id="temp-down" class="card__button">-</button>
  <button id="temp-up" class="card__button">+</button>
  </div>
  `;
}

export function renderDashboard() {
  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = lightCardHTML() + thermostatCardHTML();

  document.getElementById("toggle-btn").addEventListener("click", () => {
    toggleLight();
    renderDashboard();
  });

  document.getElementById("temp-up").addEventListener("click", () => {
    increaseTemperature();
    renderDashboard();
  });

  document.getElementById("temp-down").addEventListener("click", () => {
    decreaseTemperature();
    renderDashboard();
  });
}
