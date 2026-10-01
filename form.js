/* =========================================================
   MÓDULO FORM - TRATAMENTO DE FORMULÁRIOS
   ========================================================= */

import { mostrarToast } from "./ui.js";

export function inicializarFormularios() {
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (evento) {
            evento.preventDefault();
            mostrarToast("Cadastro submetido com sucesso!");
            form.reset();
        });
    }
}