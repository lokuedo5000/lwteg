// Constantes y configuración
const READING_POSITIONS = {
  3: [
    { name: 'Pasado', description: 'Las influencias que te han traído hasta aquí' },
    { name: 'Presente', description: 'La situación actual y sus energías' },
    { name: 'Futuro', description: 'Las tendencias y posibles resultados' }
  ],
  5: [
    { name: 'Centro', description: 'El núcleo de la situación' },
    { name: 'Arriba', description: 'Lo que te influencia' },
    { name: 'Abajo', description: 'La base o fundamento' },
    { name: 'Izquierda', description: 'El pasado reciente' },
    { name: 'Derecha', description: 'El futuro próximo' }
  ],
  7: [
    { name: 'Tú', description: 'Tu energía actual' },
    { name: 'Desafío', description: 'Lo que enfrentas' },
    { name: 'Corona', description: 'Tu meta o aspiración' },
    { name: 'Base', description: 'Tu fundamento' },
    { name: 'Pasado', description: 'Lo que dejas atrás' },
    { name: 'Futuro', description: 'Lo que viene' },
    { name: 'Resultado', description: 'El desenlace probable' }
  ]
};

const DECK_CONFIG = {
  suits: ['oros', 'copas', 'espadas', 'bastos'],
  numbers: [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
  symbols: {
    oros: '🔆',
    copas: '❤️',
    espadas: '⚔️',
    bastos: '🌳'
  },
  courtCards: {
    10: 'Rey',
    11: 'Caballo',
    12: 'Sota'
  }
};

// Clase principal para el manejo del mazo
class SpanishTarotDeck {
  constructor(meanings) {
    this.meanings = meanings;
    this.deck = this._createDeck();
    this.selectedCards = [];
  }

  _createDeck() {
    const suits = ["oros", "copas", "espadas", "bastos"];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
    const symbols = {
      oros: "🔆",
      copas: "❤️",
      espadas: "⚔️",
      bastos: "🌳",
    };

    return suits.flatMap((suit) =>
      numbers.map((number) => ({
        suit,
        number,
        symbol: symbols[suit],
        meaning: this.meanings[suit]?.[number] || this.meanings[suit]?.general,
        name: this._getCardName(number),
      }))
    );
  }

  _getCardName(number) {
    const courtCards = {
      10: "Rey",
      11: "Caballo",
      12: "Sota",
    };
    return courtCards[number] || String(number);
  }

  _shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  drawCards(count) {
    this.selectedCards = this._shuffle([...this.deck]).slice(0, count);
    return this.selectedCards;
  }

  getPositionInterpretation(index, total) {
    return (
      READING_POSITIONS[total]?.[index] || {
        name: "Posición desconocida",
        description: "Sin interpretación específica",
      }
    );
  }
}

// Clase para el manejo de la interfaz de usuario
class TarotUI {
  constructor(tarotDeck, rootimg = false) {
    this.tarotDeck = tarotDeck;
    this.flippedCards = 0;
    this.rootimg = rootimg || false;
    this.bindEvents();
  }

  bindEvents() {
    // Asegurarse de que esto se ejecute después de que el DOM esté listo
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initializeUI());
    } else {
      this.initializeUI();
    }
  }

  initializeUI() {
    console.log("Inicializando UI del Tarot");
    this.initializeButtons();
    this.setupEventListeners();
  }

  initializeButtons() {
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((btn) => {
      this.addButtonAnimation(btn);
    });
  }

  addButtonAnimation(button) {
    button.addEventListener("mouseover", () => {
      anime({
        targets: button,
        scale: 1.05,
        duration: 200,
        easing: "easeOutQuad",
      });
    });

    button.addEventListener("mouseout", () => {
      anime({
        targets: button,
        scale: 1,
        duration: 200,
        easing: "easeOutQuad",
      });
    });
  }

  setupEventListeners() {
    const startButton = document.getElementById("startReading");
    const beginButton = document.getElementById("beginReading");
    const readingType = document.getElementById("readingType");

    if (startButton) {
      startButton.addEventListener("click", () => {
        console.log("Botón Start Reading clickeado");
        if (readingType) {
          readingType.classList.remove("hidden");
        }
      });
    }

    if (beginButton) {
      beginButton.addEventListener("click", () => {
        const select = document.getElementById("readingSelect");
        if (select) {
          const count = parseInt(select.value);
          console.log("Iniciando lectura con", count, "cartas");
          this.startReading(count);
        }
      });
    }
  }

  startReading(cardCount) {
    console.log("Comenzando lectura");
    const cards = this.tarotDeck.drawCards(cardCount);
    this.flippedCards = 0;
    this.renderCards(cards, cardCount);
  }

  renderCards(cards, total) {
    const container = document.getElementById("cardsContainer");
    if (!container) {
      console.error("No se encontró el contenedor de cartas");
      return;
    }

    container.innerHTML = "";
    container.classList.remove("hidden");

    const interpretationDiv = document.getElementById("interpretation");
    if (interpretationDiv) {
      interpretationDiv.classList.add("hidden");
    }

    cards.forEach((card, index) => {
      const cardElement = this.createCardElement(card, index, total);
      container.appendChild(cardElement);
      this.animateCardEntry(cardElement, index);
    });
  }

  createCardElement(card, index, total) {
    const div = document.createElement('div');
    div.className = 'card';
    
    const cardName = card.number === 1 ? 'as' : card.name.toLowerCase();
    const position = this.tarotDeck.getPositionInterpretation(index, total);

    div.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
          <div class="card-title"></div>
          <div class="card-symbol" style="background-image: url(${this.rootimg}${card.suit}/${cardName}.jpg);"></div>
          <div class="card-meaning">
            <strong>${position.name} - ${position.description}</strong><br>
            ${card.meaning}
          </div>
        </div>
      </div>
    `;

    div.addEventListener('click', () => this.flipCard(div, card, index, total));
    return div;
  }

  animateCardEntry(element, index) {
    anime({
      targets: element,
      scale: [0, 1],
      opacity: [0, 1],
      duration: 1000,
      delay: index * 200,
      easing: 'easeOutElastic(1, .8)'
    });
  }

  flipCard(element, card, index, total) {
    if (element.classList.contains('flipped')) return;

    element.classList.add('flipped');
    this.flippedCards++;

    anime({
      targets: element.querySelector('.card-inner'),
      rotateY: 180,
      duration: 800,
      easing: 'easeInOutQuad'
    });

    if (this.flippedCards === total) {
      setTimeout(() => this.showCompleteInterpretation(), 1000);
    }
  }

  showCompleteInterpretation() {
    const interpretationElement = document.getElementById('interpretation');
    if (!interpretationElement) return;

    const interpretation = this.generateInterpretation();
    interpretationElement.innerHTML = interpretation;
    interpretationElement.classList.remove('hidden');

    anime({
      targets: interpretationElement,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: 'easeOutQuad'
    });
  }

  generateInterpretation() {
    const cards = this.tarotDeck.selectedCards;
    const generalAdvice = this.generateGeneralAdvice(cards);

    return `
      <h2 class="text-2xl font-bold mb-4">Interpretación Completa de tu Lectura</h2>
      <div class="grid gap-4">
        ${cards.map((card, index) => this.generateCardInterpretation(card, index)).join('')}
      </div>
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 class="font-bold text-lg mb-2">Consejo General</h3>
        <p>${generalAdvice}</p>
      </div>
      <button onclick="tarotUI.saveReading()" class="btn mt-4">
        Guardar Lectura
      </button>
    `;
  }

  generateCardInterpretation(card, index) {
    const position = this.tarotDeck.getPositionInterpretation(index, this.tarotDeck.selectedCards.length);
    const advice = this.generateAdvice(card);

    return `
      <div class="interpretation-card bg-white p-4 rounded-lg shadow">
        <h3 class="font-bold text-lg">${position.name} - ${position.description}</h3>
        <div class="flex items-center gap-2 my-2">
          <span class="text-2xl">${card.symbol}</span>
          <span class="font-semibold">${card.suit.toUpperCase()} - ${card.name}</span>
        </div>
        <p class="text-gray-700">${card.meaning}</p>
        <p class="mt-2 text-gray-600">${advice}</p>
      </div>
    `;
  }

  generateAdvice(card) {
    const adviceTypes = {
      oros: {
        positive: 'Es un buen momento para inversiones y proyectos materiales.',
        neutral: 'Mantén el equilibrio en tus finanzas y recursos.',
        negative: 'Sé prudente con tus recursos y evita gastos innecesarios.'
      },
      copas: {
        positive: 'Abre tu corazón a nuevas posibilidades emocionales.',
        neutral: 'Mantén el equilibrio entre razón y emoción.',
        negative: 'Dale tiempo al corazón para sanar y renovarse.'
      },
      espadas: {
        positive: 'Es momento de tomar decisiones firmes y actuar.',
        neutral: 'Analiza la situación desde diferentes perspectivas.',
        negative: 'No dejes que los conflictos nublen tu juicio.'
      },
      bastos: {
        positive: 'Aprovecha tu energía creativa y emprendedora.',
        neutral: 'Mantén el equilibrio entre acción y planificación.',
        negative: 'No dejes que el estrés afecte tus proyectos.'
      }
    };

    let type = 'neutral';
    if (card.number <= 4 || card.number === 10) type = 'positive';
    if ([7, 11, 12].includes(card.number)) type = 'negative';

    return adviceTypes[card.suit][type];
  }

  generateGeneralAdvice(cards) {
    const suitCounts = cards.reduce((acc, card) => {
      acc[card.suit] = (acc[card.suit] || 0) + 1;
      return acc;
    }, {});

    const dominantSuit = Object.entries(suitCounts)
      .sort((a, b) => b[1] - a[1])[0][0];

    const averageNumber = cards.reduce((sum, card) => sum + card.number, 0) / cards.length;

    const suitMessages = {
      oros: 'el enfoque principal está en aspectos materiales y financieros.',
      copas: 'las emociones y relaciones son el tema central.',
      espadas: 'hay importantes decisiones o conflictos que requieren tu atención.',
      bastos: 'el trabajo y la creatividad son áreas clave.'
    };

    let advice = `Basado en tu lectura, ${suitMessages[dominantSuit]} `;

    if (averageNumber < 5) {
      advice += 'Las cartas sugieren nuevos comienzos y oportunidades favorables.';
    } else if (averageNumber < 8) {
      advice += 'Estás en un período de desarrollo y crecimiento.';
    } else {
      advice += 'Es importante cerrar ciclos y prepararte para cambios.';
    }

    return advice;
  }

  saveReading() {
    const reading = {
      date: new Date().toLocaleDateString(),
      cards: this.tarotDeck.selectedCards,
      interpretation: document.getElementById('interpretation').innerHTML
    };

    try {
      const savedReadings = JSON.parse(localStorage.getItem('readings') || '[]');
      savedReadings.push(reading);
      localStorage.setItem('readings', JSON.stringify(savedReadings));
      alert('Lectura guardada con éxito');
    } catch (error) {
      console.error('Error al guardar la lectura:', error);
      alert('Error al guardar la lectura');
    }
  }
}

// Inicialización
const initTarotApp = (meanings, rootimg = false) => {
  console.log("Iniciando aplicación de Tarot");
  try {
    const tarotDeck = new SpanishTarotDeck(meanings);
    const tarotUI = new TarotUI(tarotDeck, rootimg);
    window.tarotUI = tarotUI; // Para acceso global
    console.log("Aplicación de Tarot iniciada correctamente");
  } catch (error) {
    console.error("Error al inicializar la aplicación de Tarot:", error);
  }
};
