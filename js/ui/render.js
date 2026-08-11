import { categories } from "../state/categories.js";
import { view, selectCategory, closeCategory } from "../state/view.js";
import { lights, toggleLight } from "../state/lights.js";
import {
  thermostats,
  increaseTemperature,
  decreaseTemperature,
} from "../state/thermostat.js";

function categoryCardHTML(category) {
  const isActive = view.selectedCategory === category.id;
  const cardClass = isActive
    ? "card card--clickable card--active"
    : "card card--clickable";
  return `
    <div class="${cardClass}" id="category-${category.id}">
      <p class="card__icon">${category.icon}</p>
      <p class="card__name">${category.name}</p>
    </div>
  `;
}

function backButtonHTML() {
  return `<button class="back-button" id="back-button">← Zurück</button>`;
}

function lightRoomCardHTML(light) {
  const status = light.isOn ? "an" : "aus";
  const cardClass = light.isOn ? "card card--on" : "card";
  return `
    <div class="${cardClass}">
      <p class="card__icon">${light.icon}</p>
      <p class="card__name">${light.name}</p>
      <p class="card__status">${status}</p>
      <div class="card__actions">
        <button class="card__button" id="toggle-${light.id}">Schalten</button>
      </div>
    </div>
  `;
}

function thermostatRoomCardHTML(thermostat) {
  return `
  <div class="card">
  <p class="card__icon">${thermostat.icon}</p>
  <p class="card__name">${thermostat.name}</p>
  <p class="card__status">${thermostat.temperature}°C</p>
  <div class="card__actions">
  <button class="card__button" id="temp-down-${thermostat.id}">-</button>
  <button class="card__button" id="temp-up-${thermostat.id}">+</button>
  </div>
  </div>`;
}

export function renderDashboard() {
  const dashboard = document.getElementById("dashboard");

  const visibleCategories =
    view.selectedCategory === null
      ? categories
      : categories.filter((category) => category.id === view.selectedCategory);

  let html = "";
  if (view.selectedCategory !== null) {
    html += backButtonHTML();
  }
  html += visibleCategories.map(categoryCardHTML).join("");

  if (view.selectedCategory === "lights") {
    html += lights.map(lightRoomCardHTML).join("");
  }

  if (view.selectedCategory === "temperature") {
    html += thermostats.map(thermostatRoomCardHTML).join("");
  }

  dashboard.innerHTML = html;

  visibleCategories.forEach((category) => {
    document
      .getElementById(`category-${category.id}`)
      .addEventListener("click", () => {
        selectCategory(category.id);
        renderDashboard();
      });
  });

  if (view.selectedCategory !== null) {
    document.getElementById("back-button").addEventListener("click", () => {
      closeCategory();
      renderDashboard();
    });
  }

  if (view.selectedCategory === "lights") {
    lights.forEach((light) => {
      document
        .getElementById(`toggle-${light.id}`)
        .addEventListener("click", () => {
          toggleLight(light.id);
          renderDashboard();
        });
    });
  }

  if (view.selectedCategory === "temperature") {
    thermostats.forEach((thermostat) => {
      document
        .getElementById(`temp-up-${thermostat.id}`)
        .addEventListener("click", () => {
          increaseTemperature(thermostat.id);
          renderDashboard();
        });

      document
        .getElementById(`temp-down-${thermostat.id}`)
        .addEventListener("click", () => {
          decreaseTemperature(thermostat.id);
          renderDashboard();
        });
    });
  }
}
