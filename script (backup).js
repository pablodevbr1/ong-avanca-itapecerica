/* =========================================================
   AVANÇA ITAPECERICA (BACKUP)
   
   INTERAÇÕES DE FEEDBACK E ROTEAMENTO SPA
   ========================================================= */

// Roteador dinâmico: busca o HTML real mantendo todo o seu conteúdo
async function navegarPara(url) {
    try {
        const resposta = await fetch(url);
        
        if (!resposta.ok) {
            throw new Error("Erro ao carregar a página.");
        }
        
        const html = await resposta.text();
        
        // Converte o texto recebido em DOM para extrair a tag <main>
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const novoConteudo = doc.querySelector("main").innerHTML;
        const novoTitulo = doc.querySelector("title").innerText;
        
        // Injeta apenas o conteúdo principal, preservando Header, Footer e CSS
        document.querySelector("main").innerHTML = novoConteudo;
        document.title = novoTitulo;
        
        // Altera a URL no navegador sem recarregar a página
        window.history.pushState({}, novoTitulo, url);
        
        // Reinicializa eventos, como os do formulário que acabou de ser injetado
        inicializarFormularios();
        
    } catch (erro) {
        // Fallback: Se o fetch falhar (ex: bloqueio de CORS ao rodar o arquivo
        // direto do computador sem um servidor local), faz o roteamento nativo.
        window.location.href = url;
    }
}

document.addEventListener("click", function (evento) {
    const link = evento.target.closest("a[href]");

    // Impede a interceptação em cliques com botões do meio, Ctrl+Click, etc.
    if (!link || evento.defaultPrevented || evento.button !== 0 ||
        evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey ||
        link.target || link.hasAttribute("download")) {
        return;
    }

    const destino = new URL(link.href, window.location.href);

    // Verifica se é um link interno do próprio site apontando para um .html
    if (destino.origin === window.location.origin && destino.pathname.endsWith(".html")) {
        evento.preventDefault();
        navegarPara(destino.href);
    }
});

// Garante que o botão de "voltar" do navegador funcione com o SPA
window.addEventListener("popstate", function () {
    navegarPara(window.location.href);
});

// Mantém a experiência fluida no formulário
function inicializarFormularios() {
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (evento) {
            evento.preventDefault();
            mostrarToast("Cadastro submetido com sucesso!");
            form.reset();
        });
    }
}

// Inicializa no primeiro carregamento
inicializarFormularios();

/* =========================================================
   TOAST
   ========================================================= */

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    
    toast.textContent = mensagem;
    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

/* =========================================================
   MODAL
   ========================================================= */

function abrirModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.add("show");
}

function fecharModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.remove("show");
}

/* =========================================================
   FECHAR MODAL CLICANDO FORA
   ========================================================= */

window.addEventListener("click", function (evento) {
    const modal = document.getElementById("modal");
    if (evento.target === modal) {
        fecharModal();
    }
});

// 1. Gravar dados do formulário no localStorage ao submeter
function inicializarFormularios() {
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (evento) {
            evento.preventDefault();

            // Captura os dados do formulário em um objeto
            const formData = new FormData(form);
            const dadosUsuario = Object.fromEntries(formData.entries());

            // Converte o objeto para String JSON e grava no localStorage
            localStorage.setItem("ultimoCadastro", JSON.stringify(dadosUsuario));

            mostrarToast("Cadastro submetido com sucesso!");
            form.reset();
        });
    }
}

// 2. Recuperar dados do localStorage e restaurar ao carregar a página
function restaurarDadosSalvos() {
    const dadosSalvos = localStorage.getItem("ultimoCadastro");

    if (dadosSalvos) {
        // Converte a string JSON de volta para objeto JavaScript
        const dadosObj = JSON.parse(dadosSalvos);

        // Preenche os campos do formulário com os dados recuperados
        Object.keys(dadosObj).forEach(campo => {
            const input = document.querySelector(`[name="${campo}"]`);
            if (input && input.type !== "checkbox") {
                input.value = dadosObj[campo];
            }
        });
    }
}

// Executa a restauração no carregamento inicial
document.addEventListener("DOMContentLoaded", restaurarDadosSalvos);