var btnSobre = document.getElementById('btn-sobre');

var btnReviews = document.getElementById('btn-reviews');

var conteudoSobre = document.getElementById('conteudo-sobre');

var conteudoReviews = document.getElementById('conteudo-reviews');

function mostrarAba(abaEscolhida) {
    conteudoSobre.style.display = 'none';
    conteudoReviews.style.display = 'none';

    btnSobre.classList.remove('active');
    btnReviews.classList.remove('active');

    if (abaEscolhida === 'sobre') {
        conteudoSobre.style.display = 'flex';
        btnSobre.classList.add('active');
    
    } else if (abaEscolhida === 'reviews') {
        conteudoReviews.style.display = 'flex';
        btnReviews.classList.add('active');
    }
}

btnSobre.addEventListener('click', () => mostrarAba('sobre'));

btnReviews.addEventListener('click', () => mostrarAba('reviews'));