// ===========================
// vendas.js — PDV (corrigido)
// - Não depende de DOMContentLoaded (pronto para injeção dinâmica)
// - Modais abrem por clique
// - Sem atalhos de teclado (apenas clique)
// ===========================

/* catálogo de exemplo (adicione img: "caminho" se quiser exibir imagem lateral) */
const produtosCatalogo = [
  { codigo: "0001", nome: "PÃO FRANCÊS", preco: 8.90, img: "../assets/pao.png" },
  { codigo: "0002", nome: "HOT POCKET SADIA X BURGUER", preco: 5.60, img: "../assets/hotpocket.png" },
  { codigo: "0003", nome: "STEAK DE FRANGO SADIA 100G", preco: 2.50 },
  { codigo: "0004", nome: "COXA E SOBRE COXA SADIA 1KG", preco: 16.50 },
  { codigo: "0005", nome: "REFRIGERANTE LATA 350ML", preco: 4.50, img: "../assets/refrigerante.png" },
];

let venda = [];

/* ---------- helpers ---------- */
function fmt(valor) {
  return `R$ ${Number(valor || 0).toFixed(2)}`;
}

/* ---------- renderização ---------- */
function renderTabela() {
  const tbody = document.getElementById("pdv-body");
  if (!tbody) {
    console.warn("renderTabela: #pdv-body não encontrado");
    return;
  }
  tbody.innerHTML = "";

  let total = 0;
  venda.forEach((item, i) => {
    const sub = item.preco * item.qtd;
    total += sub;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.codigo}</td>
      <td>${i + 1}</td>
      <td>${item.nome}</td>
      <td>${fmt(item.preco)}</td>
      <td>${Number(item.qtd).toFixed(3)}</td>
      <td>${fmt(sub)}</td>
    `;
    tbody.appendChild(tr);
  });

  const totalEl = document.getElementById("total-compra");
  if (totalEl) totalEl.textContent = fmt(total);
}

/* atualiza painel lateral (mostra imagem apenas se produto.img existir) */
function atualizarResumo(produto) {
  const nomeEl = document.getElementById("produto-nome");
  const precoEl = document.getElementById("preco-produto");
  const qtdEl = document.getElementById("quantidade-produto");
  const subtotalEl = document.getElementById("subtotal-produto");
  const imgEl = document.getElementById("produto-img");

  if (!nomeEl || !precoEl || !qtdEl || !subtotalEl) {
    console.warn("atualizarResumo: elementos do painel lateral não encontrados");
    return;
  }

  if (!produto) {
    nomeEl.textContent = "CAIXA LIVRE - AGUARDANDO PRODUTO";
    precoEl.textContent = "R$ 0,00";
    qtdEl.textContent = "0";
    subtotalEl.textContent = "R$ 0,00";
    if (imgEl) imgEl.style.display = "none";
    return;
  }

  nomeEl.textContent = produto.nome;
  precoEl.textContent = fmt(produto.preco);
  qtdEl.textContent = Number(produto.qtd).toFixed(3);
  subtotalEl.textContent = fmt(produto.preco * produto.qtd);

  if (imgEl) {
    if (produto.img) {
      imgEl.src = produto.img;
      imgEl.style.display = "block";
    } else {
      imgEl.style.display = "none";
    }
  }
}

/* ---------- entrada por código (campo visível) ---------- */
function handleInputCodigo(inputCodigo) {
  if (!inputCodigo) return;

  inputCodigo.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    const codigo = inputCodigo.value.trim();
    inputCodigo.value = "";
    if (!codigo) return;

    const produto = produtosCatalogo.find(p => p.codigo === codigo);
    if (!produto) {
      alert("Produto não encontrado!");
      return;
    }

    const existente = venda.find(p => p.codigo === codigo);
    if (existente) existente.qtd += 1;
    else venda.push({ ...produto, qtd: 1 });

    renderTabela();
    atualizarResumo(produto);

    // destaque do último item
    const linhas = document.querySelectorAll("#pdv-body tr");
    if (linhas.length) {
      const ultima = linhas[linhas.length - 1];
      ultima.classList.add("novo-item");
      setTimeout(() => ultima.classList.remove("novo-item"), 500);
    }
  });
}

/* ---------- Modal de consulta (abre por clique no botão) ---------- */
function setupModalConsulta() {
  const btnConsultarProdutos = document.getElementById("btnConsultarProdutos");
  const modalConsulta = document.getElementById("modalConsulta");
  const closeConsulta = document.getElementById("closeConsulta");
  const inputBuscaProduto = document.getElementById("inputBuscaProduto");
  const listaConsulta = document.getElementById("listaConsulta");

  if (!btnConsultarProdutos || !modalConsulta || !closeConsulta || !inputBuscaProduto || !listaConsulta) {
    console.warn("setupModalConsulta: elementos de consulta não encontrados");
    return;
  }

  function atualizarListaConsulta(lista) {
    listaConsulta.innerHTML = "";
    lista.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.codigo}</td>
        <td>${p.nome}</td>
        <td>${fmt(p.preco)}</td>
      `;
      tr.addEventListener("click", () => {
        // adiciona o produto e fecha modal
        const existente = venda.find(x => x.codigo === p.codigo);
        if (existente) existente.qtd += 1;
        else venda.push({ ...p, qtd: 1 });

        renderTabela();
        atualizarResumo(p);
        modalConsulta.style.display = "none";
      });
      listaConsulta.appendChild(tr);
    });
  }

  btnConsultarProdutos.addEventListener("click", () => {
    atualizarListaConsulta(produtosCatalogo);
    modalConsulta.style.display = "flex";
    inputBuscaProduto.value = "";
    setTimeout(() => inputBuscaProduto.focus(), 50);
  });

  closeConsulta.addEventListener("click", () => (modalConsulta.style.display = "none"));
  inputBuscaProduto.addEventListener("input", () => {
    const termo = inputBuscaProduto.value.toLowerCase();
    const filtrados = produtosCatalogo.filter(p => p.nome.toLowerCase().includes(termo) || p.codigo.includes(termo));
    atualizarListaConsulta(filtrados);
  });

  // fecha clicando fora
  window.addEventListener("click", (e) => {
    if (e.target === modalConsulta) modalConsulta.style.display = "none";
  });
}

