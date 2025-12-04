import { games } from "../data/games.mjs";

const totalEl = document.getElementById("stat-total");
const beatenEl = document.getElementById("stat-beaten");
const ratingEl = document.getElementById("stat-rating");

function loadState() {
    const raw = localStorage.getItem("game-log-state");
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

const state = loadState();

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

function calculateStats() {
    const totalGames = games.length;

    let beatenCount = 0;
    let ratingSum = 0;
    let ratingCount = 0;

    games.forEach(game => {
        const s = getGameState(game.id);
        if (s.status === "beaten") {
            beatenCount++;
        }
        const r = Number(s.rating);
        if (!Number.isNaN(r) && r > 0) {
            ratingSum += r;
            ratingCount++;
        }
    });

    totalEl.textContent = totalGames.toString();
    beatenEl.textContent = beatenCount.toString();

    if (ratingCount === 0) {
        ratingEl.textContent = "–";
    } else {
        const avg = ratingSum / ratingCount;
        ratingEl.textContent = avg.toFixed(1);
    }
}

calculateStats();
