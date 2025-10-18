// ============================================
// main.js
// ============================================

// Mapeia cada página ao seu respectivo script
const PAGE_SCRIPTS = {
  "dashboard.html": "js/dashboard.js",
  "estoque.html": "js/estoque.js",
  "vendas.html": "js/vendas.js",
  "clientes.html": "js/clientes.js",
};

// Remove scripts anteriores (se existirem)
function removePageScripts() {
  document.querySelectorAll('script[data-page-script]').forEach(s => s.remove());
}

// Injeta e executa o script da página
async function injectPageScript(url) {
  removePageScripts();

  const filename = url.split('/').pop();
  const scriptPath = PAGE_SCRIPTS[filename];
  if (!scriptPath) {
    console.warn(`⚠️ Nenhum script configurado para ${filename}`);
    return;
  }

  try {
    const res = await fetch(`${scriptPath}?v=${Date.now()}`, { cache: "no-store" });
    const code = await res.text();

    // Cria um <script> visível no DOM com marcação da página
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.setAttribute("data-page-script", filename);
    document.body.appendChild(scriptTag);

    // Executa o conteúdo imediatamente no escopo global
    new Function(code)();

    // Log visual no console
    console.log(`%c✅ ${filename} carregado e executado com sucesso!`, "color:#00c853;font-weight:bold;");
  } catch (err) {
    console.error(`❌ Erro ao carregar o script da página ${filename}:`, err);
  }
}

// Carrega o conteúdo HTML da página
async function carregarPagina(url) {
  try {
    const res = await fetch(`${url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Falha ao carregar ${url}: ${res.status}`);

    const html = await res.text();
    const container = document.getElementById("page-content");
    if (!container) throw new Error("Elemento #page-content não encontrado.");

    container.innerHTML = html;

    // Injeta e executa o JS da página atual
    await injectPageScript(url);
  } catch (err) {
    console.error("Erro ao carregar página:", err);
    const container = document.getElementById("page-content");
    if (container) container.innerHTML = `<p style="color:red;">Erro ao carregar a página.</p>`;
  }
}

// Inicializa menu e navegação
window.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-btn");

  // Toggle da sidebar
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      if (sidebar.classList.contains("active")) window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Controle dos links do menu
  document.querySelectorAll(".sidebar nav a").forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();
      const url = link.getAttribute("href");
      if (!url) return;

      // Carrega a página
      await carregarPagina(url);

      // Atualiza menu ativo
      document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
      link.parentElement.classList.add("active");

      // Fecha sidebar em telas pequenas
      if (window.innerWidth <= 768 && sidebar?.classList.contains("active")) {
        sidebar.classList.remove("active");
      }
    });
  });

  carregarPagina("pages/dashboard.html");
});