/* ---------- Modal de pagamento / finalizar venda ---------- */
function setupModalPagamento() {
  const btnFinalizarVenda = document.getElementById("btnFinalizarVenda");
  const modalPagamento = document.getElementById("modalPagamento");
  const closePagamento = document.getElementById("closePagamento");
  const pagamentoTotal = document.getElementById("pagamento-total");
  const valorFinal = document.getElementById("valor-final");
  const descontoInput = document.getElementById("desconto");
  const acrescimoInput = document.getElementById("acrescimo");
  const formaPagamento = document.getElementById("formaPagamento");
  const btnConfirmarPagamento = document.getElementById("btnConfirmarPagamento");

  if (!btnFinalizarVenda || !modalPagamento || !closePagamento || !pagamentoTotal || !valorFinal || !descontoInput || !acrescimoInput || !formaPagamento || !btnConfirmarPagamento) {
    console.warn("setupModalPagamento: elementos de pagamento não encontrados");
    return;
  }

  function obterTotalAtual() {
    const texto = document.getElementById("total-compra")?.textContent || "R$ 0,00";
    return parseFloat(texto.replace(/[R$\s]/g, "").replace(",", ".")) || 0;
  }

  function aplicarDescontoAcrescimo(total) {
    const d = descontoInput.value.trim();
    const a = acrescimoInput.value.trim();

    let novo = total;
    if (d) {
      if (d.endsWith("%")) {
        const p = parseFloat(d.slice(0, -1)) || 0;
        novo -= (novo * p / 100);
      } else {
        novo -= parseFloat(d) || 0;
      }
    }

    if (a) {
      if (a.endsWith("%")) {
        const p = parseFloat(a.slice(0, -1)) || 0;
        novo += (novo * p / 100);
      } else {
        novo += parseFloat(a) || 0;
      }
    }

    if (novo < 0) novo = 0;
    return novo;
  }

  function atualizarValorFinal() {
    const total = obterTotalAtual();
    const novo = aplicarDescontoAcrescimo(total);
    valorFinal.textContent = fmt(novo);
  }

  btnFinalizarVenda.addEventListener("click", () => {
    const total = obterTotalAtual();
    if (total <= 0) {
      alert("Nenhum produto na venda!");
      return;
    }
    pagamentoTotal.textContent = fmt(total);
    valorFinal.textContent = fmt(total);
    descontoInput.value = "";
    acrescimoInput.value = "";
    formaPagamento.value = "";
    modalPagamento.style.display = "flex";
    setTimeout(() => descontoInput.focus(), 50);
  });

  closePagamento.addEventListener("click", () => {
    // fechar sem limpar venda
    modalPagamento.style.display = "none";
  });

  descontoInput.addEventListener("input", atualizarValorFinal);
  acrescimoInput.addEventListener("input", atualizarValorFinal);

  btnConfirmarPagamento.addEventListener("click", () => {
    const forma = formaPagamento.value;
    if (!forma) {
      alert("Selecione a forma de pagamento!");
      return;
    }

    // finalizar venda: fecha modal, limpa venda, atualiza UI e exibe popup
    modalPagamento.style.display = "none";
    venda = [];
    renderTabela();
    atualizarResumo();

    showPopup("✅ Venda finalizada com sucesso!");
  });
}

