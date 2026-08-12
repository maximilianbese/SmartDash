const STORAGE_KEY = "smartdash.music";

const defaultMusic = [
  {
    id: "living-room",
    name: "Wohnzimmer",
    icon: "🔊",
    isOn: false,
    volume: 50,
  },
  { id: "kitchen", name: "Küche", icon: "🔊", isOn: false, volume: 50 },
  { id: "bedroom", name: "Schlafzimmer", icon: "🔊", isOn: false, volume: 50 },
];

export const music =
  JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? defaultMusic;

export function toggleMusic(id) {
  const speaker = music.find((speaker) => speaker.id === id);
  speaker.isOn = !speaker.isOn;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(music));
}

export function setMusicVolume(id, volume) {
  const speaker = music.find((speaker) => speaker.id === id);
  speaker.volume = volume;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(music));
}
