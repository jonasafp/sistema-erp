// ============================
// CONFIGURAÇÕES — Tema & Cores
// ============================

function iniciarConfiguracoes() {
  const temaCards = document.querySelectorAll(".tema-card");
  const corCards = document.querySelectorAll(".cor-card");

  if (!temaCards.length || !corCards.length) return;

  const temaSalvo = localStorage.getItem("tema") || "claro";
  const corSalva = localStorage.getItem("cor") || "azul";

  aplicarTema(temaSalvo);
  aplicarCores(corSalva);
  ativarCardSelecionado(temaCards, temaSalvo, "tema");
  ativarCardSelecionado(corCards, corSalva, "cor");

  temaCards.forEach(card => {
    card.addEventListener("click", () => {
      temaCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const tema = card.dataset.tema;
      aplicarTema(tema);
      localStorage.setItem("tema", tema);
      mostrarFeedback("Tema alterado com sucesso!");
    });
  });

  corCards.forEach(card => {
    card.addEventListener("click", () => {
      corCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const cor = card.dataset.cor;
      aplicarCores(cor);
      localStorage.setItem("cor", cor);
      mostrarFeedback("Paleta de cores atualizada!");
    });
  });
}

function ativarCardSelecionado(cards, valorSalvo, tipo) {
  cards.forEach(card => {
    const data = card.dataset[tipo];
    if (data === valorSalvo) card.classList.add("active");
  });
}

// Aplicar tema
function aplicarTema(tema) {
  const root = document.documentElement;
  if (tema === "escuro") {
    root.style.setProperty("--background-color", "#1c1f26");
    root.style.setProperty("--card-bg", "#2a2e39");
    root.style.setProperty("--text-color", "#f5f5f5");
    root.style.setProperty("--text-muted", "#c5c5c5");
    root.style.setProperty("--border-color", "#4c505aff");
    root.style.setProperty("--gradient-bg", "linear-gradient(180deg, #232527ff 0%, #1f2025ff 100%)");
  } else {
    root.style.setProperty("--background-color", "#e9f2ff");
    root.style.setProperty("--card-bg", "#ffffff");
    root.style.setProperty("--text-color", "#1a1a1a");
    root.style.setProperty("--text-muted", "#666666");
    root.style.setProperty("--border-color", "#dee2e6");
    root.style.setProperty("--gradient-bg", "linear-gradient(180deg, #e2eaf8ff 0%, #ecf0f7ff 100%)");
  }
}

// Aplicar esquema de cor
function aplicarCores(cor) {
  const root = document.documentElement;

  const esquemas = {
    azul: {
      "--grafic-color": "#0066ff46",
      "--primary-color": "#0066ff",
      "--primary-hover": "#0052cc",
      "--secondary-color": "#003366",
      "--accent-color": "#1c2e4a",
    },
    vermelho: {
      "--grafic-color": "#e5393546",
      "--primary-color": "#e53935",
      "--primary-hover": "#c62828",
      "--secondary-color": "#8b0000",
      "--accent-color": "#4a1c1c",
    },
    amarelo: {
      "--grafic-color": "#f9a82546",
      "--primary-color": "#f9a825",
      "--primary-hover": "#f57f17",
      "--secondary-color": "#5f370e",
      "--accent-color": "#3b2408",
    },
  };

  const esquema = esquemas[cor];
  if (!esquema) return;

  for (const [variavel, valor] of Object.entries(esquema)) {
    root.style.setProperty(variavel, valor);
  }
}

// Feedback visual
function mostrarFeedback(texto) {
  const aviso = document.createElement("div");
  aviso.className = "feedback-popup";
  aviso.textContent = texto;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.classList.add("ativo"), 10);
  setTimeout(() => aviso.classList.remove("ativo"), 2000);
  setTimeout(() => aviso.remove(), 2500);
}

// Executa imediatamente após injeção
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarConfiguracoes);
} else {
  iniciarConfiguracoes();
}
