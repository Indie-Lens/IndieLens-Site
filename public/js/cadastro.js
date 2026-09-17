
let listaNumeros = ["1","2","3","4","5","6","7","8","9","0"];
let listaEspeciais = ["!","@","#","$","%","¨","&","*","(",")","_","-","=","+","{","[","´","`","]","}",`"`,"^","~","|",`\``,",","<",">",":",";","?","/","°","¹","²","³","£","¢","¬","§","ª","º"];

function cadastrar(){
    let nome = nome_input.value;
    let email = email_input.value;
    let senha = senha_input.value;
    let senhaConfirmacao = confirmacao_senha_input.value;

    //ALTERAR P/REQUISITO DE TIPO, HARDCODED NO MOMENTO
    let tipo = 1;

    //validações simples
    let nomeValido = (nome.length >= 1 && nome.length <= 50) ? true : false;
    let emailValido = validarEmail(email);
    let senhaValida = validarSenha(senha);
    let senhasValidas = (senha === senhaConfirmacao) ? true : false;


    // ESCONDE OS ÍCONES DE ERRO ANTES DE VALIDAR NOVAMENTE

    document.getElementById("erro_nome").style.display = "none";
    document.getElementById("erro_email").style.display = "none";
    document.getElementById("erro_senha").style.display = "none";
    document.getElementById("erro_confirmacao").style.display = "none";


    // MOSTRA O ERRO DO NOME

    if(!nomeValido){
        document.getElementById("erro_nome").style.display = "block";
    }


    // MOSTRA O ERRO DO EMAIL

    if(!emailValido){
        document.getElementById("erro_email").style.display = "block";
    }


    // MOSTRA O ERRO DA SENHA

    if(!senhaValida){
        document.getElementById("erro_senha").style.display = "block";

        document.querySelector("#erro_senha .mensagem-erro").innerText = "Senha inválida";
    }


    // MOSTRA O ERRO DE CONFIRMAÇÃO

    if(!senhasValidas){
    document.getElementById("erro_confirmacao").style.display = "block";
}


    if(nomeValido && emailValido && senhaValida && senhasValidas){
        fetch("/usuarios/cadastrarUsuario",
            {
                method : "POST",
                headers : { "Content-Type" : "application/json"},

                body : JSON.stringify({
                    nomeServer : nome,
                    emailServer : email,
                    senhaServer : senha,
                    tipoServer : tipo
                }),
            }
        ).then(
            function (resposta) {
                console.log("resposta: ", resposta);

                if(resposta.ok){
                    setTimeout(() => { window.location = "login.html";}, "1000");
                }
            }
        ).catch(
            function(erro){
                console.log(`Ocorreu um erro: ${erro}`);
            }
        );
    }

}

function validarNulo(input){
    if(input == null || input.length <= 0 || input == ""){
        return true;
    }

    return false;
}

function validarSenha(senha){
    if(validarNulo(senha)){return false;}

    let maiuscula = false, minuscula = false, especial = false, numero = false;

    //percorre cada letra da senha
    for (let i = 0; i < senha.length; i++) {
        let char = senha[i];

        //tem algum dos especiais?
        if (listaEspeciais.indexOf(char) != -1) {
            especial = true;
        }

        //tem numero?
        if(listaNumeros.indexOf(char) != -1){
            numero = true;
        }

        //verifica igualdade em letras
        if (char.toUpperCase() !== char.toLowerCase()) {
            if(char.toUpperCase() == char){
                maiuscula = true;
            }

            if(char.toLowerCase() == char){
                minuscula = true;
            }
        }

        if(maiuscula && minuscula && especial && numero){
            return true;
        }
    }

    return false;
}

function validarEmail(email){
    if(validarNulo(email)){return false;}

    let especial = false, pontoDepois = false;

    if (email.indexOf("@") != -1) {
        especial = true;
        let posicaoPonto = email.indexOf(".", email.indexOf("@"));

        if(posicaoPonto != -1){
            pontoDepois = true;
        }
    }  

    if (especial && pontoDepois){
        return true
    } else {
        // TODO returno onde está o erro
    }

    return false;
}

