// cardápio mockado — valores só pra demonstração
const menu = [
  { id: 1, name: "Baião de Dois da Casa", category: "Pratos", price: 32.90, desc: "Arroz, feijão-verde, queijo coalho e carne-seca.", img: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Carne de Sol com Macaxeira", category: "Pratos", price: 39.90, desc: "Carne de sol, macaxeira cremosa e manteiga de garrafa.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Cuscuz Nordestino", category: "Pratos", price: 18.90, desc: "Cuscuz de milho com ovos, queijo coalho e manteiga.", img: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Tapioca de Queijo Coalho", category: "Lanches", price: 16.90, desc: "Tapioca dourada recheada com queijo coalho.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80" },
  { id: 5, name: "Sanduíche de Carne de Sol", category: "Lanches", price: 27.90, desc: "Pão artesanal, carne de sol, queijo e vinagrete.", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80" },
  { id: 6, name: "Suco de Cajá", category: "Bebidas", price: 9.90, desc: "Polpa de cajá, água e um toque de açúcar.", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80" }
];

let cart = [];
let currentCategory = "Todos";
let orderStep = -1; // -1 = sem pedido ativo
let points = 620;

const $ = (s) => document.querySelector(s);
const money = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ---------- cardápio ----------
function renderMenu() {
  const grid = $("#menuGrid");
  const list = currentCategory === "Todos" ? menu : menu.filter((x) => x.category === currentCategory);

  grid.innerHTML = list.map((x) => `
    <article class="food-card">
      <img class="food-img" loading="lazy" src="${x.img}" alt="${x.name}">
      <div class="food-body">
        <span class="eyebrow">${x.category}</span>
        <h3>${x.name}</h3>
        <p>${x.desc}</p>
        <div class="food-meta">
          <span class="price">${money(x.price)}</span>
          <button class="add" data-add="${x.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-add]").forEach((b) => {
    b.onclick = () => add(Number(b.dataset.add));
  });
}

function add(id) {
  const item = menu.find((x) => x.id === id);
  if (!item) return;

  const found = cart.find((x) => x.id === id);
  if (found) {
    found.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  renderCart();
  toast("Item adicionado à sacola.");
}

function remove(id) {
  const i = cart.findIndex((x) => x.id === id);
  if (i < 0) return;

  if (cart[i].qty > 1) {
    cart[i].qty--;
  } else {
    cart.splice(i, 1);
  }
  renderCart();
}

function renderCart() {
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  $("#cartCount").textContent = cart.reduce((s, x) => s + x.qty, 0);
  $("#cartTotal").textContent = money(total);

  if (cart.length === 0) {
    $("#cartItems").innerHTML = "<p style='color:var(--muted)'>Sua sacola está vazia.</p>";
  } else {
    $("#cartItems").innerHTML = cart.map((x) => `
      <div class="cart-row">
        <div>
          <strong>${x.name}</strong>
          <small>${x.qty} × ${money(x.price)}</small>
        </div>
        <button data-remove="${x.id}">Remover</button>
      </div>
    `).join("");
  }

  document.querySelectorAll("[data-remove]").forEach((b) => {
    b.onclick = () => remove(Number(b.dataset.remove));
  });
}

// ---------- sacola ----------
function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  $("#overlay").classList.add("show");
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  $("#overlay").classList.remove("show");
}

// ---------- modal genérico ----------
function showModal(html) {
  $("#modalContent").innerHTML = html;
  $("#modal").classList.add("show");
  $("#modal").setAttribute("aria-hidden", "false");
}

function closeModal() {
  $("#modal").classList.remove("show");
  $("#modal").setAttribute("aria-hidden", "true");
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// ---------- LGPD ----------
function checkLgpdBanner() {
  // se já aceitou antes, some com o banner
  if (localStorage.getItem("rn_lgpd") === "ok") {
    $("#lgpdBanner").style.display = "none";
  }
}

function acceptLgpd() {
  localStorage.setItem("rn_lgpd", "ok");
  $("#lgpdBanner").style.display = "none";
  toast("Preferências de privacidade salvas.");
}

function refuseLgpd() {
  // recusar não impede de usar o site, só limita fidelidade no futuro
  $("#lgpdBanner").style.display = "none";
  toast("Algumas funções de fidelidade podem ficar limitadas.");
}

function showPrivacy() {
  showModal(`
    <h2>Política de Privacidade</h2>
    <p style="font-size:14px;line-height:1.6">
      Coletamos apenas o necessário para processar o pedido (nome, e-mail e itens do carrinho).
      Não pedimos dados bancários nesta demonstração — o pagamento é simulado em um serviço externo.
      Você pode solicitar a exclusão dos seus dados a qualquer momento.
      Este protótipo é acadêmico e não armazena informações sensíveis de verdade.
    </p>
    <button class="btn primary full" id="closePrivacyBtn">Entendi</button>
  `);
}

// ---------- login / cadastro ----------
function openAuth(mode) {
  // mode = "login" ou "cadastro"
  if (mode === "cadastro") {
    showModal(`
      <h2>Criar conta</h2>
      <p>Cadastre-se para acompanhar pedidos e acumular pontos.</p>
      <input class="field" type="text" id="regName" placeholder="Seu nome" aria-label="Nome">
      <input class="field" type="email" id="regEmail" placeholder="E-mail" aria-label="E-mail">
      <input class="field" type="password" id="regPass" placeholder="Senha" aria-label="Senha">
      <label class="check-label">
        <input type="checkbox" id="regConsent">
        Autorizo o uso dos meus dados conforme a <a href="#" id="linkPrivReg">Política de Privacidade</a>.
      </label>
      <button class="btn primary full" id="doRegister" style="margin-top:14px">Cadastrar</button>
      <p style="font-size:13px;margin-top:12px">Já tem conta? <a href="#" id="goLogin">Entrar</a></p>
    `);
  } else {
    showModal(`
      <h2>Entrar na conta</h2>
      <p>Acesse seus pedidos, pontos e benefícios.</p>
      <input class="field" type="email" id="loginEmail" placeholder="Seu e-mail" aria-label="E-mail">
      <input class="field" type="password" id="loginPass" placeholder="Senha" aria-label="Senha">
      <label class="check-label">
        <input type="checkbox" id="loginConsent">
        Concordo com a <a href="#" id="linkPrivLogin">Política de Privacidade</a>.
      </label>
      <button class="btn primary full" id="doLogin" style="margin-top:14px">Entrar</button>
      <p style="font-size:13px;margin-top:12px">Ainda não tem conta? <a href="#" id="goRegister">Cadastre-se</a></p>
    `);
  }
}

// ---------- status do pedido ----------
function updateTracker() {
  const steps = document.querySelectorAll("#orderTracker .step");
  steps.forEach((s) => {
    const n = Number(s.dataset.step);
    s.classList.toggle("current", n === orderStep);
    s.classList.toggle("done", n < orderStep);
  });
}

function startOrderTracking(orderId) {
  orderStep = 0;
  updateTracker();
  $("#orderStatus").textContent = `Pedido #${orderId} confirmado. Status: Recebido.`;

  // simula avanço automático (só pra demonstração)
  setTimeout(() => {
    if (orderStep < 0) return;
    orderStep = 1;
    updateTracker();
    $("#orderStatus").textContent = `Pedido #${orderId} — Em preparo na cozinha.`;
  }, 4000);

  setTimeout(() => {
    if (orderStep < 0) return;
    orderStep = 2;
    updateTracker();
    $("#orderStatus").textContent = `Pedido #${orderId} — Pronto para retirada!`;
  }, 8000);

  setTimeout(() => {
    if (orderStep < 0) return;
    orderStep = 3;
    updateTracker();
    $("#orderStatus").textContent = `Pedido #${orderId} — Retirado. Bom apetite!`;
  }, 12000);
}

// ---------- eventos ----------
document.querySelectorAll(".filter").forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll(".filter").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    currentCategory = b.dataset.category;
    renderMenu();
  };
});