/* ---------- popup visual ---------- */
function ensurePopupStyle() {
  if (document.getElementById("venda-popup-style")) return;
  const style = document.createElement("style");
  style.id = "venda-popup-style";
  style.textContent = `
  .popup-venda-finalizada {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--primary-color);
    color: white;
    padding: 16px 24px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1.1rem;
    box-shadow: var(--shadow-default);
    animation: fadeZoom 0.35s ease;
    z-index: 9999;
  }
  @keyframes fadeZoom {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }`;
  document.head.appendChild(style);
}

function showPopup(text) {
  ensurePopupStyle();
  const popup = document.createElement("div");
  popup.className = "popup-venda-finalizada";
  popup.textContent = text;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.transition = "opacity 0.4s ease";
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 400);
  }, 1800);
}

/* ---------- outros botões (apenas clique) ---------- */
function setupOtherButtons() {
  document.getElementById("btnFecharCaixa")?.addEventListener("click", () => alert("Fechando caixa..."));
  document.getElementById("btnAbrirCaixa")?.addEventListener("click", () => alert("Abrindo caixa..."));
  document.getElementById("btnCancelarVenda")?.addEventListener("click", () => {
    if (!confirm("Cancelar venda atual?")) return;
    venda = [];
    renderTabela();
    atualizarResumo();
  });
  document.getElementById("btnCancelarItem")?.addEventListener("click", () => {
    if (venda.length === 0) return;
    venda.pop();
    renderTabela();
    atualizarResumo(venda[venda.length - 1]);
  });
  document.getElementById("btnDevolucao")?.addEventListener("click", () => alert("Devolução em desenvolvimento."));
}

/* ---------- inicialização imediata (para execução após injeção) ---------- */
(function initPDVPage() {
  // valida elementos mínimos
  const required = [
    "inputCodigo","pdv-body","produto-nome","preco-produto","quantidade-produto","subtotal-produto","total-compra",
    "btnConsultarProdutos","modalConsulta","closeConsulta","inputBuscaProduto","listaConsulta",
    "btnFinalizarVenda","modalPagamento","closePagamento","pagamento-total","valor-final","desconto","acrescimo","formaPagamento","btnConfirmarPagamento"
  ];
  const missing = required.filter(id => !document.getElementById(id));
  if (missing.length) {
    // se a página foi injetada mas os elementos ainda não existem, avisamos e abortamos silenciosamente
    // (isso evita erros ao executar em contextos distintos). Se você ver esse log, significa que o script
    // foi executado em contexto errado.
    console.warn("initPDVPage: elementos faltando (vendas.js abortado):", missing);
    return;
  }

  // tudo certo — registra handlers
  handleInputCodigo(document.getElementById("inputCodigo"));
  setupModalConsulta();
  setupModalPagamento();
  setupOtherButtons();

  renderTabela();
  atualizarResumo();
  document.getElementById("inputCodigo").focus();

  console.log("%c✅ vendas.js inicializado (modais conectados via clique).", "color:#00bcd4;font-weight:bold;");
})();
