/* =========================================================
/* ui.js */
export function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = mensagem;
    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

export function abrirModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.add("show");
}

export function fecharModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.remove("show");
}

export function inicializarEventosModal() {
    window.addEventListener("click", function (evento) {
        const modal = document.getElementById("modal");
        if (evento.target === modal) {
            fecharModal();
        }
    });
}

// EXPOSIÇÃO EXPLÍCITA AO ESCOPO GLOBAL (Resolve o problema dos botões onclick)
window.mostrarToast = mostrarToast;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;