$("#cartButton").onclick = openCart;
$("#closeCart").onclick = closeCart;
$("#overlay").onclick = closeCart;
$("#closeModal").onclick = closeModal;

$("#unitSelect").onchange = (e) => {
  toast("Cardápio atualizado para a unidade " + e.target.value + ".");
};

$("#loginButton").onclick = () => openAuth("login");
$("#loginLoyalty").onclick = () => openAuth("login");

$("#promoButton").onclick = () => {
  if (!cart.length) add(1);
  toast("Promoção aplicada ao seu pedido.");
};

$("#checkoutButton").onclick = () => {
  if (!cart.length) {
    toast("Adicione pelo menos um item.");
    return;
  }

  showModal(`
    <h2>Pagamento externo</h2>
    <p>Você será direcionado a um provedor externo para concluir o pagamento. Este protótipo <strong>não coleta dados bancários reais</strong>.</p>
    <label class="check-label">
      <input type="checkbox" id="consent">
      Aceito o tratamento dos dados necessários ao pedido (LGPD).
    </label>
    <button class="btn primary full" style="margin-top:18px" id="pay">Ir para pagamento</button>
  `);
};

// clique geral no modal (login, cadastro, pagamento, privacidade)
document.addEventListener("click", (e) => {
  const id = e.target.id;

  if (id === "doLogin") {
    if (!$("#loginConsent") || !$("#loginConsent").checked) {
      toast("Marque o consentimento de privacidade para continuar.");
      return;
    }
    closeModal();
    toast("Login simulado realizado.");
  }

  if (id === "doRegister") {
    const name = $("#regName") ? $("#regName").value.trim() : "";
    if (!name) {
      toast("Informe seu nome.");
      return;
    }
    if (!$("#regConsent") || !$("#regConsent").checked) {
      toast("É necessário autorizar o uso dos dados (LGPD).");
      return;
    }
    closeModal();
    toast("Cadastro realizado! Bem-vindo(a), " + name.split(" ")[0] + ".");
  }

  if (id === "goRegister") {
    e.preventDefault();
    openAuth("cadastro");
  }

  if (id === "goLogin") {
    e.preventDefault();
    openAuth("login");
  }

  if (id === "linkPrivLogin" || id === "linkPrivReg" || id === "openPrivacy" || id === "footerPrivacy") {
    e.preventDefault();
    showPrivacy();
  }

  if (id === "closePrivacyBtn") {
    closeModal();
  }

  if (id === "pay") {
    if (!$("#consent") || !$("#consent").checked) {
      toast("Confirme o consentimento LGPD para continuar.");
      return;
    }

    closeModal();
    closeCart();

    const orderId = "RN-" + Math.floor(1000 + Math.random() * 9000);
    const total = cart.reduce((s, x) => s + x.price * x.qty, 0);

    // limpa a sacola
    cart = [];
    renderCart();

    // pontinhos de fidelidade (1 ponto por real)
    points += Math.floor(total);
    $("#pointsValue").textContent = points;
    $("#pointsLabel").textContent = points + " pontos";
    const pct = Math.min(100, (points / 1000) * 100);
    $("#progressBar").style.width = pct + "%";

    startOrderTracking(orderId);
    toast("Pagamento externo simulado com sucesso.");
  }
});

$("#lgpdAccept").onclick = acceptLgpd;
$("#lgpdRefuse").onclick = refuseLgpd;

// start
checkLgpdBanner();
renderMenu();
renderCart();
updateTracker();
