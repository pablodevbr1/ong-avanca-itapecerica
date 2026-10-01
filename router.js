/* =========================================================
   MÓDULO ROUTER - ROTEAMENTO SPA
   ========================================================= */

import { inicializarFormularios } from "./form.js";

export async function navegarPara(url) {
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro ao carregar a página.");

        const html = await resposta.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const novoConteudo = doc.querySelector("main").innerHTML;
        const novoTitulo = doc.querySelector("title").innerText;

        document.querySelector("main").innerHTML = novoConteudo;
        document.title = novoTitulo;

        window.history.pushState({}, novoTitulo, url);

        // Reativa os manipuladores do formulário injetado
        inicializarFormularios();

    } catch (erro) {
        window.location.href = url;
    }
}

export function inicializarRoteador() {
    document.addEventListener("click", function (evento) {
        const link = evento.target.closest("a[href]");

        if (!link || evento.defaultPrevented || evento.button !== 0 ||
            evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey ||
            link.target || link.hasAttribute("download")) {
            return;
        }

        const destino = new URL(link.href, window.location.href);

        if (destino.origin === window.location.origin && destino.pathname.endsWith(".html")) {
            evento.preventDefault();
            navegarPara(destino.href);
        }
    });

    window.addEventListener("popstate", function () {
        navegarPara(window.location.href);
    });
}