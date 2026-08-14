// Dashboard controller: builds the current view and wires up events.
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
import {
  music,
  toggleMusic,
  setMusicVolume,
  setAllMusic,
} from "../state/music.js";
import {
  categoryCardHTML,
  backButtonHTML,
  goodNightButtonHTML,
  detailHeaderHTML,
  lightRoomCardHTML,
  musicRoomCardHTML,
  thermostatRoomCardHTML,
  addFormHTML,
  clockHeaderHTML,
  statusOverviewHTML,
} from "./templates.js";

let lastRenderedCategory;

export function renderDashboard() {
  const dashboard = document.getElementById("dashboard");

  const viewChanged = view.selectedCategory !== lastRenderedCategory;
  lastRenderedCategory = view.selectedCategory;

  let html = "";

  if (view.selectedCategory === null) {
    html += clockHeaderHTML();
    html += statusOverviewHTML();
    html += categories.map(categoryCardHTML).join("");
    html += goodNightButtonHTML();
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

  if (view.selectedCategory === "music") {
    html += music.map(musicRoomCardHTML).join("");
  }

  dashboard.innerHTML = html;

  dashboard.classList.remove("dashboard--animate");
  if (viewChanged) {
    void dashboard.offsetWidth;
    dashboard.classList.add("dashboard--animate");
  }

  // --- Wire events: start view ---
  if (view.selectedCategory === null) {
    categories.forEach((category) => {
      document
        .getElementById(`category-${category.id}`)
        .addEventListener("click", () => {
          selectCategory(category.id);
          renderDashboard();
        });
    });

    document.getElementById("good-night").addEventListener("click", () => {
      setAllLights(false);
      setAllMusic(false);
      renderDashboard();
    });
  }

  if (view.selectedCategory !== null) {
    document.getElementById("back-button").addEventListener("click", () => {
      closeCategory();
      renderDashboard();
    });
  }

  // --- Wire events: lights ---
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

  // --- Wire events: temperature ---
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

  // --- Wire events: music ---
  if (view.selectedCategory === "music") {
    music.forEach((speaker) => {
      document
        .getElementById(`toggle-music-${speaker.id}`)
        .addEventListener("click", () => {
          toggleMusic(speaker.id);
          renderDashboard();
        });

      document
        .getElementById(`volume-${speaker.id}`)
        .addEventListener("input", (event) => {
          setMusicVolume(speaker.id, Number(event.target.value));
        });
    });
  }
}
