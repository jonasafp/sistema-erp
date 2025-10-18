// js/estoque.js  (rodará assim que for injetado pelo main.js)

// Simulação de dados
const produtos = [
  { codigo: "P001", nome: "Teclado Mecânico", categoria: "Periféricos", quantidade: 120, status: "ok" },
  { codigo: "P002", nome: "Mouse Gamer", categoria: "Periféricos", quantidade: 12, status: "low" },
  { codigo: "P003", nome: "Monitor 24\"", categoria: "Monitores", quantidade: 0, status: "out" },
  { codigo: "P004", nome: "Headset USB", categoria: "Áudio", quantidade: 34, status: "ok" },
];

function carregarEstoque() {
  const tbody = document.getElementById("estoque-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  produtos.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nome}</td>
      <td>${p.categoria}</td>
      <td>${p.quantidade}</td>
      <td><span class="status ${p.status}">${formatarStatus(p.status)}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function formatarStatus(status) {
  switch (status) {
    case "ok": return "Em Estoque";
    case "low": return "Baixo Estoque";
    case "out": return "Esgotado";
    default: return "Indefinido";
  }
}

// --- inicialização (este arquivo é injetado pelo main.js após o HTML da página) ---
(function initEstoquePage() {
  // se o elemento não existe, aborta (por segurança)
  const btnAddProduto = document.getElementById("btnAddProduto");
  const modalProduto = document.getElementById("modalProduto");
  const closeModal = document.getElementById("closeModal");
  const formProduto = document.getElementById("formProduto");

  // carrega tabela
  carregarEstoque();

  if (!btnAddProduto || !modalProduto || !closeModal || !formProduto) {
    console.warn("estoque.js: elementos da página não encontrados — verifique se o HTML foi injetado corretamente.");
    return;
  }

  // abrir modal (adiciona classe show para efeitos)
  btnAddProduto.addEventListener("click", () => {
    modalProduto.style.display = "flex";
    // pequeno delay para garantir que a exibição já ocorreu antes de adicionar classe (para transição)
    setTimeout(() => modalProduto.classList.add("show"), 10);
  });

  function fecharModal() {
    modalProduto.classList.remove("show");
    setTimeout(() => {
      modalProduto.style.display = "none";
    }, 250);
  }

  closeModal.addEventListener("click", fecharModal);

  window.addEventListener("click", (e) => {
    if (e.target === modalProduto) fecharModal();
  });

  // submit do formulário adiciona produto visualmente (opcional)
  formProduto.addEventListener("submit", (e) => {
    e.preventDefault();
    const novo = {
      codigo: formProduto.codigo.value,
      nome: formProduto.nome.value,
      categoria: formProduto.categoria.value,
      quantidade: formProduto.quantidade.value,
      status: formProduto.status.value === "ativo" ? "ok" : (formProduto.status.value === "baixo" ? "low" : "out")
    };
    produtos.unshift(novo); // adiciona no início
    carregarEstoque();
    fecharModal();
    formProduto.reset();
  });
})();
