import { categories } from "../state/categories.js";
import { view, selectCategory, closeCategory } from "../state/view.js";
import { lights, toggleLight, addLight, removeLight } from "../state/lights.js";
import {
  thermostats,
  increaseTemperature,
  decreaseTemperature,
  addThermostat,
  removeThermostat,
} from "../state/thermostat.js";

let lastRenderedCategory;

function deviceCountForCategory(categoryId) {
  if (categoryId === "lights") return lights.length;
  if (categoryId === "temperature") return thermostats.length;
}

function categoryCardHTML(category) {
  const isActive = view.selectedCategory === category.id;
  const cardClass = isActive
    ? "card card--clickable card--active"
    : "card card--clickable";
  const count = deviceCountForCategory(category.id);
  return `
    <div class="${cardClass}" id="category-${category.id}">
      <p class="card__icon">${category.icon}</p>
      <p class="card__name">${category.name}</p>
      <p class="card__count">${count} ${count === 1 ? "Raum" : "Räume"}</p>
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
        <button class="card__button card__button--danger" id="delete-${light.id}">✕</button>
      </div>
    </div>
  `;
}

function addFormHTML() {
  return `
    <form class="add-form" id="add-form">
      <input class="add-form__input" id="add-input" placeholder="Neuer Raum…" />
      <button class="add-form__button card__button" type="submit">Hinzufügen</button>
    </form>
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
  <button class="card__button card__button--danger" id="delete-${thermostat.id}">✕</button>

  </div>
  </div>`;
}

export function renderDashboard() {
  const dashboard = document.getElementById("dashboard");

  const viewChanged = view.selectedCategory !== lastRenderedCategory;
  lastRenderedCategory = view.selectedCategory;

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
    html += addFormHTML();
  }

  if (view.selectedCategory === "temperature") {
    html += thermostats.map(thermostatRoomCardHTML).join("");
    html += addFormHTML();
  }

  dashboard.innerHTML = html;

  dashboard.classList.remove("dashboard--animate");
  if (viewChanged) {
    void dashboard.offsetWidth;
    dashboard.classList.add("dashboad--animate");
  }

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

      document
        .getElementById(`delete-${light.id}`)
        .addEventListener("click", () => {
          removeLight(light.id);
          renderDashboard();
        });
    });

    document.getElementById("add-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.getElementById("add-input");
      const name = input.value.trim();
      if (name !== "") {
        addLight(name);
        renderDashboard();
      }
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

      document
        .getElementById(`delete-${thermostat.id}`)
        .addEventListener("click", () => {
          removeThermostat(thermostat.id);
          renderDashboard();
        });
    });

    document.getElementById("add-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.getElementById("add-input");
      const name = input.value.trim();
      if (name !== "") {
        addThermostat(name);
        renderDashboard();
      }
    });
  }
}
