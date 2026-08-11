export function confirmDialog(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
    <div class="modal">
    <p class="modal__message">${message}</p>
    <div class="modal__auctions">
    <button class="modal__btn modal__btn--ghost" data-action="cancel">Abbrechen</button>
    <button class="modal__btn modal__btn--danger" data-action="confirm">Löschen</button>
    </div>
    </div>
    `;
    document.body.appendChild(overlay);

    function close(result) {
      overlay.classList.add("modal-overlay--closing");
      setTimeout(() => overlay.remove(), 200);
      resolve(result);
    }

    overlay.addEventListener("click", (event) => {
      const action = event.target.dataset.action;
      if (action === "confirm") close(true);
      else if (action === "cancel") close(false);
      else if (event.target === overlay) close(false);
    });
  });
}
