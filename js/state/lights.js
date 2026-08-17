const STORAGE_KEY = "smartdash.lights";

const defaultLights = [
  {
    id: "living-room",
    name: "Wohnzimmer",
    icon: "💡",
    isOn: false,
    brightness: 100,
  },
  { id: "kitchen", name: "Küche", icon: "💡", isOn: false, brightness: 100 },
  {
    id: "bedroom",
    name: "Schlafzimmer",
    icon: "💡",
    isOn: false,
    brightness: 100,
  },
];

export const lights =
  JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? defaultLights;

export function toggleLight(id) {
  const light = lights.find((light) => light.id === id);
  light.isOn = !light.isOn;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lights));
}

export function addLight(name) {
  lights.push({
    id: crypto.randomUUID(),
    name: name,
    icon: "💡",
    isOn: false,
    brightness: 100,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lights));
}

export function removeLight(id) {
  const index = lights.findIndex((light) => light.id === id);
  lights.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lights));
}

export function setAllLights(isOn) {
  lights.forEach((light) => {
    light.isOn = isOn;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lights));
}

export function setLightBrightness(id, brightness) {
  const light = lights.find((light) => light.id === id);
  light.brightness = brightness;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lights));
}

export function moveLight(fromId, toId) {
  if (fromId === toId) return;
  const fromIndex = lights.findIndex((light) => light.id === fromId);
  const moved = lights.splice(fromIndex, 1)[0];
  const toIndex = lights.findIndex((light) => light.id === toId);
  lights.splice(toIndex, 0, moved);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lights));
}
