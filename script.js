
"use strict";

/* =====================================================
   MEGA SIC BAC ANALYZER
   SISTEMA COMPLETO DAS DUAS INTELIGÊNCIAS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       CONFIGURAÇÕES
    ========================================= */

    const CONFIG = {
        standard: {
            duration: 11000,
            cooldown: 60000,
            resultDuration: 10000,

            messages: [
                "VERIFICANDO HISTÓRICO",
                "VERIFICANDO PADRÕES",
                "ANÁLISE FINALIZADA"
            ]
        },

        premium: {
            duration: 20000,
            cooldown: 240000,
            resultDuration: 15000,

            messages: [
                "VERIFICANDO HISTÓRICO DE RODADAS",
                "IDENTIFICANDO PADRÕES RECORRENTES",
                "PROCESSANDO DADOS ESTATÍSTICOS",
                "ANALISANDO SEQUÊNCIAS RECENTES",
                "AVALIANDO POSSÍVEIS TENDÊNCIAS",
                "CONSOLIDANDO DADOS DA ANÁLISE",
                "ANÁLISE FINALIZADA"
            ]
        }
    };


    /* =========================================
       ELEMENTOS
    ========================================= */

    const standardCard = document.querySelector(".standard-card");
    const premiumCard = document.querySelector(".premium-card");

    const standardButton = document.getElementById(
        "standardAnalyzeButton"
    );

    const premiumButton = document.getElementById(
        "premiumAnalyzeButton"
    );

    const platformInput = document.getElementById("platformUrl");
    const openPlatformButton = document.getElementById(
        "openPlatformButton"
    );

    const gameFrame = document.getElementById("gameFrame");
    const gameFrameWrap = document.getElementById("gameFrameWrap");


    /* =========================================
       VERIFICAÇÃO DOS ELEMENTOS
    ========================================= */

    if (
        !standardCard ||
        !premiumCard ||
        !standardButton ||
        !premiumButton
    ) {
        console.error(
            "MEGA SIC BAC: elementos das IAs não encontrados."
        );

        return;
    }


    /* =========================================
       ESTADO DAS DUAS IAs
    ========================================= */

    const states = {
        standard: {
            analyzing: false,
            cooldownUntil: 0,
            analysisTimeout: null,
            resultTimeout: null,
            timerInterval: null
        },

        premium: {
            analyzing: false,
            cooldownUntil: 0,
            analysisTimeout: null,
            resultTimeout: null,
            timerInterval: null
        }
    };


    /* =========================================
       UTILITÁRIOS
    ========================================= */

    function getElements(card) {

        return {
            messages: card.querySelector(".analysis-messages"),
            barrels: card.querySelector(".barrels-container"),
            footer: card.querySelector(".probability-footer"),
            cooldown: card.querySelector(".cooldown-info"),
            button: card.querySelector(".analyze-button")
        };

    }


    function formatTime(milliseconds) {

        const totalSeconds = Math.ceil(milliseconds / 1000);

        const minutes = Math.floor(totalSeconds / 60);

        const seconds = totalSeconds % 60;

        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0")
        );

    }


    /* =========================================
       GERADOR DE PORCENTAGENS
    ========================================= */

    function generateProbabilities() {

        // Empate sempre entre 0% e 3%.

        const tie = Math.floor(Math.random() * 4);

        // O restante será dividido entre jogador e banca.

        const remaining = 100 - tie;

        const player = Math.floor(
            Math.random() * (remaining + 1)
        );

        const banker = remaining - player;

        return {
            player,
            tie,
            banker
        };

    }


    /* =========================================
       INICIALIZAR BARRIS ZERADOS
    ========================================= */

    function resetBarrels(card) {

        const barrels = card.querySelectorAll(".barrel-item");

        barrels.forEach((item) => {

            const water = item.querySelector(".barrel-water");

            const percentage = item.querySelector(
                ".barrel-percentage"
            );

            if (water) {
                water.style.height = "0%";
            }

            if (percentage) {
                percentage.textContent = "0%";
            }

        });

        const total = card.querySelector(
            ".probability-footer strong"
        );

        if (total) {
            total.textContent = "0%";
        }

    }



    /* =========================================
       MOSTRAR PORCENTAGENS
    ========================================= */

    
