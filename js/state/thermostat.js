const STORAGE_KEY = "smartdash.livingRoomThermostat.temperature";
const MIN_TEMP = 10;
const MAX_TEMP = 30;

export const livingRoomThermostat = {
  name: "Wohnzimmer",
  temperature: Number(localStorage.getItem(STORAGE_KEY)) || 21,
};

export function increaseTemperature() {
  if (livingRoomThermostat.temperature < MAX_TEMP) {
    livingRoomThermostat.temperature += 1;
    localStorage.setItem(STORAGE_KEY, livingRoomThermostat.temperature);
  }
}

export function decreaseTemperature() {
  if (livingRoomThermostat.temperature > MIN_TEMP) {
    livingRoomThermostat.temperature -= 1;
    localStorage.setItem(STORAGE_KEY, livingRoomThermostat.temperature);
  }
}
