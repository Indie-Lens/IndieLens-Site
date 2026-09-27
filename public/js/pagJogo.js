var btnSobre = document.getElementById('btn-sobre');
var btnGaleria = document.getElementById('btn-galeria');
var btnReviews = document.getElementById('btn-reviews');

var conteudoSobre = document.getElementById('conteudo-sobre');
var conteudoGaleria = document.getElementById('conteudo-galeria');
var conteudoReviews = document.getElementById('conteudo-reviews');

function mostrarAba(abaEscolhida) {
    conteudoSobre.style.display = 'none';
    conteudoGaleria.style.display = 'none';
    conteudoReviews.style.display = 'none';

    btnSobre.classList.remove('active');
    btnGaleria.classList.remove('active');
    btnReviews.classList.remove('active');

    if (abaEscolhida === 'sobre') {
        conteudoSobre.style.display = 'flex';
        btnSobre.classList.add('active');
    } else if (abaEscolhida === 'galeria') {
        conteudoGaleria.style.display = 'flex';
        btnGaleria.classList.add('active');
    } else if (abaEscolhida === 'reviews') {
        conteudoReviews.style.display = 'flex';
        btnReviews.classList.add('active');
    }
}

btnSobre.addEventListener('click', () => mostrarAba('sobre'));
btnGaleria.addEventListener('click', () => mostrarAba('galeria'));
btnReviews.addEventListener('click', () => mostrarAba('reviews'));