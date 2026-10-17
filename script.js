// dados mock — só pra demo
const menu = [
  { id: 1, name: "Baião de Dois da Casa", category: "Pratos", price: 32.90, desc: "Arroz, feijão-verde, queijo coalho e carne-seca.", img: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80", units: ["Recife", "Fortaleza", "Salvador"] },
  { id: 2, name: "Carne de Sol com Macaxeira", category: "Pratos", price: 39.90, desc: "Carne de sol, macaxeira cremosa e manteiga de garrafa.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80", units: ["Recife", "Salvador"] },
  { id: 3, name: "Cuscuz Nordestino", category: "Pratos", price: 18.90, desc: "Cuscuz de milho com ovos, queijo coalho e manteiga.", img: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=800&q=80", units: ["Recife", "Fortaleza", "Salvador"] },
  { id: 4, name: "Tapioca de Queijo Coalho", category: "Lanches", price: 16.90, desc: "Tapioca dourada recheada com queijo coalho.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80", units: ["Fortaleza", "Salvador"] },
  { id: 5, name: "Sanduíche de Carne de Sol", category: "Lanches", price: 27.90, desc: "Pão artesanal, carne de sol, queijo e vinagrete.", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80", units: ["Recife", "Fortaleza"] },
  { id: 6, name: "Suco de Cajá", category: "Bebidas", price: 9.90, desc: "Polpa de cajá, água e um toque de açúcar.", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80", units: ["Recife", "Fortaleza", "Salvador"] }
];

const DEMO = {
  email: "teste@teste.com",
  senha: "123456",
  nome: "Teste"
};

const META_PONTOS = 1000;
const JUICE_ID = 6;

let cart = [];
let currentCategory = "Todos";
let currentUnit = "Recife";
let orderStep = -1;
let promoAtiva = false;
let points = 0;
let user = null;

try {
  const savedPts = localStorage.getItem("rn_points");
  if (savedPts !== null) points = Math.max(0, parseInt(savedPts, 10) || 0);
  const saved = sessionStorage.getItem("rn_user");
  if (saved) user = JSON.parse(saved);
  if (localStorage.getItem("rn_promo") === "1") promoAtiva = true;
} catch (e) {}

const $ = (s) => document.querySelector(s);
const money = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function savePoints() {
  try { localStorage.setItem("rn_points", String(points)); } catch (e) {}
}

function updatePointsUI() {
  if ($("#pointsValue")) $("#pointsValue").textContent = points;
  if ($("#pointsLabel")) $("#pointsLabel").textContent = points + " pontos";
  if ($("#progressBar")) {
    $("#progressBar").style.width = Math.min(100, (points / META_PONTOS) * 100) + "%";
  }
  const next = $("#nextBenefit");
  if (next) {
    if (points >= META_PONTOS) next.innerHTML = "Você já pode resgatar a <b>sobremesa da casa</b>";
    else next.innerHTML = "Faltam <b>" + (META_PONTOS - points) + "</b> pontos para a sobremesa da casa";
  }
}

function menuDaUnidade() {
  return menu.filter((x) => x.units.includes(currentUnit));
}

function qtdPratos() {
  return cart
    .filter((x) => x.category === "Pratos")
    .reduce((s, x) => s + x.qty, 0);
}

function temSucoGratis() {
  return promoAtiva && qtdPratos() >= 2;
}

function subtotalCart() {
  return cart.reduce((s, x) => s + x.price * x.qty, 0);
}

function descontoPromo() {
  // 2 pratos ou mais → suco de cajá sai grátis (se estiver na sacola)
  if (!temSucoGratis()) return 0;
  const suco = cart.find((x) => x.id === JUICE_ID);
  if (!suco) return 0;
  return Math.min(suco.price, suco.price * suco.qty); // 1 suco grátis
}

function totalCart() {
  return Math.max(0, subtotalCart() - descontoPromo());
}

function updateLoginButton() {
  const btn = $("#loginButton");
  if (!btn) return;
  if (user) {
    btn.textContent = "Olá, " + (user.nome || "cliente").split(" ")[0];
  } else {
    btn.textContent = "Entrar";
  }
}

function renderMenu() {
  const grid = $("#menuGrid");
  let list = menuDaUnidade();
  if (currentCategory !== "Todos") {
    list = list.filter((x) => x.category === currentCategory);
  }

  if (!list.length) {
    grid.innerHTML = "<p style='color:var(--muted)'>Nada nessa categoria pra esta unidade.</p>";
    return;
  }

  grid.innerHTML = list.map((x) => `
    <article class="food-card">
      <img class="food-img" loading="lazy" src="${x.img}" alt="${x.name}">
      <div class="food-body">
        <span class="eyebrow">${x.category}</span>
        <h3>${x.name}</h3>
        <p>${x.desc}</p>
        <div class="food-meta">
          <span class="price">${money(x.price)}</span>
          <button class="add" data-add="${x.id}" type="button">Adicionar</button>
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
  if (found) found.qty++;
  else cart.push({ ...item, qty: 1 });

  renderCart();
  toast("Adicionado na sacola.");
}

function remove(id) {
  const i = cart.findIndex((x) => x.id === id);
  if (i < 0) return;

  if (cart[i].qty > 1) cart[i].qty--;
  else cart.splice(i, 1);

  renderCart();
}

function renderCart() {
  const sub = subtotalCart();
  const desc = descontoPromo();
  const total = totalCart();

  $("#cartCount").textContent = cart.reduce((s, x) => s + x.qty, 0);
  $("#cartTotal").textContent = money(total);

  if (!cart.length) {
    $("#cartItems").innerHTML = "<p style='color:var(--muted)'>Sacola vazia.</p>";
    return;
  }

  let html = cart.map((x) => {
    const gratis = temSucoGratis() && x.id === JUICE_ID;
    return `
    <div class="cart-row">
      <div>
        <strong>${x.name}</strong>
        <small>${x.qty} × ${money(x.price)}${gratis ? " · 1 grátis (promo)" : ""}</small>
      </div>
      <button data-remove="${x.id}" type="button">Remover</button>
    </div>`;
  }).join("");

  if (desc > 0) {
    html += `<p style="font-size:13px;color:var(--ok);margin:8px 0 0">Promo: −${money(desc)} (suco de cajá grátis)</p>`;
  } else if (promoAtiva && qtdPratos() < 2) {
    html += `<p style="font-size:12px;color:var(--muted);margin:8px 0 0">Promo ativa: adicione 2 pratos e um suco de cajá para ganhar o suco grátis.</p>`;
  }

  html += `<p style="font-size:12px;color:var(--muted);margin:6px 0 0">Pontos deste pedido: +${Math.floor(total)}</p>`;

  $("#cartItems").innerHTML = html;

  document.querySelectorAll("[data-remove]").forEach((b) => {
    b.onclick = () => remove(Number(b.dataset.remove));
  });
}

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
  setTimeout(() => t.classList.remove("show"), 2800);
}

function checkLgpdBanner() {
  if (localStorage.getItem("rn_lgpd") === "ok") {
    $("#lgpdBanner").style.display = "none";
  }
}

function acceptLgpd() {
  localStorage.setItem("rn_lgpd", "ok");
  $("#lgpdBanner").style.display = "none";
  toast("Preferências salvas.");
}

function refuseLgpd() {
  $("#lgpdBanner").style.display = "none";
  toast("Ok. Algumas funções ficam limitadas.");
}

function showPrivacy() {
  showModal(`
    <h2>Política de Privacidade</h2>
    <p style="font-size:13px;line-height:1.65;max-height:50vh;overflow:auto">
      Este site de demonstração segue a <strong>LGPD — Lei nº 13.709/2018</strong>.
      <br><br>
      Tratamos nome, e-mail e dados do pedido só para mostrar o fluxo acadêmico
      (login, pedido e fidelidade). Base legal: consentimento (art. 7º, I).
      <br><br>
      Não pedimos dados de cartão. O pagamento é simulado.
      Você pode pedir exclusão dos dados a qualquer momento (art. 18).
    </p>
    <button class="btn primary full" id="closePrivacyBtn" type="button">Entendi</button>
  `);
}

function openAuth(mode) {
  if (user) {
    showModal(`
      <h2>Minha conta</h2>
      <p>Logado como <strong>${user.nome}</strong> (${user.email}).</p>
      <p style="font-size:13px">Saldo: <strong>${points}</strong> pontos</p>
      <button class="btn primary full" id="doLogout" type="button" style="margin-top:14px">Sair</button>
    `);
    return;
  }

  if (mode === "cadastro") {
    showModal(`
      <h2>Criar conta</h2>
      <p>Pra acompanhar pedidos e pontos.</p>
      <input class="field" type="text" id="regName" placeholder="Seu nome" aria-label="Nome">
      <input class="field" type="email" id="regEmail" placeholder="E-mail" aria-label="E-mail">
      <input class="field" type="password" id="regPass" placeholder="Senha" aria-label="Senha">
      <label class="check-label">
        <input type="checkbox" id="regConsent">
        Autorizo o uso dos dados (LGPD — Lei 13.709/2018) e li a
        <a href="#" id="linkPrivReg">Política de Privacidade</a>.
      </label>
      <button class="btn primary full" id="doRegister" type="button" style="margin-top:14px">Cadastrar</button>
      <p style="font-size:13px;margin-top:12px">Já tem conta? <a href="#" id="goLogin">Entrar</a></p>
    `);
  } else {
    showModal(`
      <h2>Entrar</h2>
      <p>Pedidos e pontos.</p>
      <div style="background:#f4f1ec;border:1px solid #e0d6cb;border-radius:6px;padding:10px 12px;margin:10px 0 14px;font-size:12px;line-height:1.5">
        <strong>Conta de teste</strong><br>
        E-mail: <code>teste@teste.com</code><br>
        Senha: <code>123456</code>
      </div>
      <input class="field" type="email" id="loginEmail" placeholder="E-mail" aria-label="E-mail" value="teste@teste.com">
      <input class="field" type="password" id="loginPass" placeholder="Senha" aria-label="Senha" value="123456">
      <label class="check-label">
        <input type="checkbox" id="loginConsent">
        Concordo com a LGPD (Lei 13.709/2018) e a
        <a href="#" id="linkPrivLogin">Política de Privacidade</a>.
      </label>
      <button class="btn primary full" id="doLogin" type="button" style="margin-top:14px">Entrar</button>
      <p style="font-size:13px;margin-top:12px">Não tem conta? <a href="#" id="goRegister">Cadastre-se</a></p>
    `);
  }
}

function updateTracker() {
  document.querySelectorAll("#orderTracker .step").forEach((s) => {
    const n = Number(s.dataset.step);
    s.classList.toggle("current", n === orderStep);
    s.classList.toggle("done", n < orderStep);
  });
}

function startOrderTracking(orderId) {
  orderStep = 0;
  updateTracker();
  $("#orderStatus").textContent = `Pedido #${orderId} confirmado. Status: Recebido.`;

  setTimeout(() => {
    if (orderStep < 0) return;
    orderStep = 1;
    updateTracker();
    $("#orderStatus").textContent = `Pedido #${orderId} — Em preparo.`;
  }, 4000);

  setTimeout(() => {
    if (orderStep < 0) return;
    orderStep = 2;
    updateTracker();
    $("#orderStatus").textContent = `Pedido #${orderId} — Pronto pra retirada.`;
  }, 8000);

  setTimeout(() => {
    if (orderStep < 0) return;
    orderStep = 3;
    updateTracker();
    $("#orderStatus").textContent = `Pedido #${orderId} — Retirado. Bom apetite!`;
  }, 12000);
}

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
  currentUnit = e.target.value;
  renderMenu();
  toast("Unidade: " + currentUnit);
};

$("#loginButton").onclick = () => openAuth("login");
$("#loginLoyalty").onclick = () => openAuth("login");

// Promo: 2 pratos + suco de cajá → 1 suco grátis
$("#promoButton").onclick = () => {
  promoAtiva = true;
  try { localStorage.setItem("rn_promo", "1"); } catch (e) {}

  // garante 2 pratos da unidade + suco, se ainda não tiver
  const pratos = menuDaUnidade().filter((x) => x.category === "Pratos");
  while (qtdPratos() < 2 && pratos.length) {
    add(pratos[Math.min(qtdPratos(), pratos.length - 1)].id);
  }
  if (!cart.find((x) => x.id === JUICE_ID)) {
    const suco = menu.find((x) => x.id === JUICE_ID && x.units.includes(currentUnit));
    if (suco) add(suco.id);
    else toast("Suco de cajá não disponível nesta unidade.");
  }

  renderCart();
  openCart();
  toast("Promo ativa: 2 pratos → 1 suco de cajá grátis.");
};

$("#checkoutButton").onclick = () => {
  if (!cart.length) {
    toast("Adicione pelo menos um item.");
    return;
  }

  const total = totalCart();
  const desc = descontoPromo();

  showModal(`
    <h2>Pagamento externo</h2>
    <p>Aqui é só simulação — <strong>não coletamos dados bancários</strong>.</p>
    <p style="font-size:14px">Total: <strong>${money(total)}</strong>${desc > 0 ? " (com promo)" : ""}</p>
    <p style="font-size:13px;color:var(--muted)">Você ganha <strong>+${Math.floor(total)}</strong> pontos neste pedido.</p>
    <label class="check-label">
      <input type="checkbox" id="consent">
      Autorizo o tratamento dos dados do pedido (LGPD — Lei 13.709/2018, art. 7º, I).
    </label>
    <button class="btn primary full" style="margin-top:18px" id="pay" type="button">Ir para pagamento</button>
  `);
};

document.addEventListener("click", (e) => {
  const id = e.target.id;

  if (id === "doLogin") {
    if (!$("#loginConsent") || !$("#loginConsent").checked) {
      toast("Marque o aceite da LGPD pra continuar.");
      return;
    }
    const email = ($("#loginEmail") && $("#loginEmail").value.trim().toLowerCase()) || "";
    const senha = ($("#loginPass") && $("#loginPass").value) || "";

    if (email === DEMO.email && senha === DEMO.senha) {
      user = { nome: DEMO.nome, email: DEMO.email };
      sessionStorage.setItem("rn_user", JSON.stringify(user));
      updateLoginButton();
      closeModal();
      toast("Login ok (conta de teste).");
      return;
    }

    try {
      const regs = JSON.parse(localStorage.getItem("rn_regs") || "[]");
      const found = regs.find((u) => u.email === email && u.senha === senha);
      if (found) {
        user = { nome: found.nome, email: found.email };
        sessionStorage.setItem("rn_user", JSON.stringify(user));
        updateLoginButton();
        closeModal();
        toast("Login ok. Olá, " + user.nome.split(" ")[0] + "!");
        return;
      }
    } catch (err) {}

    toast("E-mail ou senha inválidos. Use a conta de teste ou cadastre-se.");
  }

  if (id === "doLogout") {
    user = null;
    sessionStorage.removeItem("rn_user");
    updateLoginButton();
    closeModal();
    toast("Saiu da conta.");
  }

  if (id === "doRegister") {
    const name = $("#regName") ? $("#regName").value.trim() : "";
    const email = $("#regEmail") ? $("#regEmail").value.trim().toLowerCase() : "";
    const senha = $("#regPass") ? $("#regPass").value : "";
    if (!name) {
      toast("Coloca seu nome.");
      return;
    }
    if (!email || !senha) {
      toast("Preencha e-mail e senha.");
      return;
    }
    if (!$("#regConsent") || !$("#regConsent").checked) {
      toast("Precisa autorizar a LGPD pra cadastrar.");
      return;
    }
    try {
      const regs = JSON.parse(localStorage.getItem("rn_regs") || "[]");
      regs.push({ nome: name, email, senha });
      localStorage.setItem("rn_regs", JSON.stringify(regs));
    } catch (err) {}
    user = { nome: name, email };
    sessionStorage.setItem("rn_user", JSON.stringify(user));
    updateLoginButton();
    closeModal();
    toast("Cadastro feito. Bem-vindo(a), " + name.split(" ")[0] + "!");
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

  if (id === "closePrivacyBtn") closeModal();

  if (id === "pay") {
    if (!$("#consent") || !$("#consent").checked) {
      toast("Marque o consentimento LGPD.");
      return;
    }

    const total = totalCart();
    const ganhos = Math.floor(total);

    closeModal();
    closeCart();

    const orderId = "RN-" + Math.floor(1000 + Math.random() * 9000);

    cart = [];
    promoAtiva = false;
    try { localStorage.removeItem("rn_promo"); } catch (e) {}
    renderCart();

    points += ganhos;
    savePoints();
    updatePointsUI();

    startOrderTracking(orderId);
    toast("Pedido ok. +" + ganhos + " pontos (saldo: " + points + ").");
  }
});

$("#lgpdAccept").onclick = acceptLgpd;
$("#lgpdRefuse").onclick = refuseLgpd;

if ($("#unitSelect")) currentUnit = $("#unitSelect").value;

checkLgpdBanner();
renderMenu();
renderCart();
updateTracker();
updateLoginButton();
updatePointsUI();
