document.addEventListener("DOMContentLoaded", () => {
    
    const yearSpan = document.getElementById("year");
    const modifiedSpan = document.getElementById("lastModified");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (modifiedSpan) modifiedSpan.textContent = document.lastModified;

    const params = new URLSearchParams(window.location.search);

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value && value.trim() !== "" ? value : "—";
        }
    }

    setText("firstNameDisplay", params.get("firstName"));
    setText("lastNameDisplay", params.get("lastName"));
    setText("emailDisplay", params.get("email"));
    setText("mobileDisplay", params.get("mobile"));
    setText("organizationDisplay", params.get("organization"));

    const tsRaw = params.get("timestamp");
    let tsDisplay = "—";
    if (tsRaw) {
        const date = new Date(tsRaw);
        if (!isNaN(date.getTime())) {
            tsDisplay = date.toLocaleString();
        } else {
            tsDisplay = tsRaw;
        }
    }
    setText("timestampDisplay", tsDisplay);
});
