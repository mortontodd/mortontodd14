:root {
  --bg: #07111f;
  --panel: #101827;
  --field: #0f7a3b;
  --field-dark: #0a5d2d;
  --accent: #cc0033;
  --text: #ffffff;
  --muted: #9ca3af;
  --good: #22c55e;
  --neutral: #38bdf8;
  --bad: #ef4444;
}

body {
  margin: 0;
  font-family: Arial;
  background: var(--bg);
  color: white;
}

.game-container {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
}

/* HEADER */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scoreboard div {
  display: inline-block;
  margin-left: 10px;
}

/* FIELD */
.field {
  position: relative;
  height: 200px;
  border-radius: 12px;
  background: repeating-linear-gradient(
    90deg,
    var(--field) 0%,
    var(--field) 12%,
    var(--field-dark) 12%,
    var(--field-dark) 13%
  );
}

.yard-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: left 0.4s;
}

.yard-lines {
  position: absolute;
  bottom: 5px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.field-info {
  margin-top: 10px;
}

/* BUTTONS */
.controls {
  margin-top: 20px;
}

.play-btn {
  margin: 5px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.play-btn:hover {
  transform: scale(1.05);
}

/* DECISION AREA */
.decision {
  margin-top: 20px;
}

.hidden {
  display: none;
}

.options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.option-card {
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: 0.2s;
  background: #1e293b;
}

.option-card:hover {
  transform: scale(1.05);
}

/* COLOR CODING */
.good {
  border-color: var(--good);
}

.neutral {
  border-color: var(--neutral);
}

.bad {
  border-color: var(--bad);
}

/* RESULT */
.result-section {
  margin-top: 20px;
  text-align: center;
}

/* LOG */
.log-section {
  margin-top: 20px;
}

.log-item {
  padding: 8px;
  margin-bottom: 5px;
  background: #1e293b;
  border-left: 4px solid var(--neutral);
}

.log-item.good {
  border-color: var(--good);
}

.log-item.bad {
  border-color: var(--bad);
}

.log-item.td {
  border-color: gold;
}

/* RESET */
.reset-section {
  text-align: center;
  margin-top: 20px;
}