document.addEventListener("DOMContentLoaded", () => {

    const yearSpan = document.getElementById("year");
    const modifiedSpan = document.getElementById("lastModified");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (modifiedSpan) modifiedSpan.textContent = document.lastModified;

    const tsInput = document.getElementById("timestamp");
    if (tsInput) {
        tsInput.value = new Date().toISOString();
    }


    const openLinks = document.querySelectorAll("[data-modal-target]");
    const closeButtons = document.querySelectorAll("[data-close-modal]");
    const backdrops = document.querySelectorAll(".modal-backdrop");
    let lastFocusedElement = null;

    const focusableSelectors = [
        "button",
        "[href]",
        "input",
        "select",
        "textarea",
        "[tabindex]:not([tabindex='-1'])"
    ];

    function openModal(modalId, trigger) {
        const modalBackdrop = document.getElementById(modalId);
        if (!modalBackdrop) return;

        lastFocusedElement = trigger || document.activeElement;

        modalBackdrop.setAttribute("aria-hidden", "false");

        const focusable = modalBackdrop.querySelectorAll(focusableSelectors.join(","));
        if (focusable.length > 0) {
            focusable[0].focus();
        }

        function trapTab(e) {
            if (e.key !== "Tab") return;
            const focusables = modalBackdrop.querySelectorAll(focusableSelectors.join(","));
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }

        function onKeyDown(e) {
            if (e.key === "Escape") {
                closeModal(modalBackdrop);
            } else if (e.key === "Tab") {
                trapTab(e);
            }
        }

        modalBackdrop.dataset.keydownHandler = onKeyDown;
        document.addEventListener("keydown", onKeyDown);
    }

    function closeModal(modalBackdrop) {
        modalBackdrop.setAttribute("aria-hidden", "true");
        if (modalBackdrop.dataset.keydownHandler) {
            document.removeEventListener("keydown", modalBackdrop.dataset.keydownHandler);
            delete modalBackdrop.dataset.keydownHandler;
        }
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    openLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-modal-target");
            if (targetId) openModal(targetId, link);
        });
    });

    closeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const backdrop = btn.closest(".modal-backdrop");
            if (backdrop) closeModal(backdrop);
        });
    });

    backdrops.forEach((backdrop) => {
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) {
                closeModal(backdrop);
            }
        });
    });
});
