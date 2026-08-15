// Dashboard controller: builds the current view and wires up events.
import { categories } from "../state/categories.js";
import { view, selectCategory, closeCategory } from "../state/view.js";
import {
  lights,
  toggleLight,
  addLight,
  removeLight,
  setAllLights,
  setLightBrightness,
} from "../state/lights.js";
import {
  thermostats,
  increaseTemperature,
  decreaseTemperature,
  addThermostat,
  removeThermostat,
  setAllTemperatures,
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
  sceneBarHTML,
  detailHeaderHTML,
  lightRoomCardHTML,
  musicRoomCardHTML,
  thermostatRoomCardHTML,
  addFormHTML,
  clockHeaderHTML,
  statusOverviewHTML,
  searchBarHTML,
  suggestionForHour,
  suggestionBannerHTML,
} from "./templates.js";

let lastRenderedCategory;
let dismissedSuggestion = null;

export function renderDashboard() {
  const dashboard = document.getElementById("dashboard");

  const viewChanged = view.selectedCategory !== lastRenderedCategory;
  lastRenderedCategory = view.selectedCategory;

  let html = "";

  const suggestion = suggestionForHour(new Date().getHours());
  const showSuggestion = suggestion && suggestion !== dismissedSuggestion;

  if (view.selectedCategory === null) {
    if (showSuggestion) html += suggestionBannerHTML(suggestion);
    html += clockHeaderHTML();
    html += statusOverviewHTML();
    html += categories.map(categoryCardHTML).join("");
    html += sceneBarHTML();
  } else {
    const activeCategory = categories.find(
      (category) => category.id === view.selectedCategory,
    );
    html += backButtonHTML();
    html += detailHeaderHTML(activeCategory);
    html += searchBarHTML();
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

    document.getElementById("good-morning").addEventListener("click", () => {
      setAllLights(true);
      setAllTemperatures(21);
      renderDashboard();
    });

    if (showSuggestion) {
      document
        .getElementById("suggestion-action")
        .addEventListener("click", () => {
          if (suggestion === "night") {
            setAllLights(false);
            setAllMusic(false);
          } else {
            setAllLights(true);
            setAllTemperatures(21);
          }
          renderDashboard();
        });
      document
        .getElementById("suggestion-dismiss")
        .addEventListener("click", () => {
          dismissedSuggestion = suggestion;
          renderDashboard();
        });
    }
  }

  if (view.selectedCategory !== null) {
    document.getElementById("back-button").addEventListener("click", () => {
      closeCategory();
      renderDashboard();
    });

    const searchInput = document.getElementById("room-search");
    const cards = document.querySelectorAll("[data-name]");
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const matches = card.dataset.name.includes(query);
        card.style.display = matches ? "" : "none";
        if (matches) visible++;
      });
      document.getElementById("search-count").textContent =
        `${visible} von ${cards.length}`;
    });
    searchInput.dispatchEvent(new Event("input"));
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

      document
        .getElementById(`brightness-${light.id}`)
        .addEventListener("input", (event) => {
          const value = Number(event.target.value);
          setLightBrightness(light.id, value);
          const icon = document.getElementById(`light-icon-${light.id}`);
          icon.style.opacity = 0.2 + (value / 100) * 0.8;
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
