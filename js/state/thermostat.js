const STORAGE_KEY = "smartdash.thermostats";
const MIN_TEMP = 10;
const MAX_TEMP = 30;

const defaultThermostats = [
  { id: "living-room", name: "Wohnzimmer", icon: "🌡️", temperature: 21 },
  { id: "kitchen", name: "Küche", icon: "🌡️", temperature: 20 },
  { id: "bedroom", name: "Schlafzimmer", icon: "🌡️", temperature: 18 },
];

export const thermostats =
  JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? defaultThermostats;

export function increaseTemperature(id) {
  const thermostat = thermostats.find((thermostat) => thermostat.id === id);
  if (thermostat.temperature < MAX_TEMP) {
    thermostat.temperature += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thermostats));
  }
}

export function decreaseTemperature(id) {
  const thermostat = thermostats.find((thermostat) => thermostat.id === id);
  if (thermostat.temperature > MIN_TEMP) {
    thermostat.temperature -= 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thermostats));
  }
}

export function addThermostat(name) {
  thermostats.push({
    id: crypto.randomUUID(),
    name: name,
    icon: "🌡️",
    temperature: 20,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(thermostats));
}

export function removeThermostat(id) {
  const index = thermostats.findIndex((thermostat) => thermostat.id === id);
  thermostats.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(thermostats));
}
