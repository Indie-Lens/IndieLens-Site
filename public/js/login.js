function entrar() {
    let email = email_input.value;
    let senha = senha_input.value;

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            emailServer: email,
            senhaServer: senha
        })
    }).then(
        function (resposta) {
            console.log("Realizando Login");
            if (resposta.ok) {
                console.log(resposta);
                resposta.json().then(
                    function (json) {
                        console.log(json);
                        sessionStorage.ID_USUARIO = json.id;
                        sessionStorage.NOME_USUARIO = json.nome;
                        sessionStorage.EMAIL_USUARIO = json.email;
                        sessionStorage.PERFIL_USUARIO = json.perfil;

                        setTimeout(function () {
                            if (json.perfil == 3) {
                                window.location = "dashboard/LeadGame/paineis.html";
                            } else if (json.perfil == 4) {
                                window.location = "dashboard/Streamer/DashboardGeral.html";
                            }
                        }, 1000);
                    })
            } else {
                resposta.text().then(texto => {
                    console.error(texto);
                });
            }
        }
    ).catch(
        function (erro) {
            console.log(erro);
        }
    );
}