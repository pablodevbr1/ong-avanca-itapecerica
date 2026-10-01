/* =========================================================
   PONTO DE ENTRADA PRINCIPAL (ENTRY POINT)
   ========================================================= */

import { inicializarEventosModal } from "./ui.js";
import { inicializarFormularios } from "./form.js";
import { inicializarRoteador } from "./router.js";

document.addEventListener("DOMContentLoaded", function () {
    inicializarEventosModal();
    inicializarFormularios();
    inicializarRoteador();
});