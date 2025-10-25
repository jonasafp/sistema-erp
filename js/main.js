// ============================================
// main.js — Controle de navegação e configuração global
// ============================================

// Mapeamento das páginas e seus scripts correspondentes
const PAGE_SCRIPTS = {
  "dashboard.html": "js/dashboard.js",
  "estoque.html": "js/estoque.js",
  "vendas.html": "js/vendas.js",
  "clientes.html": "js/clientes.js",
  "configuracoes.html": "js/configuracoes.js"
};

// === Funções de tema e cores ===

// Aplica as variáveis CSS no :root conforme tema e cor
function aplicarTemaEEsquema(tema = "claro", esquema = "azul") {
  const root = document.documentElement;

  // === Tema Claro ===
  if (tema === "claro") {
    root.style.setProperty("--background-color", "#f8f9fa");
    root.style.setProperty("--card-bg", "#ffffff");
    root.style.setProperty("--text-color", "#1a1a1a");
    root.style.setProperty("--text-muted", "#666666");
    root.style.setProperty("--border-color", "#dee2e6");
  }

  // === Tema Escuro ===
  if (tema === "escuro") {
    root.style.setProperty("--background-color", "#121212");
    root.style.setProperty("--card-bg", "#1e1e1e");
    root.style.setProperty("--text-color", "#e6eef9");
    root.style.setProperty("--text-muted", "#bfc8d6");
    root.style.setProperty("--border-color", "#2a2f36");
  }

  // === Esquema de cores ===
  const esquemas = {
    azul: {
      "--primary-color": "#007bff",
      "--primary-hover": "#0056b3",
      "--secondary-color": "#004085",
      "--accent-color": "#1c2e4a"
    },
    vermelho: {
      "--primary-color": "#e53935",
      "--primary-hover": "#c62828",
      "--secondary-color": "#8b0000",
      "--accent-color": "#4a1c1c"
    },
    amarelo: {
      "--primary-color": "#f9a825",
      "--primary-hover": "#f57f17",
      "--secondary-color": "#5f370e",
      "--accent-color": "#3b2408"
    }
  };

  const selected = esquemas[esquema] || esquemas.azul;
  for (const key in selected) root.style.setProperty(key, selected[key]);

  // === Cores de status ===
  root.style.setProperty("--status-ativo", "#28a745");
  root.style.setProperty("--status-baixo", "#ffc107");
  root.style.setProperty("--status-esgotado", "#dc3545");

  root.style.setProperty("--shadow-default", "0 4px 10px rgba(0,0,0,0.08)");
  root.style.setProperty("--radius-default", "12px");

  // === Grava no localStorage ===
  localStorage.setItem("temaSistema", tema);
  localStorage.setItem("corSistema", esquema);
}

// Garante aplicação das configurações ao iniciar o sistema
function inicializarConfiguracoesAoStart() {
  let tema = localStorage.getItem("temaSistema");
  let cor = localStorage.getItem("corSistema");

  // Se ainda não há configuração, define padrão
  if (!tema || !cor) {
    tema = "claro";
    cor = "azul";
    localStorage.setItem("temaSistema", tema);
    localStorage.setItem("corSistema", cor);
    console.log("🎯 Configuração padrão aplicada: tema=claro, cor=azul");
  } else {
    console.log(`🎨 Configuração carregada: tema=${tema}, cor=${cor}`);
  }

  aplicarTemaEEsquema(tema, cor);
}

// ============================================
// 🔹 Controle de scripts e carregamento de páginas
// ============================================

function removePageScripts() {
  document.querySelectorAll("script[data-page-script]").forEach(s => s.remove());
}

// Garante que Chart.js esteja disponível
async function garantirChartJS() {
  return new Promise((resolve, reject) => {
    if (window.Chart) {
      console.log("📊 Chart.js já está disponível.");
      return resolve();
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js";
    script.onload = () => {
      console.log("✅ Chart.js carregado com sucesso.");
      resolve();
    };
    script.onerror = () => reject("❌ Falha ao carregar Chart.js.");
    document.head.appendChild(script);
  });
}

// Injeta o script da página ativa
async function injectPageScript(url) {
  removePageScripts();
  const filename = url.split("/").pop();
  const scriptPath = PAGE_SCRIPTS[filename];
  if (!scriptPath) {
    console.warn(`⚠️ Nenhum script configurado para ${filename}`);
    return;
  }

  if (url.includes("dashboard.html")) await garantirChartJS();

  try {
    const res = await fetch(`${scriptPath}?v=${Date.now()}`, { cache: "no-store" });
    const code = await res.text();
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.setAttribute("data-page-script", filename);
    scriptTag.textContent = code;
    document.body.appendChild(scriptTag);

    console.log(`✅ ${filename} carregado e executado.`);
  } catch (err) {
    console.error(`❌ Erro ao carregar script de ${filename}:`, err);
  }
}

// Carrega o conteúdo HTML da página
async function carregarPagina(url) {
  try {
    const res = await fetch(`${url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Falha ao carregar ${url}: ${res.status}`);
    const html = await res.text();
    const container = document.getElementById("page-content");
    container.innerHTML = html;
    await injectPageScript(url);
  } catch (err) {
    console.error("Erro ao carregar página:", err);
    const container = document.getElementById("page-content");
    if (container) container.innerHTML = `<p style="color:red;">Erro ao carregar a página.</p>`;
  }
}

// ============================================
// 🔹 Inicialização principal
// ============================================

window.addEventListener("DOMContentLoaded", async () => {
  // ✅ Aplica tema e cor imediatamente antes de qualquer renderização
  inicializarConfiguracoesAoStart();

  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-btn");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      if (sidebar.classList.contains("active")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  document.querySelectorAll(".sidebar nav a").forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();
      const url = link.getAttribute("href");
      if (!url) return;

      await carregarPagina(url);

      document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
      link.parentElement.classList.add("active");

      if (window.innerWidth <= 768 && sidebar?.classList.contains("active")) {
        sidebar.classList.remove("active");
      }
    });
  });

  // ✅ Carrega dashboard por padrão ao iniciar
  await garantirChartJS();
  await carregarPagina("pages/dashboard.html");
});
