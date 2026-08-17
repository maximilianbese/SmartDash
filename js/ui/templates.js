// UI templates: pure functions that turn state into HTML strings.
// No event wiring, no side effects — data in, markup out.
import { lights } from "../state/lights.js";
import { thermostats } from "../state/thermostat.js";
import { music } from "../state/music.js";

function deviceCountForCategory(categoryId) {
  if (categoryId === "lights") return lights.length;
  if (categoryId === "temperature") return thermostats.length;
  if (categoryId === "music") return music.length;
  return 0;
}

export function categoryCardHTML(category) {
  const count = deviceCountForCategory(category.id);
  return `
    <div class="card card--clickable" id="category-${category.id}">
      <p class="card__icon">${category.icon}</p>
      <p class="card__name">${category.name}</p>
      <p class="card__count">${count} ${count === 1 ? "Raum" : "Räume"}</p>
    </div>
  `;
}

export function backButtonHTML() {
  return `<button class="back-button" id="back-button">← Zurück</button>`;
}

export function sceneBarHTML() {
  return `
    <div class="scene-bar">
      <button class="scene-button scene-button--morning" id="good-morning">☀️ Guten Morgen · alles an</button>
      <button class="scene-button" id="good-night">🌙 Gute Nacht · alles aus</button>
    </div>
  `;
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

export function detailHeaderHTML(category) {
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

export function searchBarHTML() {
  return `
  <div class="search">
  <input class="search-bar" id="room-search" type="search" placeholder="Raum suchen..." />
  <span class="search__count" id="search-count"></span>
  </div>
  `;
}

export function lightRoomCardHTML(light) {
  const status = light.isOn ? "an" : "aus";
  const cardClass = light.isOn ? "card card--on" : "card";
  const sliderClass = light.isOn
    ? "card__slider"
    : "card__slider card__slider--hidden";
  const iconOpacity = 0.2 + (light.brightness / 100) * 0.8;
  return `
    <div class="${cardClass}" id="light-card-${light.id}" data-name="${light.name.toLowerCase()}" draggable="true">
      <p class="card__icon" id="light-icon-${light.id}" style="opacity: ${iconOpacity}">${light.icon}</p>
      <p class="card__name">${light.name}</p>
      <p class="card__status">${status}</p>
      <div class="card__actions">
        <button class="card__button" id="toggle-${light.id}">Schalten</button>
        <button class="card__button card__button--danger" id="delete-${light.id}">✕</button>
      </div>
      <input type="range" class="${sliderClass}" id="brightness-${light.id}" min="0" max="100" value="${light.brightness}" />
    </div>
  `;
}

export function musicRoomCardHTML(speaker) {
  const status = speaker.isOn ? "spielt" : "aus";
  const cardClass = speaker.isOn ? "card card--on" : "card";
  const buttonLabel = speaker.isOn ? "Pause" : "Play";
  const sliderClass = speaker.isOn
    ? "card__slider"
    : "card__slider card__slider--hidden";
  return `
    <div class="${cardClass}" id="music-card-${speaker.id}" data-name="${speaker.name.toLowerCase()}" draggable="true">
      <p class="card__icon">${speaker.icon}</p>
      <p class="card__name">${speaker.name}</p>
      <p class="card__status">${status}</p>
      <div class="card__actions">
        <button class="card__button" id="toggle-music-${speaker.id}">${buttonLabel}</button>
      </div>
      <input type="range" class="${sliderClass}" id="volume-${speaker.id}" min="0" max="100" value="${speaker.volume}" />
    </div>
  `;
}

export function thermostatRoomCardHTML(thermostat) {
  return `
    <div class="card" id="thermostat-card-${thermostat.id}" data-name="${thermostat.name.toLowerCase()}" draggable="true">
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

export function addFormHTML() {
  return `
    <form class="add-form" id="add-form">
      <input class="add-form__input" id="add-input" placeholder="Neuer Raum…" />
      <button class="add-form__button card__button" type="submit">Hinzufügen</button>
    </form>
  `;
}

export function suggestionForHour(hour) {
  if (hour >= 22 || hour <= 4) return "night";
  if (hour >= 5 && hour <= 9) return "morning";
  return null;
}

export function suggestionBannerHTML(suggestion) {
  const text =
    suggestion === "night"
      ? {
          icon: "🌙",
          title: "Zeit fürs Bett?",
          sub: "Gute-Nacht-Szene aktivieren und alles ausschalten.",
          label: "Gute Nacht",
        }
      : {
          icon: "☀️",
          title: "Guten Morgen!",
          sub: "Lichter an und Wohlfühl-Temperatur setzen.",
          label: "Guten Morgen",
        };

  return `
  <div class="suggestion suggestion--${suggestion}">
  <div class="suggestion__info">
  <span class="suggestion__icon">${text.icon}</span>
  <div>
  <p class="suggestion__title">${text.title}</p>
  <p class="suggestion__sub">${text.sub}</p>
  </div>
  </div>
  <div class="suggestion__actions">
  <button class="scene-button suggestion__accept" id="suggestion-action">${text.label}</button>
  <button class="suggestion__dismiss" id="suggestion-dismiss" aria-label="Vorschlag schließen">✕</button>
  </div>
  </div>
  `;
}

function greetingForHour(stunde) {
  if (stunde >= 5 && stunde <= 11) {
    return "Guten Morgen ☀️";
  } else if (stunde >= 12 && stunde <= 17) {
    return "Guten Tag 🌤️";
  } else if (stunde >= 18 && stunde <= 22) {
    return "Guten Abend 🌆";
  } else {
    return "Gute Nacht 🌙";
  }
}

export function clockHeaderHTML() {
  const jetzt = new Date();
  const stunde = jetzt.getHours();
  const minute = jetzt.getMinutes();
  const uhrzeit = `${stunde}:${String(minute).padStart(2, "0")}`;

  return `
  <div class="clock-header">
    <p class="clock-header__greeting">${greetingForHour(stunde)}</p>
    <p class="clock-header__time" id="clock-time">${uhrzeit}</p>
  </div>
  `;
}

export function statusOverviewHTML() {
  const lightsOn = lights.filter((light) => light.isOn).length;
  const musicOn = music.filter((speaker) => speaker.isOn).length;
  const avgTemp =
    thermostats.reduce(
      (summe, thermostat) => summe + thermostat.temperature,
      0,
    ) / thermostats.length;

  return `
    <div class="status-overview">
      <div class="status-card">
        <p class="status-card__label">💡 Lichter an</p>
        <p class="status-card__value">${lightsOn} <span class="status-card__unit">von ${lights.length}</span></p>
      </div>
      <div class="status-card">
        <p class="status-card__label">🌡️ Ø Temperatur</p>
        <p class="status-card__value">${avgTemp.toFixed(1).replace(".", ",")} <span class="status-card__unit">°C</span></p>
      </div>
      <div class="status-card">
        <p class="status-card__label">🔊 Musik</p>
        <p class="status-card__value">${musicOn} <span class="status-card__unit">spielt</span></p>
      </div>
    </div>
  `;
}
