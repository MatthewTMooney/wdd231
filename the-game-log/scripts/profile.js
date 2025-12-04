const defaultFilterSelect = document.getElementById("defaultFilter");
const themeToggleSelect = document.getElementById("themeToggle");

function loadPreferences() {
    const raw = localStorage.getItem("game-log-preferences");
    if (!raw) {
        return {
            defaultFilter: "all",
            theme: "nes-dark"
        };
    }
    try {
        const parsed = JSON.parse(raw);
        return {
            defaultFilter: parsed.defaultFilter || "all",
            theme: parsed.theme || "nes-dark"
        };
    } catch {
        return {
            defaultFilter: "all",
            theme: "nes-dark"
        };
    }
}

function savePreferences(prefs) {
    localStorage.setItem("game-log-preferences", JSON.stringify(prefs));
}

function applyTheme(theme) {
    const body = document.body;
    body.classList.remove("theme-nes-dark", "theme-light");
    if (theme === "light") {
        body.classList.add("theme-light");
    } else {
        body.classList.add("theme-nes-dark");
    }
}

const prefs = loadPreferences();

defaultFilterSelect.value = prefs.defaultFilter;
themeToggleSelect.value = prefs.theme;
applyTheme(prefs.theme);

defaultFilterSelect.addEventListener("change", () => {
    prefs.defaultFilter = defaultFilterSelect.value;
    savePreferences(prefs);
});

themeToggleSelect.addEventListener("change", () => {
    prefs.theme = themeToggleSelect.value;
    applyTheme(prefs.theme);
    savePreferences(prefs);
});
