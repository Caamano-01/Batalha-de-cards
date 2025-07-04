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

    // Remove a classe 'vencedor' se o card clonado a tiver
    clonedCard.classList.remove('vencedor'); //

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

  let vida1 = dragonArena1.defense;
  let vida2 = dragonArena2.defense;
  let rodada = 1;

  adicionarLog(`${dragonArena1.name} (A:${dragonArena1.attack} D:${dragonArena1.defense}) vs ${dragonArena2.name} (A:${dragonArena2.attack} D:${dragonArena2.defense})`);

  function turno() {
    if (rodada > 5 || vida1 <= 0 || vida2 <= 0) {
      finalizarBatalha();
      return;
    }

    adicionarLog(`🎯 Rodada ${rodada}:`);

    setTimeout(() => {
      vida2 -= dragonArena1.attack;
      adicionarLog(`${dragonArena1.name} atacou ${dragonArena2.name} causando ${dragonArena1.attack} de dano. Vida de ${dragonArena2.name}: ${Math.max(0, vida2)}`);

      if (vida2 <= 0) {
        finalizarBatalha();
        return;
      }

      setTimeout(() => {
        vida1 -= dragonArena2.attack;
        adicionarLog(`${dragonArena2.name} atacou ${dragonArena1.name} causando ${dragonArena2.attack} de dano. Vida de ${dragonArena1.name}: ${Math.max(0, vida1)}`);

        if (vida1 <= 0) {
          finalizarBatalha();
          return;
        }

        rodada++;
        turno(); // próxima rodada
      }, 1000); // tempo entre ataques
    }, 1000); // tempo antes do primeiro ataque
  }

  turno(); // inicia o primeiro turno

  function finalizarBatalha() {
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
      vencedorSlot.classList.add('vencedor');
    }

    adicionarLog("--- FIM DA BATALHA! ---");
  }
}





function resetar() {
  logDiv.innerHTML = "<p>Log limpo.</p>";

  // Remove os cards dos slots e a classe 'vencedor'
  droppableAreas.forEach(slot => {
    const cardInSlot = slot.querySelector(".card");
    if (cardInSlot) {
        cardInSlot.classList.remove('vencedor'); //
    }
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



let startY = null;

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      startY = e.touches[0].clientY;
    }
  });

  card.addEventListener('touchmove', e => {
    if (e.touches.length === 1 && startY !== null) {
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;

      // Se arrastar para cima (deltaY > 0), faz scroll para cima
      if (deltaY > 0) {
        window.scrollBy(0, -deltaY * 0.5); // ajuste 0.5 para mais ou menos sensibilidade
      }

      startY = currentY; // atualiza para o próximo movimento
    }
  });

  card.addEventListener('touchend', () => {
    startY = null;
  });
});