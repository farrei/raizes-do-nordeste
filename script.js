// script simples do site

let carrinho = [];
let pontos = 0;
let usuarioLogado = false;

const cardapio = [
    { nome: "Baião de Dois", preco: 28, unidade: "Recife", tipo: "prato" },
    { nome: "Carne de Sol", preco: 32, unidade: "Recife", tipo: "prato" },
    { nome: "Acarajé", preco: 18, unidade: "Salvador", tipo: "prato" },
    { nome: "Vatapá", preco: 22, unidade: "Salvador", tipo: "prato" },
    { nome: "Peixada", preco: 30, unidade: "Fortaleza", tipo: "prato" },
    { nome: "Suco de Caju", preco: 8, unidade: "todas", tipo: "suco" },
    { nome: "Suco de Umbu", preco: 9, unidade: "todas", tipo: "suco" }
];

// carrega pontos do localStorage
function carregarPontos() {
    pontos = parseInt(localStorage.getItem("pontos") || "0");
    document.getElementById("pontos").innerText = "Pontos: " + pontos;
}

// LGPD
function aceitarLgpd() {
    if (document.getElementById("lgpd-ok").checked) {
        localStorage.setItem("lgpd", "sim");
        document.getElementById("lgpd-banner").style.display = "none";
    } else {
        alert("Marca a caixinha pra aceitar a LGPD");
    }
}

function recusarLgpd() {
    localStorage.setItem("lgpd", "nao");
    document.getElementById("lgpd-banner").style.display = "none";
}

if (localStorage.getItem("lgpd")) {
    document.getElementById("lgpd-banner").style.display = "none";
}

// filtrar cardapio
function filtrarCardapio() {
    const unidade = document.getElementById("filtro-unidade").value;
    const div = document.getElementById("cardapio");
    div.innerHTML = "";

    cardapio.forEach(item => {
        if (unidade === "todas" || item.unidade === unidade || item.unidade === "todas") {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div style="background:#ccc;height:100px;"></div>
                <h3>${item.nome}</h3>
                <p>R$ ${item.preco}</p>
                <p>${item.unidade}</p>
                <button onclick="adicionarCarrinho('${item.nome}', ${item.preco}, '${item.tipo}')">Adicionar</button>
            `;
            div.appendChild(card);
        }
    });
}

filtrarCardapio();

// carrinho
function adicionarCarrinho(nome, preco, tipo) {
    carrinho.push({ nome, preco, tipo });
    atualizarCarrinho();
}

function atualizarCarrinho() {
    document.getElementById("qtd-carrinho").innerText = carrinho.length;
    const div = document.getElementById("itens-carrinho");
    div.innerHTML = "";
    let total = 0;
    let pratos = 0;

    carrinho.forEach(item => {
        div.innerHTML += `<p>${item.nome} - R$ ${item.preco}</p>`;
        total += item.preco;
        if (item.tipo === "prato") pratos++;
    });

    // promo 2 pratos = suco gratis
    if (pratos >= 2) {
        const sucoGratis = cardapio.find(i => i.tipo === "suco");
        if (sucoGratis && !carrinho.find(i => i.nome === sucoGratis.nome && i.gratis)) {
            carrinho.push({ nome: sucoGratis.nome + " (grátis)", preco: 0, tipo: "suco", gratis: true });
            total -= 0; // ja e zero
            alert("Promoção: suco grátis adicionado!");
            atualizarCarrinho(); // recursivo simples
            return;
        }
    }

    document.getElementById("total").innerText = total.toFixed(2);
}

function mostrarCarrinho() {
    document.getElementById("modal-carrinho").style.display = "block";
    atualizarCarrinho();
}

function mostrarLogin() {
    document.getElementById("modal-login").style.display = "block";
}

function fecharModal(id) {
    document.getElementById(id).style.display = "none";
}

function fazerLogin() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    if (email === "teste@teste.com" && senha === "123456") {
        usuarioLogado = true;
        alert("Login ok!");
        fecharModal("modal-login");
    } else {
        alert("Email ou senha errados");
    }
}

function finalizarPedido() {
    if (!usuarioLogado) {
        alert("Faça login primeiro");
        mostrarLogin();
        return;
    }
    document.getElementById("modal-pagamento").style.display = "block";
}

function confirmarPagamento() {
    const total = parseFloat(document.getElementById("total").innerText);
    pontos += Math.floor(total); // 1 ponto por real
    localStorage.setItem("pontos", pontos);
    document.getElementById("pontos").innerText = "Pontos: " + pontos;
    carrinho = [];
    atualizarCarrinho();
    fecharModal("modal-pagamento");
    fecharModal("modal-carrinho");
    document.getElementById("status-pedido").style.display = "block";
    alert("Pedido confirmado! Pontos adicionados.");
}

carregarPontos();
