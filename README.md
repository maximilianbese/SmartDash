# SmartDash 🏠

Ein interaktives Smart-Home-Dashboard – gebaut mit **purem Vanilla JavaScript** (ES-Module), ganz ohne Framework und ohne Build-Schritt. SmartDash steuert Geräte nach Kategorie und Raum, merkt sich jeden Zustand und fühlt sich mit gestaffelten Animationen und einer sauber getrennten Architektur wie eine echte App an.

🔗 **Live-Demo:** [smartdash.maximilian-bese.de](https://smartdash.maximilian-bese.de)

---

## Features

- **Zwei-Ebenen-Navigation** – Übersicht der Kategorien (Beleuchtung, Temperatur), Klick öffnet die zugehörigen Räume; die aktive Kategorie bleibt hervorgehoben.
- **Gerätesteuerung pro Raum** – Licht an/aus schalten, Temperatur in 1-°C-Schritten regeln (mit Min-/Max-Grenzen von 10–30 °C).
- **Volles CRUD** – Räume live anlegen (Formular) und wieder löschen (✕ pro Karte).
- **Persistenz** – jeder Zustand überlebt das Neuladen dank `localStorage` (als JSON gespeichert).
- **Responsives Karten-Grid** – ordnet sich per CSS Grid automatisch der Fensterbreite an.
- **Moderne Animationen** – gestaffelter Karten-Auftritt mit `@keyframes`, gezielt nur bei Ansichtswechseln (nicht bei jeder Interaktion).
- **Live-Gerätezähler** – jede Kategorie zeigt abgeleitet die Anzahl ihrer Räume.

## Tech-Stack

- **HTML5** – semantische Struktur
- **CSS3** – Custom Properties (Design-Tokens), Flexbox, Grid, Transitions & Keyframe-Animationen, modulare Dateien via `@import`
- **JavaScript (ES Modules)** – `import`/`export`, DOM-Rendering, Event-Handling, `map`/`filter`/`find`/`forEach`, `localStorage`
- **Kein Framework, kein Build** – läuft direkt im Browser über einen statischen Webserver

## Architektur

Der Code ist strikt nach Zuständigkeit getrennt (*Separation of Concerns*): State weiß nichts von der UI, die UI liest aus dem State.

```
SmartDash/
├── index.html              # Einstiegspunkt & Grundgerüst
├── css/
│   ├── main.css            # Aggregator (bündelt alle Teildateien)
│   ├── base/
│   │   ├── variables.css   # Design-Tokens (Farben, Abstände, Radien)
│   │   ├── reset.css       # moderner Reset + Basis-Typografie
│   │   └── layout.css      # App-Layout & Karten-Grid
│   └── components/
│       └── card.css        # Karten, Buttons, Zustände, Animationen
└── js/
    ├── main.js             # schlanker Einstiegspunkt (Composition Root)
    ├── state/
    │   ├── categories.js   # Menü-Kategorien
    │   ├── lights.js       # Lichter-Zustand + Persistenz
    │   ├── thermostat.js   # Thermostat-Zustand + Persistenz
    │   └── view.js         # Navigations-/View-Zustand
    └── ui/
        └── render.js       # rendert die Oberfläche & verdrahtet Events
```

## Lokale Entwicklung

Da SmartDash ES-Module nutzt, muss es über einen **HTTP-Server** laufen (nicht per Doppelklick über `file://`, sonst blockiert der Browser die Modul-Importe).

Am einfachsten mit der [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)-Erweiterung in VS Code – Rechtsklick auf `index.html` → *Open with Live Server*.

Oder mit Python:

```bash
python3 -m http.server 5500
# dann http://localhost:5500 öffnen
```

## Was ich dabei gelernt habe

Ein bewusstes Übungsprojekt, um Frontend-Grundlagen zu festigen und saubere, praxistaugliche Architektur zu lernen – Schwerpunkte:

- modulare Aufteilung mit ES-Modulen und klaren Verantwortlichkeiten
- datengesteuertes Rendern aus einem zentralen State
- View-State & bedingtes Rendern für die Navigation
- Persistenz mit `localStorage` und JSON
- moderne CSS-Techniken: Design-Tokens, Grid, gestaffelte Animationen

## Lizenz

Privates Portfolio-Projekt.