function displayProbabilities(card, probabilities) {

    const items = card.querySelectorAll(".barrel-item");

    const values = [
        probabilities.player,
        probabilities.tie,
        probabilities.banker
    ];

    items.forEach((item, index) => {

        const water = item.querySelector(".barrel-water");

        const percentage = item.querySelector(
            ".barrel-percentage"
        );

        const value = values[index];

        water.style.height = value + "%";

        percentage.textContent = value + "%";

    });

    // Identificar a maior porcentagem.

    const names = [
        "AZUL",
        "EMPATE",
        "VERMELHO"
    ];

    const maxValue = Math.max(...values);

    const winnerIndex = values.indexOf(maxValue);

    const winnerName = names[winnerIndex];

    // Atualizar mensagem de resultado.

    const total = card.querySelector(
        ".probability-footer strong"
    );

    const label = card.querySelector(
        ".probability-footer span"
    );

    if (label) label.textContent = "MAIOR PROBABILIDADE";

if (total) {
    total.textContent = `PROBABILIDADE DE ${maxValue}% NO ${winnerName}`;

    total.style.color =
        winnerIndex === 0 ? "#2196f3" :
        winnerIndex === 1 ? "#ffd700" :
        "#ff3b3b";
}
}



    /* =========================================
       MENSAGENS DE ANÁLISE
    ========================================= */

    function showMessage(container, message, index) {

        const line = document.createElement("div");

        line.className = "message-line";

        const number = document.createElement("span");

        number.className = "message-icon";

        number.textContent = String(index + 1).padStart(2, "0");

        const text = document.createElement("span");

        text.textContent = message;

        line.appendChild(number);
        line.appendChild(text);

        container.appendChild(line);

    }


    function clearMessages(container) {

        container.replaceChildren();

    }


    /* =========================================
       ANIMAÇÃO PREMIUM
    ========================================= */

    function initializePremiumEffect() {

        if (document.getElementById("premiumDynamicStyles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "premiumDynamicStyles";

        style.textContent = `

            body.premium-analyzing::before {
                content: "";
                position: fixed;
                inset: 0;
                z-index: 50;
                pointer-events: none;

                background:
                    linear-gradient(
                        120deg,
                        transparent 30%,
                        rgba(105, 75, 255, 0.09) 50%,
                        transparent 70%
                    );

                background-size: 200% 100%;

                animation: premiumScan 2.5s linear infinite;
            }

            body.premium-analyzing .premium-card {
                border-color: rgba(161, 111, 255, 0.75);

                box-shadow:
                    0 0 25px rgba(142, 92, 255, 0.18),
                    0 0 70px rgba(37, 140, 255, 0.08);

                animation: premiumCardPulse 1.8s infinite;
            }

            body.premium-analyzing .premium-robot {
                filter: drop-shadow(
                    0 0 13px rgba(169, 118, 255, 0.9)
                );

                animation: premiumRobot 1s infinite alternate;
            }

            body.premium-analyzing .premium-card .heading-dot {
                animation: premiumDot 0.6s infinite alternate;
            }

            body.premium-analyzing .premium-card .barrel {
                box-shadow:
                    0 0 15px rgba(150, 110, 255, 0.18),
                    inset 0 0 15px rgba(0, 0, 0, 0.7);
            }

            @keyframes premiumScan {
                from {
                    background-position: 100% 0;
                }

                to {
                    background-position: -100% 0;
                }
            }

            @keyframes premiumCardPulse {
                0%, 100% {
                    box-shadow: 0 0 15px rgba(142, 92, 255, 0.12);
                }

                50% {
                    box-shadow: 0 0 35px rgba(142, 92, 255, 0.28);
                }
            }

            @keyframes premiumRobot {
                from {
                    transform: translateY(0);
                }

                to {
                    transform: translateY(-5px);
                }
            }

            @keyframes premiumDot {
                from {
                    opacity: 0.4;
                }

                to {
                    opacity: 1;
                    box-shadow: 0 0 15px #ae83ff;
                }
            }

        `;

        document.head.appendChild(style);

    }


    /* =========================================
       CONTROLE DO EFEITO PREMIUM
    ========================================= */

    function setPremiumEffect(active) {

        if (active) {

            initializePremiumEffect();

            document.body.classList.add(
                "premium-analyzing"
            );

        } else {

            document.body.classList.remove(
                "premium-analyzing"
            );

        }

    }


    /* =========================================
       ATUALIZAR CONTADOR
    ========================================= */

    function updateCooldown(type) {

        const state = states[type];

        const card = type === "standard"
            ? standardCard
            : premiumCard;

        const elements = getElements(card);

        const remaining = state.cooldownUntil - Date.now();

        if (remaining <= 0) {

            clearInterval(state.timerInterval);

            state.timerInterval = null;

            if (!state.analyzing) {

                elements.button.disabled = false;

                elements.cooldown.textContent =
                    "SISTEMA DISPONÍVEL";

            }

            return;

        }

        elements.button.disabled = true;

        elements.cooldown.textContent =
            "PRÓXIMA ANÁLISE EM: " +
            formatTime(remaining);

    }


    /* =========================================
       INICIAR INTERVALO DE ESPERA
    ========================================= */

    function startCooldown(type) {

        const state = states[type];

        const card = type === "standard"
            ? standardCard
            : premiumCard;

        const elements = getElements(card);

        const config = CONFIG[type];

        state.cooldownUntil = Date.now() + config.cooldown;

        elements.button.disabled = true;

        updateCooldown(type);

        if (state.timerInterval) {
            clearInterval(state.timerInterval);
        }

        state.timerInterval = setInterval(() => {

            updateCooldown(type);

        }, 250);

    }


    /* =========================================
       ESCONDER RESULTADOS
    ========================================= */

    function hideResults(type) {

        const card = type === "standard"
            ? standardCard
            : premiumCard;

        const elements = getElements(card);

        elements.barrels.style.display = "none";

        elements.footer.style.display = "none";

        resetBarrels(card);

    }


    /* =========================================
       MOSTRAR RESULTADOS
    ========================================= */

    function revealResults(type) {

        const card = type === "standard"
            ? standardCard
            : premiumCard;

        const elements = getElements(card);

        const probabilities = generateProbabilities();

        resetBarrels(card);

        elements.barrels.style.display = "grid";

        elements.footer.style.display = "flex";

        displayProbabilities(card, probabilities);

    }


    /* =========================================
       FINALIZAR ANÁLISE
    ========================================= */

    function finishAnalysis(type) {

        const state = states[type];

        const card = type === "standard"
            ? standardCard
            : premiumCard;

        const elements = getElements(card);

        const config = CONFIG[type];

        state.analyzing = false;

        if (type === "premium") {
            setPremiumEffect(false);
        }

        // Exibir resultado.

        revealResults(type);

        elements.button.innerHTML =
            '<span class="button-icon">✦</span> ANÁLISE CONCLUÍDA';

        // Os barris desaparecem após o tempo definido.

        state.resultTimeout = setTimeout(() => {

            hideResults(type);

            elements.button.innerHTML =
                type === "premium"
                    ? '<span class="button-icon">✦</span> INICIAR ANÁLISE PREMIUM'
                    : '<span class="button-icon">✦</span> ANALISAR ENTRADA';

        }, config.resultDuration);

        updateCooldown(type);

    }


    /* =========================================
       INICIAR ANÁLISE
    ========================================= */

    function startAnalysis(type) {

        const state = states[type];

        const card = type === "standard"
            ? standardCard
            : premiumCard;

        const elements = getElements(card);

        const config = CONFIG[type];

        // Impedir análises simultâneas da mesma IA.

        if (state.analyzing) {
            return;
        }

        // Impedir nova análise durante o intervalo.

        if (Date.now() < state.cooldownUntil) {
            updateCooldown(type);
            return;
        }

        // Limpar temporizadores anteriores.

        clearTimeout(state.analysisTimeout);

        clearTimeout(state.resultTimeout);

        clearInterval(state.timerInterval);

        // Iniciar estado.

        state.analyzing = true;

        // Limpar resultados anteriores.

        clearMessages(elements.messages);

        resetBarrels(card);

        hideResults(type);

        // Efeito especial premium.

        if (type === "premium") {
            setPremiumEffect(true);
        }

        // Botão bloqueado.

        elements.button.disabled = true;

        elements.button.innerHTML =
            '<span class="button-icon">◉</span> ANALISANDO...';

        elements.cooldown.textContent =
            "ANÁLISE EM PROCESSAMENTO";

        // Iniciar intervalo de espera imediatamente.

        startCooldown(type);


        /* =====================================
           EXIBIR MENSAGENS SEQUENCIALMENTE
        ===================================== */

        const messageInterval =
            config.duration / config.messages.length;

        config.messages.forEach((message, index) => {

            setTimeout(() => {

                if (!state.analyzing) {
                    return;
                }

                showMessage(
                    elements.messages,
                    message,
                    index
                );

            }, messageInterval * (index + 1));

        });


        /* =====================================
           FINALIZAR APÓS O TEMPO CONFIGURADO
        ===================================== */

        state.analysisTimeout = setTimeout(() => {

            finishAnalysis(type);

        }, config.duration);

    }


    /* =========================================
       EVENTOS DOS BOTÕES
    ========================================= */

    standardButton.addEventListener("click", () => {

        startAnalysis("standard");

    });


    premiumButton.addEventListener("click", () => {

        startAnalysis("premium");

    });


    /* =========================================
       INICIALIZAÇÃO DAS DUAS IAs
    ========================================= */

    resetBarrels(standardCard);

    resetBarrels(premiumCard);

    // Os barris começam visíveis e zerados.

    getElements(standardCard).barrels.style.display = "grid";

    getElements(standardCard).footer.style.display = "flex";

    getElements(premiumCard).barrels.style.display = "grid";

    getElements(premiumCard).footer.style.display = "flex";

    getElements(standardCard).cooldown.textContent =
        "SISTEMA DISPONÍVEL";

    getElements(premiumCard).cooldown.textContent =
        "SISTEMA DISPONÍVEL";


    /* =========================================
       ABRIR PLATAFORMA NO IFRAME
    ========================================= */

    if (
        platformInput &&
        openPlatformButton &&
        gameFrame &&
        gameFrameWrap
    ) {

        openPlatformButton.addEventListener("click", () => {

            let url = platformInput.value.trim();

            if (!url) {

                alert("Insira o endereço da plataforma.");

                platformInput.focus();

                return;

            }

            // Adicionar HTTPS caso o usuário não informe protocolo.

            if (!/^https?:\/\//i.test(url)) {

                url = "https://" + url;

            }

            // Validar endereço.

            let validUrl;

            try {

                validUrl = new URL(url);

            } catch (error) {

                alert("Endereço da plataforma inválido.");

                return;

            }

            if (
                validUrl.protocol !== "https:" &&
                validUrl.protocol !== "http:"
            ) {

                alert("Protocolo de endereço não permitido.");

                return;

            }

            // Abrir plataforma.

            gameFrame.src = validUrl.href;

            // Esconder botão de abertura.

            openPlatformButton.style.display = "none";

            // Esconder mensagem de conexão.

            const placeholder = gameFrameWrap.querySelector(
                ".frame-placeholder"
            );

            if (placeholder) {
                placeholder.style.display = "none";
            }

        });

    }


    /* =========================================
       FINALIZAÇÃO
    ========================================= */

    console.log(
        "MEGA SIC BAC ANALYZER inicializado com sucesso."
    );

});
