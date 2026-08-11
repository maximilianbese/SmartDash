const STORAGE_KEY = "smartdash.lights";

const defaultLights = [
  { id: "living-room", name: "Wohnzimmer", icon: "💡", isOn: false },
  { id: "kitchen", name: "Küche", icon: "💡", isOn: false },
  { id: "bedroom", name: "Schlafzimmer", icon: "💡", isOn: false },
];

export const lights =
  JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? defaultLights;

export function toggleLight(id) {
  const light = lights.find((light) => light.id === id);
  light.isOn = !light.isOn;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lights));
}
