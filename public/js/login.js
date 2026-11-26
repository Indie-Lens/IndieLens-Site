const ROTAS_POR_PERFIL = {
    1: "Dashboard/Streamer/DashboardGeral.html",
    2: "Dashboard/LeadGame/dashPrincipalLead.html",
    3: "Dashboard/LeadGame/dashPrincipalLead.html",
    4: "Dashboard/Streamer/DashboardGeral.html"
};

document.addEventListener("DOMContentLoaded", function () {
    const inputs = [document.getElementById("email_input"), document.getElementById("senha_input")];
    inputs.forEach(function (input) {
        if (!input) return;
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                entrar();
            }
        });
    });
});

function obterElementoFeedbackLogin() {
    let el = document.getElementById("mensagem_login");
    if (el) return el;

    const formulario = document.querySelector(".formulario");
    if (!formulario) return null;

    el = document.createElement("p");
    el.id = "mensagem_login";
    el.setAttribute("role", "alert");
    el.setAttribute("aria-live", "polite");
    el.style.display = "none";
    el.style.marginTop = "4px";
    el.style.padding = "10px 12px";
    el.style.fontSize = "13px";
    el.style.fontWeight = "700";
    el.style.textAlign = "center";
    el.style.borderRadius = "6px";

    const botao = formulario.querySelector(".botao");
    if (botao) {
        formulario.insertBefore(el, botao);
    } else {
        formulario.appendChild(el);
    }
    return el;
}

function exibirFeedbackLogin(mensagem, tipo) {
    const el = obterElementoFeedbackLogin();
    if (!el) return;

    el.textContent = mensagem;
    el.style.display = "block";
    if (tipo === "sucesso") {
        el.style.backgroundColor = "rgba(156, 255, 0, 0.14)";
        el.style.border = "1px solid #9cff00";
        el.style.color = "#9cff00";
    } else {
        el.style.backgroundColor = "rgba(255, 51, 51, 0.14)";
        el.style.border = "1px solid #ff4d4d";
        el.style.color = "#ff8080";
    }
}

function limparFeedbackLogin() {
    const el = document.getElementById("mensagem_login");
    if (!el) return;
    el.textContent = "";
    el.style.display = "none";
}

function entrar() {
    limparFeedbackLogin();

    const email = email_input.value.trim();
    const senha = senha_input.value;

    if (!email || !senha) {
        exibirFeedbackLogin("Preencha o e-mail e a senha para entrar.", "erro");
        return;
    }

    const botao = document.querySelector(".formulario .botao");
    if (botao) {
        botao.disabled = true;
        botao.textContent = "ENTRANDO...";
    }

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            emailServer: email,
            senhaServer: senha
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            return resposta.json().then(function (json) {
                const perfilNum = Number(json.perfil);
                const destino = ROTAS_POR_PERFIL[perfilNum];

                if (!destino) {
                    exibirFeedbackLogin(
                        `Perfil de usuário (${json.perfil}) não reconhecido para acesso.`,
                        "erro"
                    );
                    if (botao) {
                        botao.disabled = false;
                        botao.textContent = "ENTRAR";
                    }
                    return;
                }

                sessionStorage.ID_USUARIO = json.id;
                sessionStorage.NOME_USUARIO = json.nome;
                sessionStorage.EMAIL_USUARIO = json.email;
                sessionStorage.PERFIL_USUARIO = String(perfilNum);

                exibirFeedbackLogin("Login realizado com sucesso! Redirecionando...", "sucesso");
                setTimeout(function () {
                    window.location = destino;
                }, 600);
            });
        }

        return resposta.text().then(function (texto) {
            let mensagem = texto || "E-mail e/ou senha inválido(s).";
            try {
                const json = JSON.parse(texto);
                mensagem = json.mensagem || json.erro || mensagem;
            } catch (e) {
                // resposta em texto puro
            }
            console.error(mensagem);
            exibirFeedbackLogin(mensagem, "erro");
            if (botao) {
                botao.disabled = false;
                botao.textContent = "ENTRAR";
            }
        });
    }).catch(function (erro) {
        console.error(erro);
        exibirFeedbackLogin("Erro de conexão com o servidor. Tente novamente.", "erro");
        if (botao) {
            botao.disabled = false;
            botao.textContent = "ENTRAR";
        }
    });
}
