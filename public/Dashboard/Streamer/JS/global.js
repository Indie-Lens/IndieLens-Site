
    function alterarGenero() {
        var genero = document.getElementById("generoSelecionado").value;
        if (genero == "Aventura") {
            document.getElementById("barra1").style.width = "12%";
            document.getElementById("barra2").style.width = "87%";
            document.getElementById("barra3").style.width = "26%";
            document.getElementById("barra4").style.width = "5%";
            document.getElementById("posicao1").innerHTML = "12º";
            document.getElementById("posicao2").innerHTML = "87º";
            document.getElementById("posicao3").innerHTML = "26º";
            document.getElementById("posicao4").innerHTML = "5º";
        } else if (genero == "RPG") {
            document.getElementById("barra1").style.width = "35%";
            document.getElementById("barra2").style.width = "62%";
            document.getElementById("barra3").style.width = "18%";
            document.getElementById("barra4").style.width = "42%";
            document.getElementById("posicao1").innerHTML = "35º";
            document.getElementById("posicao2").innerHTML = "62º";
            document.getElementById("posicao3").innerHTML = "18º";
            document.getElementById("posicao4").innerHTML = "42º";
        } else if (genero == "Ação") {
            document.getElementById("barra1").style.width = "56%";
            document.getElementById("barra2").style.width = "23%";
            document.getElementById("barra3").style.width = "72%";
            document.getElementById("barra4").style.width = "15%";
            document.getElementById("posicao1").innerHTML = "56º";
            document.getElementById("posicao2").innerHTML = "23º";
            document.getElementById("posicao3").innerHTML = "72º";
            document.getElementById("posicao4").innerHTML = "15º";
        } else if (genero == "Puzzle") {
            document.getElementById("barra1").style.width = "22%";
            document.getElementById("barra2").style.width = "14%";
            document.getElementById("barra3").style.width = "48%";
            document.getElementById("barra4").style.width = "31%";
            document.getElementById("posicao1").innerHTML = "22º";
            document.getElementById("posicao2").innerHTML = "14º";
            document.getElementById("posicao3").innerHTML = "48º";
            document.getElementById("posicao4").innerHTML = "31º";
        } else if (genero == "Simulação") {
            document.getElementById("barra1").style.width = "41%";
            document.getElementById("barra2").style.width = "52%";
            document.getElementById("barra3").style.width = "29%";
            document.getElementById("barra4").style.width = "9%";
            document.getElementById("posicao1").innerHTML = "41º";
            document.getElementById("posicao2").innerHTML = "52º";
            document.getElementById("posicao3").innerHTML = "29º";
            document.getElementById("posicao4").innerHTML = "9º";
        }
    }

    function abrirNotificacoes() {
        document.getElementById("barraNotificacoes").style.display = "block";
    }

    function fecharNotificacoes() {
        document.getElementById("barraNotificacoes").style.display = "none";
    }
