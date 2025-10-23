// ============================================
// main.js — Controle principal de navegação e carregamento dinâmico
// ============================================

// Mapeia cada página ao seu respectivo script
const PAGE_SCRIPTS = {
  "dashboard.html": "js/dashboard.js",
  "estoque.html": "js/estoque.js",
  "vendas.html": "js/vendas.js",
  "clientes.html": "js/clientes.js",
  "configuracoes.html": "js/configuracoes.js"
};

// ========================================================
// 🔹 Funções utilitárias
// ========================================================

// Remove scripts antigos antes de carregar novos
function removePageScripts() {
  document.querySelectorAll('script[data-page-script]').forEach(s => s.remove());
}

// Garante que o Chart.js esteja carregado antes de exibir o dashboard
async function garantirChartJS() {
  return new Promise((resolve, reject) => {
    if (window.Chart) {
      console.log("📊 Chart.js já está carregado.");
      return resolve();
    }

    console.log("📊 Carregando biblioteca Chart.js...");
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

// ========================================================
// 🔹 Carrega e injeta o script da página atual
// ========================================================
async function injectPageScript(url) {
  removePageScripts();

  const filename = url.split('/').pop();
  const scriptPath = PAGE_SCRIPTS[filename];
  if (!scriptPath) {
    console.warn(`⚠️ Nenhum script configurado para ${filename}`);
    return;
  }

  // ✅ Aguarda Chart.js antes de carregar o dashboard
  if (url.includes("dashboard.html")) {
    await garantirChartJS();
  }

  try {
    const res = await fetch(`${scriptPath}?v=${Date.now()}`, { cache: "no-store" });
    const code = await res.text();

    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.setAttribute("data-page-script", filename);
    scriptTag.textContent = code;
    document.body.appendChild(scriptTag);

    console.log(`%c✅ ${filename} carregado e executado com sucesso!`, "color:#00c853;font-weight:bold;");
  } catch (err) {
    console.error(`❌ Erro ao carregar o script da página ${filename}:`, err);
  }
}

// ========================================================
// 🔹 Carrega o conteúdo HTML da página
// ========================================================
async function carregarPagina(url) {
  try {
    const res = await fetch(`${url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Falha ao carregar ${url}: ${res.status}`);

    const html = await res.text();
    const container = document.getElementById("page-content");
    if (!container) throw new Error("Elemento #page-content não encontrado.");

    container.innerHTML = html;

    // ✅ Injeta e executa o JS da página atual
    await injectPageScript(url);
  } catch (err) {
    console.error("Erro ao carregar página:", err);
    const container = document.getElementById("page-content");
    if (container) container.innerHTML = `<p style="color:red;">Erro ao carregar a página.</p>`;
  }
}

// ========================================================
// 🔹 Inicializa menu lateral e navegação
// ========================================================
window.addEventListener("DOMContentLoaded", async () => {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-btn");

  // Abre/fecha o menu lateral
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      if (sidebar.classList.contains("active")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Configura os links de navegação
  document.querySelectorAll(".sidebar nav a").forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();
      const url = link.getAttribute("href");
      if (!url) return;

      await carregarPagina(url);

      document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
      link.parentElement.classList.add("active");

      // Fecha o menu em telas menores
      if (window.innerWidth <= 768 && sidebar?.classList.contains("active")) {
        sidebar.classList.remove("active");
      }
    });
  });

  // ✅ Garante que Chart.js seja carregado antes do dashboard inicial
  await garantirChartJS();
  await carregarPagina("pages/dashboard.html");
});
