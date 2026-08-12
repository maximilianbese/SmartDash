import { categories } from "../state/categories.js";
import { view, selectCategory, closeCategory } from "../state/view.js";
import {
  lights,
  toggleLight,
  addLight,
  removeLight,
  setAllLights,
} from "../state/lights.js";
import {
  thermostats,
  increaseTemperature,
  decreaseTemperature,
  addThermostat,
  removeThermostat,
} from "../state/thermostat.js";
import { confirmDialog } from "./confirmDialog.js";

let lastRenderedCategory;

function deviceCountForCategory(categoryId) {
  if (categoryId === "lights") return lights.length;
  if (categoryId === "temperature") return thermostats.length;
  return 0;
}

function categoryCardHTML(category) {
  const count = deviceCountForCategory(category.id);
  return `
    <div class="card card--clickable" id="category-${category.id}">
      <p class="card__icon">${category.icon}</p>
      <p class="card__name">${category.name}</p>
      <p class="card__count">${count} ${count === 1 ? "Raum" : "Räume"}</p>
    </div>
  `;
}

function backButtonHTML() {
  return `<button class="back-button" id="back-button">← Zurück</button>`;
}

function segmentedHTML() {
  const allOn = lights.length > 0 && lights.every((light) => light.isOn);
  const allOff = lights.every((light) => !light.isOn);
  const onClass = allOn
    ? "segmented__btn segmented__btn--on segmented__btn--active"
    : "segmented__btn segmented__btn--on";
  const offClass = allOff
    ? "segmented__btn segmented__btn--off segmented__btn--active"
    : "segmented__btn segmented__btn--off";
  return `
    <div class="segmented">
      <button class="${onClass}" id="all-on">An</button>
      <button class="${offClass}" id="all-off">Aus</button>
    </div>
  `;
}

function detailHeaderHTML(category) {
  const count = deviceCountForCategory(category.id);
  const controls = category.id === "lights" ? segmentedHTML() : "";
  return `
    <div class="detail-header">
      <div class="detail-header__info">
        <span class="detail-header__icon">${category.icon}</span>
        <div class="detail-header__text">
          <p class="detail-header__name">${category.name}</p>
          <p class="detail-header__count">${count} ${count === 1 ? "Raum" : "Räume"}</p>
        </div>
      </div>
      ${controls}
    </div>
  `;
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

export function renderDashboard() {
  const dashboard = document.getElementById("dashboard");

  const viewChanged = view.selectedCategory !== lastRenderedCategory;
  lastRenderedCategory = view.selectedCategory;

  let html = "";

  if (view.selectedCategory === null) {
    html += categories.map(categoryCardHTML).join("");
  } else {
    const activeCategory = categories.find(
      (category) => category.id === view.selectedCategory,
    );
    html += backButtonHTML();
    html += detailHeaderHTML(activeCategory);
  }

  if (view.selectedCategory === "lights") {
    html += addFormHTML();
    html += lights.map(lightRoomCardHTML).join("");
  }

  if (view.selectedCategory === "temperature") {
    html += addFormHTML();
    html += thermostats.map(thermostatRoomCardHTML).join("");
  }

  dashboard.innerHTML = html;

  dashboard.classList.remove("dashboard--animate");
  if (viewChanged) {
    void dashboard.offsetWidth;
    dashboard.classList.add("dashboard--animate");
  }

  if (view.selectedCategory === null) {
    categories.forEach((category) => {
      document
        .getElementById(`category-${category.id}`)
        .addEventListener("click", () => {
          selectCategory(category.id);
          renderDashboard();
        });
    });
  }

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
        .addEventListener("click", async () => {
          const confirmed = await confirmDialog(
            `„${light.name}" wirklich löschen?`,
          );
          if (confirmed) {
            removeLight(light.id);
            renderDashboard();
          }
        });
    });

    document.getElementById("all-on").addEventListener("click", () => {
      setAllLights(true);
      renderDashboard();
    });

    document.getElementById("all-off").addEventListener("click", () => {
      setAllLights(false);
      renderDashboard();
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
        .addEventListener("click", async () => {
          const confirmed = await confirmDialog(
            `„${thermostat.name}" wirklich löschen?`,
          );
          if (confirmed) {
            removeThermostat(thermostat.id);
            renderDashboard();
          }
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
