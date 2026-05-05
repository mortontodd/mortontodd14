let config = null;

let score = 0;
let drives = 0;
let touchdowns = 0;
let turnovers = 0;

let yardLine = 20;
let down = 1;
let yardsToGo = 10;
let driveStart = 20;
let driveYards = 0;
let momentum = 50;
let gameActive = true;

const scoreEl = document.getElementById("score");
const drivesEl = document.getElementById("drives");
const touchdownsEl = document.getElementById("touchdowns");
const downDisplayEl = document.getElementById("downDisplay");
const yardLineEl = document.getElementById("yardLine");
const yardsToGoEl = document.getElementById("yardsToGo");
const yardMarkerEl = document.getElementById("yardMarker");
const playResultEl = document.getElementById("playResult");
const logEl = document.getElementById("log");

const decisionArea = document.getElementById("decisionArea");
const optionsContainer = document.getElementById("optionsContainer");

const playButtons = document.querySelectorAll(".play-btn");
const newDriveBtn = document.getElementById("newDriveBtn");

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    config = data;
    startNewDrive();
  });

playButtons.forEach(btn => {
  btn.addEventListener("click", () => choosePlay(btn.dataset.play));
});

newDriveBtn.addEventListener("click", startNewDrive);

function startNewDrive() {
  drives++;
  yardLine = 20;
  down = 1;
  yardsToGo = 10;
  driveStart = 20;
  driveYards = 0;
  momentum = 50;
  gameActive = true;

  logEl.innerHTML = "";
  decisionArea.classList.add("hidden");

  addLog("New drive started at the 20-yard line.", "good");
  playResultEl.textContent = "Choose your play.";
  updateUI();
}

function choosePlay(type) {
  if (!gameActive) return;

  optionsContainer.innerHTML = "";
  decisionArea.classList.remove("hidden");

  if (type === "run" || type === "qbSneak") {
    showRunOptions(type);
  } else {
    showPassOptions(type);
  }
}

function showRunOptions(type) {
  const lanes = ["Left", "Middle", "Right"];

  lanes.forEach(lane => {
    const pressure = randomFrom(config.defense.runPressure);

    const btn = document.createElement("button");
    btn.className = `option-card ${pressure.class}`;
    btn.innerHTML = `<strong>${lane}</strong><br>${pressure.name}`;

    btn.onclick = () => resolveRun(type, lane, pressure);
    optionsContainer.appendChild(btn);
  });
}

function showPassOptions(type) {
  const receivers = type === "shortPass"
    ? config.receivers.short
    : config.receivers.deep;

  receivers.forEach(r => {
    const coverage = randomFrom(config.defense.coverage);

    const btn = document.createElement("button");
    btn.className = `option-card ${coverage.class}`;
    btn.innerHTML = `
      <strong>${r.name}</strong><br>
      ${r.route}<br>
      ${coverage.name}
    `;

    btn.onclick = () => resolvePass(type, r, coverage);
    optionsContainer.appendChild(btn);
  });
}

function resolveRun(type, lane, pressure) {
  let play = config.plays[type];
  let yards = randomInt(play.min, play.max);

  yards += pressure.yardModifier;

  if (Math.random() < play.turnoverChance + pressure.turnoverModifier) {
    turnover("Fumble! Turnover.");
    return;
  }

  applyPlay(yards, `Run to ${lane}: ${yards} yards`);
}

function resolvePass(type, receiver, coverage) {
  let play = config.plays[type];

  let completion = play.completionChance + coverage.completionModifier;
  let interception = play.turnoverChance + coverage.turnoverModifier;

  let roll = Math.random();

  if (roll < interception) {
    turnover("Intercepted!");
    return;
  }

  if (roll > completion) {
    applyPlay(0, "Incomplete pass");
    return;
  }

  let yards = receiver.yards + randomInt(-2, 5);

  applyPlay(yards, `${receiver.name} catches for ${yards} yards`);
}

function applyPlay(yards, text) {
  yardLine += yards;
  yardLine = clamp(yardLine, 1, 100);

  yardsToGo -= yards;

  if (yardLine >= 100) {
    touchdown(text);
    return;
  }

  if (yardsToGo <= 0) {
    down = 1;
    yardsToGo = 10;
    addLog(text + " First down!", "good");
  } else {
    down++;

    if (down > 4) {
      turnover("Turnover on downs.");
      return;
    }

    addLog(text, yards >= 0 ? "good" : "bad");
  }

  playResultEl.textContent = text;
  updateUI();
}

function touchdown(text) {
  score += 7;
  touchdowns++;
  gameActive = false;

  playResultEl.textContent = "TOUCHDOWN!";
  addLog("TOUCHDOWN! " + text, "td");

  updateUI();
}

function turnover(text) {
  gameActive = false;
  turnovers++;

  playResultEl.textContent = text;
  addLog(text, "bad");

  updateUI();
}

function updateUI() {
  scoreEl.textContent = score;
  drivesEl.textContent = drives;
  touchdownsEl.textContent = touchdowns;

  downDisplayEl.textContent = `${ordinal(down)} & ${yardsToGo}`;
  yardLineEl.textContent = yardLine;
  yardsToGoEl.textContent = yardsToGo;

  let percent = ((yardLine - 20) / 80) * 100;
  yardMarkerEl.style.left = clamp(percent, 0, 100) + "%";
}

function addLog(text, type) {
  let div = document.createElement("div");
  div.className = "log-item " + type;
  div.textContent = text;
  logEl.prepend(div);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function ordinal(n) {
  return ["1st","2nd","3rd","4th"][n-1] || n;
}