
"use strict";

const $ = (selector) => document.querySelector(selector);

const heartsContainer = $("#hearts");
const surpriseButton = $("#openSurprise");
const letterButton = $("#openLetter");
const letter = $("#letter");
const moreLoveButton = $("#moreLove");
const toast = $("#toast");

let toastTimeout;
let heartCount = 0;

// Exibe uma mensagem temporária na tela.
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Cria um coração flutuante.
function createHeart(options = {}) {
  if (heartCount >= 35) return;

  const heart = document.createElement("span");

  heart.className = "floating-heart";
  heart.textContent = Math.random() > 0.25 ? "♥" : "♡";

  const size = options.size ?? (12 + Math.random() * 19);
  const duration = options.duration ?? (5 + Math.random() * 5);

  heart.style.left = `${Math.random() * 96}%`;
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${duration}s`;

  heartsContainer.appendChild(heart);
  heartCount++;

  heart.addEventListener("animationend", () => {
    heart.remove();
    heartCount--;
  }, { once: true });
}

// Corações surgem suavemente ao longo da página.
const heartInterval = setInterval(() => {
  createHeart();
}, 950);

// Libera mais corações quando a surpresa é aberta.
surpriseButton.addEventListener("click", () => {
  $("#surprise").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      createHeart({
        size: 15 + Math.random() * 22,
        duration: 4 + Math.random() * 3
      });
    }, i * 100);
  }

  showToast("Preparei cada detalhe pensando em você ♥");
});

// Abre e fecha a cartinha.
letterButton.addEventListener("click", () => {
  const isHidden = letter.hidden;

  letter.hidden = !isHidden;

  if (isHidden) {
    letterButton.innerHTML = "<span>💗</span> Fechar minha cartinha";

    setTimeout(() => {
      letter.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 100);

    showToast("Estas palavras são para você. ❤️");
  } else {
    letterButton.innerHTML = "<span>💌</span> Abrir minha cartinha";
  }
});

// Botão para criar uma chuva especial de corações.
moreLoveButton.addEventListener("click", () => {
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      createHeart({
        size: 16 + Math.random() * 25,
        duration: 3 + Math.random() * 3
      });
    }, i * 90);
  }

  showToast("Um coração nunca é suficiente para você! ♥");
});

// Revela os cartões quando entram na área visível.
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
}

// Evita manter o gerador ativo caso a página seja encerrada.
window.addEventListener("pagehide", () => {
  clearInterval(heartInterval);
});
