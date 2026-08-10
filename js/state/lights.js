const STORAGE_KEY = "smartdash.livingRoomLight.isOn";

export const livingRoomLight = {
  name: "Wohnzimmer",
  isOn: localStorage.getItem(STORAGE_KEY) === "true",
};

export function toggleLight() {
  livingRoomLight.isOn = !livingRoomLight.isOn;
  localStorage.setItem(STORAGE_KEY, livingRoomLight.isOn);
}
