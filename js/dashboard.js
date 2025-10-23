// ============================================
// dashboard.js — Geração dos gráficos do painel
// ============================================

console.log("📊 Executando dashboard.js...");

// Função principal para criar os gráficos
function inicializarGraficos() {
  const ctxVendas = document.getElementById("graficoVendas");
  const ctxEstoque = document.getElementById("graficoEstoque");

  if (!ctxVendas || !ctxEstoque) {
    console.warn("⏳ Aguardando carregamento dos elementos do gráfico...");
    return false;
  }

  // === Gráfico de Vendas (últimos 30 dias)
  new Chart(ctxVendas, {
    type: "line",
    data: {
      labels: ["01", "05", "10", "15", "20", "25", "30"],
      datasets: [{
        label: "Vendas (R$)",
        data: [1200, 950, 1500, 1800, 1300, 2100, 1900],
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-hover').trim(),
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Vendas - Últimos 30 dias",
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
        }
      },
      scales: {
        x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() } },
        y: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() } }
      }
    }
  });

  // === Gráfico de Status do Estoque
  new Chart(ctxEstoque, {
    type: "doughnut",
    data: {
      labels: ["Ativo", "Baixo Estoque", "Esgotado"],
      datasets: [{
        data: [60, 25, 15],
        backgroundColor: [
          getComputedStyle(document.documentElement).getPropertyValue('--status-ativo').trim(),
          getComputedStyle(document.documentElement).getPropertyValue('--status-baixo').trim(),
          getComputedStyle(document.documentElement).getPropertyValue('--status-esgotado').trim()
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
          }
        },
        title: {
          display: true,
          text: "Status do Estoque",
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
        }
      }
    }
  });

  console.log("✅ Gráficos do dashboard criados com sucesso!");
  return true;
}

// 🔹 Observa o container principal para saber quando o dashboard foi carregado
const observer = new MutationObserver(() => {
  const sucesso = inicializarGraficos();
  if (sucesso) observer.disconnect(); // para de observar quando os gráficos forem criados
});

// 🔹 Inicia o observador assim que o script rodar
observer.observe(document.getElementById("page-content"), { childList: true, subtree: true });

// 🔹 E também tenta iniciar os gráficos diretamente caso o HTML já esteja lá
setTimeout(inicializarGraficos, 500);
