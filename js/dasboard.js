// ================================
// DASHBOARD.JS — Gráficos e dados
// ================================

// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
  inicializarGraficos();
});

// Função principal de inicialização
function inicializarGraficos() {
  const ctxVendas = document.getElementById("graficoVendas");
  const ctxEstoque = document.getElementById("graficoEstoque");

  if (ctxVendas) carregarGraficoVendas(ctxVendas);
  if (ctxEstoque) carregarGraficoEstoque(ctxEstoque);
}

// Função auxiliar para pegar variáveis CSS
function getCssVar(nome) {
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

// ================================
// GRÁFICO DE VENDAS (BARRAS)
// ================================
function carregarGraficoVendas(ctx) {
  const primary = getCssVar("--primary-color");
  const accent = getCssVar("--secondary-color");
  const bgGradient = ctx.getContext("2d").createLinearGradient(0, 0, 0, 400);
  bgGradient.addColorStop(0, primary + "cc");
  bgGradient.addColorStop(1, primary + "22");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
      datasets: [
        {
          label: "Vendas (R$)",
          data: [1200, 1500, 800, 1800, 2300, 2100, 1600],
          backgroundColor: bgGradient,
          borderColor: primary,
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: accent, font: { size: 13, weight: "600" } },
        },
      },
      scales: {
        x: {
          ticks: { color: accent, font: { size: 12 } },
          grid: { display: false },
        },
        y: {
          ticks: { color: accent, font: { size: 12 } },
          grid: { color: "rgba(0,0,0,0.05)" },
        },
      },
    },
  });
}

// ================================
// GRÁFICO DE ESTOQUE (DOUGHNUT)
// ================================
function carregarGraficoEstoque(ctx) {
  const ativo = getCssVar("--status-ativo");
  const baixo = getCssVar("--status-baixo");
  const esgotado = getCssVar("--status-esgotado");
  const texto = getCssVar("--secondary-color");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Ativo", "Baixo Estoque", "Esgotado"],
      datasets: [
        {
          data: [65, 20, 15],
          backgroundColor: [ativo, baixo, esgotado],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: texto,
            boxWidth: 16,
            padding: 18,
            font: { size: 13, weight: "500" },
          },
        },
      },
    },
  });
}
