import { games } from "../data/games.mjs";

const grid = document.getElementById("gameGrid");
const filterSelect = document.getElementById("statusFilter");
const dialog = document.getElementById("gameDialog");
const dialogTitle = document.getElementById("dialogTitle");
const dialogMeta = document.getElementById("dialogMeta");
const dialogDescription = document.getElementById("dialogDescription");
const dialogStatus = document.getElementById("dialogStatus");
const dialogRating = document.getElementById("dialogRating");
const dialogNotes = document.getElementById("dialogNotes");

let currentGameId = null;

function loadPreferences() {
    const raw = localStorage.getItem("game-log-preferences");
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

const prefs = loadPreferences();
const initialFilter = prefs.defaultFilter || "all";
filterSelect.value = initialFilter;

function loadState() {
    const raw = localStorage.getItem("game-log-state");
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function saveState(state) {
    localStorage.setItem("game-log-state", JSON.stringify(state));
}

let state = loadState();

function getGameState(id) {
    if (!state[id]) {
        state[id] = {
            status: "backlog",
            rating: "",
            notes: ""
        };
    }
    return state[id];
}

function renderGames(filter) {
    grid.innerHTML = "";
    const filteredGames =
        filter === "all"
            ? games
            : games.filter(game => getGameState(game.id).status === filter);

    filteredGames.forEach(game => {
        const gameState = getGameState(game.id);
        const card = document.createElement("article");
        card.className = "game-card";

        const statusLabel =
            gameState.status === "backlog"
                ? "Backlog"
                : gameState.status.charAt(0).toUpperCase() + gameState.status.slice(1);

        const ratingLabel = gameState.rating ? gameState.rating : "–";

        card.innerHTML = `
      <h3>${game.title}</h3>
      <p class="game-meta">${game.platform} • ${game.genre} • ${game.year}</p>
      <p>Status: <strong>${statusLabel}</strong></p>
      <p>Rating: <strong>${ratingLabel}</strong></p>
      <button class="btn btn-secondary" type="button" data-id="${game.id}">Details</button>
    `;

        grid.appendChild(card);
    });

    const buttons = grid.querySelectorAll("button[data-id]");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);
            openDialog(id);
        });
    });
}

function openDialog(id) {
    currentGameId = id;
    const game = games.find(g => g.id === id);
    if (!game) return;

    const gameState = getGameState(id);

    dialogTitle.textContent = game.title;
    dialogMeta.textContent = `${game.platform} • ${game.genre} • ${game.year} • ~${game.hours}h`;
    dialogDescription.textContent = game.description;

    dialogStatus.value = gameState.status;
    dialogRating.value = gameState.rating;
    dialogNotes.value = gameState.notes;

    dialog.showModal();
}

dialog.addEventListener("close", () => {
    if (dialog.returnValue === "save" && currentGameId !== null) {
        const updated = {
            status: dialogStatus.value,
            rating: dialogRating.value,
            notes: dialogNotes.value
        };
        state[currentGameId] = updated;
        saveState(state);
        renderGames(filterSelect.value);
    }
});

filterSelect.addEventListener("change", () => {
    renderGames(filterSelect.value);
});

function checkForDirectOpen() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("game"));
    if (!id) return;
    setTimeout(() => openDialog(id), 200);
}

renderGames(initialFilter);
checkForDirectOpen();
