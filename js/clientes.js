// ============================
// clientes.js
// ============================

let clientes = [
  { codigo: "C001", nome: "João da Silva", telefone: "(11) 98765-1234", email: "joao@email.com", cidade: "São Paulo" },
  { codigo: "C002", nome: "Maria Oliveira", telefone: "(21) 96543-5678", email: "maria@email.com", cidade: "Rio de Janeiro" },
  { codigo: "C003", nome: "Carlos Pereira", telefone: "(31) 99912-3456", email: "carlos@email.com", cidade: "Belo Horizonte" }
];

let editandoCliente = null;

const tabelaClientes = document.getElementById("clientes-body");
const buscaCliente = document.getElementById("buscaCliente");
const filtroClientes = document.getElementById("filtroClientes");
const btnAddCliente = document.getElementById("btnAddCliente");
const modalCliente = document.getElementById("modalCliente");
const closeModalCliente = document.getElementById("closeModalCliente");
const formCliente = document.getElementById("formCliente");
const tituloModal = document.getElementById("tituloModalCliente");

/* =======================================
   1. RENDERIZAÇÃO DA LISTA
======================================= */
function renderClientes(lista) {
  tabelaClientes.innerHTML = "";

  lista.forEach((c, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.codigo}</td>
      <td>${c.nome}</td>
      <td>${c.telefone}</td>
      <td>${c.email}</td>
      <td>${c.cidade}</td>
      <td class="acoes">
        <button class="acao-btn editar" data-tooltip="Editar" title="Editar" data-index="${i}">
          <i class="fas fa-pen"></i>
        </button>
        <button class="acao-btn excluir" data-tooltip="Excluir" title="Excluir" data-index="${i}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tabelaClientes.appendChild(tr);
  });

  // Eventos de ação
  document.querySelectorAll(".acao-btn.editar").forEach(btn =>
    btn.addEventListener("click", () => editarCliente(btn.dataset.index))
  );

  document.querySelectorAll(".acao-btn.excluir").forEach(btn =>
    btn.addEventListener("click", () => excluirCliente(btn.dataset.index))
  );
}

/* =======================================
   2. BUSCA / FILTRO
======================================= */
buscaCliente.addEventListener("input", () => {
  const termo = buscaCliente.value.toLowerCase();
  const filtro = filtroClientes.value;
  const filtrados = clientes.filter(c =>
    c[filtro].toLowerCase().includes(termo)
  );
  renderClientes(filtrados);
});

/* =======================================
   3. MODAL 
======================================= */
btnAddCliente.addEventListener("click", () => {
  editandoCliente = null;
  tituloModal.textContent = "Cadastrar Cliente";
  formCliente.reset();
  modalCliente.style.display = "flex";
});

closeModalCliente.addEventListener("click", () => {
  modalCliente.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modalCliente) modalCliente.style.display = "none";
});

/* =======================================
   4. SALVAR / EDITAR CLIENTE
======================================= */
formCliente.addEventListener("submit", (e) => {
  e.preventDefault();

  const novoCliente = {
    codigo: formCliente.querySelector("#codigo").value.trim(),
    nome: formCliente.querySelector("#nome").value.trim(),
    telefone: formCliente.querySelector("#telefone").value.trim(),
    email: formCliente.querySelector("#email").value.trim(),
    cidade: formCliente.querySelector("#cidade").value.trim(),
  };

  if (editandoCliente !== null) {
    clientes[editandoCliente] = novoCliente;
    showPopup("✅ Cliente atualizado com sucesso!");
  } else {
    clientes.push(novoCliente);
    showPopup("✅ Cliente cadastrado com sucesso!");
  }

  renderClientes(clientes);
  modalCliente.style.display = "none";
  formCliente.reset();
});

/* =======================================
   5. EDITAR CLIENTE
======================================= */
function editarCliente(index) {
  const c = clientes[index];
  editandoCliente = index;
  tituloModal.textContent = "Editar Cliente";
  modalCliente.style.display = "flex";

  formCliente.querySelector("#codigo").value = c.codigo;
  formCliente.querySelector("#nome").value = c.nome;
  formCliente.querySelector("#telefone").value = c.telefone;
  formCliente.querySelector("#email").value = c.email;
  formCliente.querySelector("#cidade").value = c.cidade;
}

/* =======================================
   6. EXCLUIR CLIENTE
======================================= */
function excluirCliente(index) {
  const cliente = clientes[index];
  if (confirm(`Deseja realmente excluir ${cliente.nome}?`)) {
    clientes.splice(index, 1);
    renderClientes(clientes);
    showPopup("🗑️ Cliente excluído com sucesso!");
  }
}

/* =======================================
   7. POPUP (feedback)
======================================= */
function ensurePopupStyle() {
  if (document.getElementById("cliente-popup-style")) return;
  const style = document.createElement("style");
  style.id = "cliente-popup-style";
  style.textContent = `
  .popup-feedback {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--primary-color);
    color: white;
    padding: 14px 22px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
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
  popup.className = "popup-feedback";
  popup.textContent = text;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.transition = "opacity 0.4s ease";
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 400);
  }, 1800);
}

/* =======================================
   8. INICIALIZAÇÃO
======================================= */
renderClientes(clientes);
