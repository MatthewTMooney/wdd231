import { games } from "../data/games.mjs";

const tickerInner = document.getElementById("tickerInner");

function createItems() {
    games.forEach(game => {
        const link = document.createElement("a");
        link.className = "ticker-item";
        link.href = `library.html?game=${game.id}`;

        const img = document.createElement("img");
        img.src = `images/${game.image}`;
        img.alt = game.alt;
        img.loading = "lazy";

        const title = document.createElement("span");
        title.textContent = game.title;

        link.appendChild(img);
        link.appendChild(title);

        tickerInner.appendChild(link);
    });
}

createItems();
createItems();
