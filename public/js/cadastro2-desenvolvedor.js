document.addEventListener("DOMContentLoaded", function () {
    const cadastroSalvo = lerCadastroEtapa1();
    if (!cadastroSalvo) {
        window.location.href = "cadastro.html";
        return;
    }

    const form = document.getElementById("form-desenvolvedor");
    if (!form) return;

    form.setAttribute("novalidate", "novalidate");

    const feedbackEl = criarElementoFeedback(form);
    const botaoSubmit = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        limparFeedback(feedbackEl);

        const nomeEstudio = document.getElementById("nome_estudio").value.trim();
        const urlEstudio = document.getElementById("url_estudio").value.trim();
        const tipoJogo = document.getElementById("tipo_jogo").value.trim();

        if (!nomeEstudio || !urlEstudio || !tipoJogo) {
            exibirFeedback(feedbackEl, "Preencha todos os campos obrigatórios para continuar.", "erro");
            return;
        }

        if (!validarUrlSemProtocolo(urlEstudio)) {
            exibirFeedback(
                feedbackEl,
                "Informe uma URL do estúdio válida, sem espaços e contendo ponto (ex: meu-estudio.com).",
                "erro"
            );
            return;
        }

        if (botaoSubmit) {
            botaoSubmit.disabled = true;
            botaoSubmit.textContent = "CADASTRANDO...";
        }

        try {
            const resposta = await fetch("/usuarios/cadastrarUsuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomeServer: cadastroSalvo.nome,
                    emailServer: cadastroSalvo.email,
                    tipoServer: Number(cadastroSalvo.perfil),
                    senhaServer: cadastroSalvo.senha
                })
            });

            if (resposta.ok) {
                sessionStorage.removeItem("cadastro");
                exibirFeedback(feedbackEl, "Cadastro realizado com sucesso! Redirecionando para o login...", "sucesso");
                window.location.href = "login.html";
                return;
            }

            const mensagemErro = await extrairMensagemErro(resposta);
            exibirFeedback(feedbackEl, mensagemErro, "erro");
        } catch (erro) {
            console.error("Erro ao cadastrar desenvolvedor:", erro);
            exibirFeedback(feedbackEl, "Erro de conexão com o servidor. Tente novamente.", "erro");
        } finally {
            if (botaoSubmit) {
                botaoSubmit.disabled = false;
                botaoSubmit.textContent = "CADASTRAR";
            }
        }
    });
});

function lerCadastroEtapa1() {
    const raw = sessionStorage.getItem("cadastro");
    if (!raw) return null;

    try {
        const dados = JSON.parse(raw);
        if (!dados || !dados.nome || !dados.email || !dados.senha || !dados.perfil) {
            return null;
        }
        return dados;
    } catch (e) {
        return null;
    }
}

function validarUrlSemProtocolo(url) {
    if (!url || /\s/.test(url)) return false;
    return url.includes(".");
}

function criarElementoFeedback(form) {
    const existente = document.getElementById("mensagem_feedback");
    if (existente) return existente;

    const p = document.createElement("p");
    p.id = "mensagem_feedback";
    p.setAttribute("role", "alert");
    p.setAttribute("aria-live", "polite");
    p.style.display = "none";
    p.style.width = "100%";
    p.style.padding = "10px 12px";
    p.style.fontSize = "14px";
    p.style.fontWeight = "700";
    p.style.textAlign = "center";
    p.style.borderRadius = "4px";

    const botao = form.querySelector('button[type="submit"]');
    if (botao) {
        form.insertBefore(p, botao);
    } else {
        form.appendChild(p);
    }
    return p;
}

function exibirFeedback(el, mensagem, tipo) {
    el.textContent = mensagem;
    el.style.display = "block";
    if (tipo === "sucesso") {
        el.style.backgroundColor = "rgba(166, 255, 0, 0.14)";
        el.style.border = "1px solid #a6ff00";
        el.style.color = "#a6ff00";
    } else {
        el.style.backgroundColor = "rgba(255, 51, 51, 0.14)";
        el.style.border = "1px solid #ff4d4d";
        el.style.color = "#ff8080";
    }
}

function limparFeedback(el) {
    el.textContent = "";
    el.style.display = "none";
}

async function extrairMensagemErro(resposta) {
    const texto = await resposta.text();
    if (!texto) {
        return "Não foi possível concluir o cadastro. Verifique os dados e tente novamente.";
    }
    try {
        const json = JSON.parse(texto);
        return json.mensagem || json.erro || texto;
    } catch (e) {
        return texto;
    }
}
