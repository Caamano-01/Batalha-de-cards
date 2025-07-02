const logDiv = document.getElementById("log");
const droppableAreas = document.querySelectorAll(".droppable-slot");
const draggableCards = document.querySelectorAll(".card"); // Seleciona todos os cards

// Variáveis para armazenar os dragões nas arenas
let dragonArena1 = null;
let dragonArena2 = null;

// Adicionar eventos de arrastar para os cards
draggableCards.forEach(card => {
  card.addEventListener("dragstart", (e) => {
    // Armazena os dados no formato JSON
    const dragData = {
      name: card.dataset.name,
      attack: card.dataset.attack,
      defense: card.dataset.defense
    };
    e.dataTransfer.setData("application/json", JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = "move";
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });
});

// Adicionar eventos de soltar para as áreas de drop
droppableAreas.forEach(slot => {
  slot.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    slot.classList.add("drag-over");
  });

  slot.addEventListener("dragleave", () => {
    slot.classList.remove("drag-over");
  });

  slot.addEventListener("drop", (e) => {
    e.preventDefault();
    slot.classList.remove("drag-over");

    // Evita múltiplos dragões por arena
    if (slot.querySelector(".card")) {
      adicionarLog("Já existe um dragão nesta arena. Resete para trocar.");
      return;
    }

    // Recupera os dados do dragão
    const dragData = JSON.parse(e.dataTransfer.getData("application/json"));

    // Cria visual do card clonado manualmente (ou pode clonar do original)
    const originalCard = document.querySelector(`.card[data-name="${dragData.name}"]`);
    const clonedCard = originalCard.cloneNode(true);
    clonedCard.draggable = false;

    // Reatribui os data-attributes
    clonedCard.setAttribute("data-name", dragData.name);
    clonedCard.setAttribute("data-attack", dragData.attack);
    clonedCard.setAttribute("data-defense", dragData.defense);

    slot.appendChild(clonedCard);
    adicionarLog(`${dragData.name} foi posicionado na Arena ${slot.dataset.order}.`);

    // Salva os dados na variável correta
    const dragonData = {
      name: dragData.name,
      attack: parseInt(dragData.attack),
      defense: parseInt(dragData.defense)
    };

    if (slot.dataset.order === "1") {
      dragonArena1 = dragonData;
    } else if (slot.dataset.order === "2") {
      dragonArena2 = dragonData;
    }
  });
});


function adicionarLog(mensagem) {
  const p = document.createElement("p");
  p.textContent = mensagem;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}



function lutar() {
  if (!dragonArena1 || !dragonArena2) {
    adicionarLog("Selecione dois dragões para a batalha!");
    return;
  }

  adicionarLog("-- INÍCIO DA BATALHA! --");

  let vida1 = 100;
  let vida2 = 100;

  adicionarLog(`${dragonArena1.name} (A:${dragonArena1.attack} D:${dragonArena1.defense}) vs ${dragonArena2.name} (A:${dragonArena2.attack} D:${dragonArena2.defense})`);

  for (let i = 0; i < 5; i++) {
    if (vida1 <= 0 || vida2 <= 0) break;

    const dano1 = Math.max(0, dragonArena1.attack);
    const dano2 = Math.max(0, dragonArena2.attack);

    vida2 -= dano1;
    vida1 -= dano2;

    adicionarLog(`Rodada ${i + 1}:`);
    adicionarLog(`${dragonArena1.name} atacou ${dragonArena2.name} causando ${dano1} de dano. Vida ${dragonArena2.name}: ${Math.max(0, vida2)}`);
    adicionarLog(`${dragonArena2.name} atacou ${dragonArena1.name} causando ${dano2} de dano. Vida ${dragonArena1.name}: ${Math.max(0, vida1)}`);

    if (vida1 <= 0 || vida2 <= 0) {
      break; // Para imediatamente se algum morrer
    }
  }

  let vencedorSlot;
  if (vida1 > vida2) {
    adicionarLog(`🔥 ${dragonArena1.name} VENCEU A BATALHA! 🔥`);
    vencedorSlot = document.querySelector('#arena-1 .droppable-slot .card');
  } else if (vida2 > vida1) {
    adicionarLog(`🔥 ${dragonArena2.name} VENCEU A BATALHA! 🔥`);
    vencedorSlot = document.querySelector('#arena-2 .droppable-slot .card');
  } else {
    adicionarLog("A batalha terminou em EMPATE!");
  }

  if (vencedorSlot) {
    vencedorSlot.classList.add('vencedor'); // adiciona classe para animar
  }

  adicionarLog("--- FIM DA BATALHA! ---");
}




function resetar() {
  logDiv.innerHTML = "<p>Log limpo.</p>";

  // Remove os cards dos slots
  droppableAreas.forEach(slot => {
    slot.innerHTML = ""; // Limpa o conteúdo do slot
  });

  // Reseta as variáveis de dragão
  dragonArena1 = null;
  dragonArena2 = null;

  adicionarLog("Arenas resetadas. Arraste novos dragões!");
}


// Função para trocar entre abas
function openTab(evt, tabId) {
  // Esconde todas as abas
  var tabs = document.getElementsByClassName("tab-content");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }

  // Remove a classe 'active' de todos os botões
  var tablinks = document.getElementsByClassName("tablink");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Mostra a aba clicada
  document.getElementById(tabId).style.display = "block";
  evt.currentTarget.classList.add("active");
}

// Inicializa a primeira aba
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".tablink").click();
});