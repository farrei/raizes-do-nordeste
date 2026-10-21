// dados do cardapio por unidade
const cardapio = {
  recife: [
    { nome: "Baião de dois", preco: 28.90, tipo: "prato" },
    { nome: "Carne de sol", preco: 35.00, tipo: "prato" },
    { nome: "Suco de caju", preco: 8.00, tipo: "suco" }
  ],
  fortaleza: [
    { nome: "Peixe frito", preco: 32.00, tipo: "prato" },
    { nome: "Acarajé", preco: 15.00, tipo: "prato" },
    { nome: "Suco de acerola", preco: 7.50, tipo: "suco" }
  ],
  salvador: [
    { nome: "Moqueca", preco: 40.00, tipo: "prato" },
    { nome: "Vatapá", preco: 22.00, tipo: "prato" },
    { nome: "Suco de graviola", preco: 9.00, tipo: "suco" }
  ]
};

let sacola = [];
let pontos = parseInt(localStorage.getItem("pontos") || "0");
let lgpdAceito = localStorage.getItem("lgpd") === "aceito";

// quando a pagina carrega
window.onload = function() {
  if (lgpdAceito) {
    document.getElementById("lgpd-banner").style.display = "none";
  }
  filtrarCardapio();
  atualizarSacola();
};

// filtra o cardapio pela unidade selecionada
function filtrarCardapio() {
  const unidade = document.getElementById("unidade").value;
  const lista = document.getElementById("lista-cardapio");
  lista.innerHTML = "";
  cardapio[unidade].forEach(item => {
    const div = document.createElement("div");
    div.className = "item-cardapio";
    div.innerHTML = `<h3>${item.nome}</h3><p>R$ ${item.preco.toFixed(2)}</p><button onclick="adicionarSacola('${item.nome}', ${item.preco}, '${item.tipo}')">Adicionar</button>`;
    lista.appendChild(div);
  });
}

// adiciona item na sacola
function adicionarSacola(nome, preco, tipo) {
  sacola.push({ nome, preco, tipo });
  atualizarSacola();
}

// atualiza a lista da sacola e o total
function atualizarSacola() {
  const lista = document.getElementById("itens-sacola");
  lista.innerHTML = "";
  let total = 0;
  let pratos = 0;
  sacola.forEach(item => {
    total += item.preco;
    if (item.tipo === "prato") pratos++;
    lista.innerHTML += `<p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>`;
  });
  // promo: 2 pratos = 1 suco gratis
  if (pratos >= 2) {
    const suco = cardapio[document.getElementById("unidade").value].find(i => i.tipo === "suco");
    if (suco && !sacola.find(i => i.nome === suco.nome && i.preco === 0)) {
      sacola.push({ nome: suco.nome + " (grátis)", preco: 0, tipo: "suco" });
      total -= suco.preco; // desconto
    }
  }
  document.getElementById("total").textContent = total.toFixed(2);
}

// finaliza o pedido
function finalizarPedido() {
  if (sacola.length === 0) {
    alert("Sacola vazia");
    return;
  }
  if (!lgpdAceito) {
    alert("Aceite a LGPD primeiro");
    return;
  }
  document.getElementById("modal-pagamento").style.display = "block";
}

// confirma o pagamento e ganha pontos
function confirmarPagamento() {
  if (!document.getElementById("lgpd-pagamento").checked) {
    alert("Marque o aceite da LGPD");
    return;
  }
  const total = parseFloat(document.getElementById("total").textContent);
  pontos += Math.floor(total);
  localStorage.setItem("pontos", pontos);
  alert("Pedido feito! Você ganhou " + Math.floor(total) + " pontos. Total de pontos: " + pontos);
  sacola = [];
  atualizarSacola();
  fecharPagamento();
  // simula avanço do status
  let etapa = 0;
  const etapas = document.querySelectorAll("#etapas div");
  const intervalo = setInterval(() => {
    if (etapa < etapas.length) {
      etapas[etapa].style.background = "#27ae60";
      etapa++;
    } else {
      clearInterval(intervalo);
    }
  }, 2000);
}

// funcoes da LGPD
function aceitarLgpd() {
  lgpdAceito = true;
  localStorage.setItem("lgpd", "aceito");
  document.getElementById("lgpd-banner").style.display = "none";
}

function recusarLgpd() {
  alert("Sem aceitar a LGPD não dá pra usar o site direito");
}

// login simples
function abrirLogin() {
  document.getElementById("modal-login").style.display = "block";
}

function fecharLogin() {
  document.getElementById("modal-login").style.display = "none";
}

function fazerLogin() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  if (email === "teste@teste.com" && senha === "123456") {
    alert("Login feito com sucesso");
    fecharLogin();
  } else {
    alert("E-mail ou senha errados");
  }
}

function fecharPagamento() {
  document.getElementById("modal-pagamento").style.display = "none";
}
