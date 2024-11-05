// Constants and configuration with enhanced meaning structures
const READING_POSITIONS = {
    3: [
      { 
        name: 'Pasado',
        description: 'Las influencias que te han traído hasta aquí',
        weight: 0.3,
        aspects: ['foundation', 'history', 'lessons']
      },
      { 
        name: 'Presente',
        description: 'La situación actual y sus energías',
        weight: 0.4,
        aspects: ['current', 'influences', 'energies']
      },
      { 
        name: 'Futuro',
        description: 'Las tendencias y posibles resultados',
        weight: 0.3,
        aspects: ['potential', 'outcome', 'guidance']
      }
    ],
    5: [
      {
        name: 'Centro',
        description: 'El núcleo de la situación',
        weight: 0.3,
        aspects: ['core', 'essence', 'truth']
      },
      {
        name: 'Arriba',
        description: 'Lo que te influencia',
        weight: 0.2,
        aspects: ['influences', 'spiritual', 'mental']
      },
      {
        name: 'Abajo',
        description: 'La base o fundamento',
        weight: 0.2,
        aspects: ['foundation', 'material', 'physical']
      },
      {
        name: 'Izquierda',
        description: 'El pasado reciente',
        weight: 0.15,
        aspects: ['past', 'cause', 'origin']
      },
      {
        name: 'Derecha',
        description: 'El futuro próximo',
        weight: 0.15,
        aspects: ['future', 'effect', 'destination']
      }
    ],
    7: [
      {
        name: 'Tú',
        description: 'Tu energía actual',
        weight: 0.2,
        aspects: ['self', 'energy', 'state']
      },
      {
        name: 'Desafío',
        description: 'Lo que enfrentas',
        weight: 0.15,
        aspects: ['challenge', 'obstacle', 'test']
      },
      {
        name: 'Corona',
        description: 'Tu meta o aspiración',
        weight: 0.15,
        aspects: ['goal', 'aspiration', 'ideal']
      },
      {
        name: 'Base',
        description: 'Tu fundamento',
        weight: 0.15,
        aspects: ['foundation', 'ground', 'support']
      },
      {
        name: 'Pasado',
        description: 'Lo que dejas atrás',
        weight: 0.1,
        aspects: ['past', 'release', 'learning']
      },
      {
        name: 'Futuro',
        description: 'Lo que viene',
        weight: 0.15,
        aspects: ['future', 'coming', 'potential']
      },
      {
        name: 'Resultado',
        description: 'El desenlace probable',
        weight: 0.1,
        aspects: ['outcome', 'resolution', 'conclusion']
      }
    ]
  };
  
  const DECK_CONFIG = {
    suits: {
      oros: {
        element: 'tierra',
        energy: 'material',
        domain: ['trabajo', 'dinero', 'salud', 'materialidad'],
        symbol: '🔆'
      },
      copas: {
        element: 'agua',
        energy: 'emocional',
        domain: ['amor', 'relaciones', 'intuición', 'creatividad'],
        symbol: '❤️'
      },
      espadas: {
        element: 'aire',
        energy: 'mental',
        domain: ['pensamientos', 'comunicación', 'conflictos', 'verdad'],
        symbol: '⚔️'
      },
      bastos: {
        element: 'fuego',
        energy: 'espiritual',
        domain: ['pasión', 'inspiración', 'acción', 'voluntad'],
        symbol: '🌳'
      }
    },
    numbers: {
      1: { type: 'beginning', influence: 1 },
      2: { type: 'duality', influence: 0.8 },
      3: { type: 'creation', influence: 0.9 },
      4: { type: 'stability', influence: 0.7 },
      5: { type: 'change', influence: 0.6 },
      6: { type: 'harmony', influence: 0.8 },
      7: { type: 'spirituality', influence: 0.7 },
      10: { type: 'completion', influence: 1 },
      11: { type: 'mastery', influence: 0.9 },
      12: { type: 'transition', influence: 0.8 }
    },
    courtCards: {
      10: 'Rey',
      11: 'Caballo',
      12: 'Sota'
    }
  };
  
  class CardEnergy {
    constructor(card, position) {
      this.card = card;
      this.position = position;
      this.suitEnergy = DECK_CONFIG.suits[card.suit];
      this.numberEnergy = DECK_CONFIG.numbers[card.number];
    }
  
    calculateEnergyScore() {
      const baseScore = this.numberEnergy.influence;
      const positionWeight = this.position.weight;
      
      // Calculate composite score based on multiple factors
      const score = {
        primary: baseScore * positionWeight,
        elemental: this._calculateElementalScore(),
        positional: this._calculatePositionalRelevance(),
        aspectual: this._calculateAspectualAlignment()
      };
  
      return {
        total: (score.primary + score.elemental + score.positional + score.aspectual) / 4,
        breakdown: score
      };
    }
  
    _calculateElementalScore() {
      const elementalAffinities = {
        tierra: { agua: 0.5, fuego: 0.3, aire: 0.7 },
        agua: { tierra: 0.5, fuego: 0.4, aire: 0.8 },
        fuego: { tierra: 0.3, agua: 0.4, aire: 0.9 },
        aire: { tierra: 0.7, agua: 0.8, fuego: 0.9 }
      };
  
      const element = this.suitEnergy.element;
      const affinities = elementalAffinities[element];
      return Object.values(affinities).reduce((sum, value) => sum + value, 0) / 3;
    }
  
    _calculatePositionalRelevance() {
      const aspectMatch = this.position.aspects.some(aspect => 
        this.suitEnergy.domain.includes(aspect)
      );
      return aspectMatch ? 0.8 : 0.5;
    }
  
    _calculateAspectualAlignment() {
      const timeBasedAspects = {
        past: [1, 2, 3],
        present: [4, 5, 6],
        future: [7, 10, 11, 12]
      };
  
      const matchesTimeAspect = this.position.aspects.some(aspect => {
        const timeCategory = Object.keys(timeBasedAspects).find(time => aspect.includes(time));
        return timeCategory && timeBasedAspects[timeCategory].includes(this.card.number);
      });
  
      return matchesTimeAspect ? 0.9 : 0.6;
    }
  }
  
  class PredictionEngine {
    constructor(cards, positions) {
      this.cards = cards;
      this.positions = positions;
      this.energyMatrix = this._createEnergyMatrix();
    }
  
    _createEnergyMatrix() {
      return this.cards.map((card, index) => 
        new CardEnergy(card, this.positions[index])
      );
    }
  
    generatePrediction() {
      const energyScores = this.energyMatrix.map(energy => energy.calculateEnergyScore());
      const overallEnergy = this._calculateOverallEnergy(energyScores);
      
      return {
        energyScores,
        overallEnergy,
        interpretation: this._interpretEnergies(energyScores, overallEnergy),
        advice: this._generateAdvice(energyScores, overallEnergy)
      };
    }
  
    _calculateOverallEnergy(energyScores) {
      const total = energyScores.reduce((sum, score) => sum + score.total, 0);
      const average = total / energyScores.length;
      
      return {
        intensity: average,
        harmony: this._calculateHarmony(energyScores),
        direction: this._determineDirection(energyScores),
        dominantSuit: this._findDominantSuit()
      };
    }
  
    _calculateHarmony(energyScores) {
      const variations = energyScores.map(score => 
        Math.abs(score.total - energyScores[0].total)
      );
      return 1 - (Math.max(...variations) / 2);
    }
  
    _determineDirection(energyScores) {
      const trend = energyScores.slice(-3).map(score => score.total);
      const direction = trend[2] - trend[0];
      return {
        trend: direction > 0 ? 'ascending' : direction < 0 ? 'descending' : 'stable',
        strength: Math.abs(direction)
      };
    }
  
    _findDominantSuit() {
      const suitCounts = this.cards.reduce((acc, card) => {
        acc[card.suit] = (acc[card.suit] || 0) + 1;
        return acc;
      }, {});
  
      return Object.entries(suitCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
    }
  
    _interpretEnergies(energyScores, overallEnergy) {
      const interpretations = [];
      
      // Analyze energy patterns
      if (overallEnergy.intensity > 0.7) {
        interpretations.push('Las energías son intensas y significativas');
      }
      
      if (overallEnergy.harmony > 0.8) {
        interpretations.push('Hay una gran armonía entre las diferentes influencias');
      }
      
      // Analyze directional trends
      const directionInterpretation = {
        ascending: 'Las energías están en ascenso, sugiriendo crecimiento y expansión',
        descending: 'Las energías están disminuyendo, sugiriendo introspección y consolidación',
        stable: 'Las energías están estables, sugiriendo equilibrio y continuidad'
      };
      
      interpretations.push(directionInterpretation[overallEnergy.direction.trend]);
      
      // Add suit-specific interpretation
      const dominantSuitEnergy = DECK_CONFIG.suits[overallEnergy.dominantSuit];
      interpretations.push(
        `La influencia dominante viene del elemento ${dominantSuitEnergy.element}, `
        + `sugiriendo un enfoque en aspectos ${dominantSuitEnergy.energy}es`
      );
      
      return interpretations;
    }
  
    _generateAdvice(energyScores, overallEnergy) {
      const advice = [];
      
      // Generate general advice based on energy patterns
      if (overallEnergy.intensity > 0.7) {
        advice.push('Es momento de tomar acción decisiva');
      } else {
        advice.push('Es tiempo de reflexión y planificación');
      }
      
      // Add element-specific advice
      const dominantSuitEnergy = DECK_CONFIG.suits[overallEnergy.dominantSuit];
      advice.push(
        `Enfócate en aspectos ${dominantSuitEnergy.energy}es para obtener mejores resultados`
      );
      
      // Add timing advice based on direction
      if (overallEnergy.direction.trend === 'ascending') {
        advice.push('Las próximas semanas son favorables para nuevos comienzos');
      } else if (overallEnergy.direction.trend === 'descending') {
        advice.push('Es buen momento para cerrar ciclos y consolidar logros');
      }
      
      return advice;
    }
  }
  
  class SpanishTarotDeck {
    constructor(meanings) {
      this.meanings = meanings;
      this.deck = this._createDeck();
      this.selectedCards = [];
      this.predictionEngine = null;
    }
  
    _createDeck() {
      return Object.keys(DECK_CONFIG.suits).flatMap(suit =>
        Object.keys(DECK_CONFIG.numbers).map(number => ({
          suit,
          number: parseInt(number),
          symbol: DECK_CONFIG.suits[suit].symbol,
          meaning: this.meanings[suit]?.[number] || this.meanings[suit]?.general,
          name: this._getCardName(parseInt(number))
        }))
      );
    }
  
    _getCardName(number) {
      return DECK_CONFIG.courtCards[number] || String(number);
    }
  
    drawCards(count) {
      this.selectedCards = this._shuffle([...this.deck]).slice(0, count);
      this.predictionEngine = new PredictionEngine(
        this.selectedCards,
        READING_POSITIONS[count]
      );
      return this.selectedCards;
    }
  
    _shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    getPrediction() {
      if (!this.predictionEngine) {
        throw new Error('No cards have been drawn yet');
      }
      return this.predictionEngine.generatePrediction();
    }
  
    getPositionInterpretation(index, total) {
      return READING_POSITIONS[total]?.[index] || {
        name: "Posición desconocida",
        description: "Sin interpretación específica",
        weight: 0.5,
        aspects: []
      };
    }
  }
  
  // Mantiene la misma interfaz TarotUI pero con predicciones mejoradas
  class TarotUI {
    constructor(tarotDeck, rootimg = false) {
      this.tarotDeck = tarotDeck;
      this.flippedCards = 0;
      this.rootimg = rootimg || false;
      this.predictions = null;
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
      const prediction = this.tarotDeck.getPrediction();
      const cards = this.tarotDeck.selectedCards;
  
      return `
        <h2 class="text-2xl font-bold mb-4">Interpretación Profunda de tu Lectura</h2>
        
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-bold text-lg mb-2">Análisis Energético</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold">Intensidad Energética</h4>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div class="bg-blue-600 h-2.5 rounded-full" 
                  style="width: ${Math.round(prediction.overallEnergy.intensity * 100)}%">
                </div>
              </div>
              <p class="text-sm mt-1">${Math.round(prediction.overallEnergy.intensity * 100)}%</p>
            </div>
            <div>
              <h4 class="font-semibold">Armonía</h4>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div class="bg-green-600 h-2.5 rounded-full" 
                  style="width: ${Math.round(prediction.overallEnergy.harmony * 100)}%">
                </div>
              </div>
              <p class="text-sm mt-1">${Math.round(prediction.overallEnergy.harmony * 100)}%</p>
            </div>
          </div>
  
          <div class="mt-4">
            <h4 class="font-semibold">Tendencia Energética</h4>
            <p class="text-sm mt-1">
              ${this._getTrendDescription(prediction.overallEnergy.direction)}
            </p>
          </div>
        </div>
  
        <div class="grid gap-4">
          ${cards.map((card, index) => this._generateEnhancedCardInterpretation(
            card, 
            index, 
            prediction.energyScores[index]
          )).join('')}
        </div>
  
        <div class="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h3 class="font-bold text-lg mb-2">Interpretación General</h3>
          ${prediction.interpretation.map(interp => `
            <p class="mb-2">${interp}</p>
          `).join('')}
        </div>
  
        <div class="mt-6 p-4 bg-purple-50 rounded-lg">
          <h3 class="font-bold text-lg mb-2">Consejos y Recomendaciones</h3>
          ${prediction.advice.map(advice => `
            <p class="mb-2">• ${advice}</p>
          `).join('')}
        </div>
  
        <div class="mt-6">
          ${this._generateElementalBalance(prediction)}
        </div>
  
        <button onclick="tarotUI.saveReading()" class="btn mt-4">
          Guardar Lectura
        </button>
      `;
    }
  
    _generateEnhancedCardInterpretation(card, index, energyScore) {
      const position = this.tarotDeck.getPositionInterpretation(index, this.tarotDeck.selectedCards.length);
      const suitEnergy = DECK_CONFIG.suits[card.suit];
  
      return `
        <div class="interpretation-card bg-white p-4 rounded-lg shadow">
          <div class="flex justify-between items-start">
            <h3 class="font-bold text-lg">${position.name}</h3>
            <span class="text-2xl">${card.symbol}</span>
          </div>
          
          <div class="mt-2">
            <p class="text-sm text-gray-600">${position.description}</p>
          </div>
  
          <div class="flex items-center gap-2 my-2">
            <span class="font-semibold">${card.suit.toUpperCase()} - ${card.name}</span>
          </div>
  
          <div class="mt-3">
            <h4 class="font-semibold text-sm">Energía de la Carta</h4>
            <div class="grid grid-cols-2 gap-2 mt-1">
              ${this._generateEnergyMetrics(energyScore)}
            </div>
          </div>
  
          <div class="mt-3">
            <h4 class="font-semibold text-sm">Aspectos Elementales</h4>
            <p class="text-sm mt-1">
              Elemento: ${suitEnergy.element} | 
              Dominio: ${suitEnergy.domain.join(', ')}
            </p>
          </div>
  
          <div class="mt-3">
            <p class="text-gray-700">${card.meaning}</p>
          </div>
        </div>
      `;
    }
  
    _generateEnergyMetrics(energyScore) {
      const metrics = [
        { label: 'Primaria', value: energyScore.breakdown.primary },
        { label: 'Elemental', value: energyScore.breakdown.elemental },
        { label: 'Posicional', value: energyScore.breakdown.positional },
        { label: 'Aspectual', value: energyScore.breakdown.aspectual }
      ];
  
      return metrics.map(metric => `
        <div>
          <span class="text-xs text-gray-600">${metric.label}</span>
          <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div class="bg-indigo-600 h-1.5 rounded-full" 
              style="width: ${Math.round(metric.value * 100)}%">
            </div>
          </div>
        </div>
      `).join('');
    }
  
    _generateElementalBalance(prediction) {
      const elements = Object.values(DECK_CONFIG.suits).map(suit => suit.element);
      const elementCounts = this.tarotDeck.selectedCards.reduce((acc, card) => {
        const element = DECK_CONFIG.suits[card.suit].element;
        acc[element] = (acc[element] || 0) + 1;
        return acc;
      }, {});
  
      return `
        <div class="p-4 bg-yellow-50 rounded-lg">
          <h3 class="font-bold text-lg mb-2">Balance Elemental</h3>
          <div class="grid grid-cols-4 gap-2">
            ${elements.map(element => `
              <div>
                <h4 class="text-sm font-semibold capitalize">${element}</h4>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div class="bg-yellow-600 h-2 rounded-full" 
                    style="width: ${Math.round((elementCounts[element] || 0) / this.tarotDeck.selectedCards.length * 100)}%">
                  </div>
                </div>
                <p class="text-xs mt-1">${elementCounts[element] || 0} cartas</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  
    _getTrendDescription(direction) {
      const descriptions = {
        ascending: 'Las energías están en ascenso, indicando un período de crecimiento y expansión',
        descending: 'Las energías están en descenso, sugiriendo un período de introspección y consolidación',
        stable: 'Las energías se mantienen estables, indicando un período de equilibrio y continuidad'
      };
  
      return `
        <div class="flex items-center gap-2">
          <span class="text-sm">${descriptions[direction.trend]}</span>
          <span class="text-xs text-gray-600">
            (Intensidad: ${Math.round(direction.strength * 100)}%)
          </span>
        </div>
      `;
    }
  
    saveReading() {
      const reading = {
        date: new Date().toLocaleDateString(),
        cards: this.tarotDeck.selectedCards,
        prediction: this.tarotDeck.getPrediction(),
        interpretation: document.getElementById('interpretation').innerHTML,
        timestamp: Date.now()
      };
  
      try {
        const savedReadings = JSON.parse(localStorage.getItem('readings') || '[]');
        savedReadings.push(reading);
        // Mantener solo las últimas 10 lecturas
        if (savedReadings.length > 10) {
          savedReadings.sort((a, b) => b.timestamp - a.timestamp);
          savedReadings.length = 10;
        }
        localStorage.setItem('readings', JSON.stringify(savedReadings));
        this._showSaveConfirmation();
      } catch (error) {
        console.error('Error al guardar la lectura:', error);
        this._showSaveError(error);
      }
    }
  
    _showSaveConfirmation() {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 opacity-0';
      toast.textContent = 'Lectura guardada con éxito';
      document.body.appendChild(toast);
  
      // Animate in
      setTimeout(() => toast.classList.add('opacity-100'), 100);
      
      // Animate out
      setTimeout(() => {
        toast.classList.remove('opacity-100');
        setTimeout(() => toast.remove(), 500);
      }, 3000);
    }
  
    _showSaveError(error) {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
      toast.textContent = `Error al guardar: ${error.message}`;
      document.body.appendChild(toast);
      
      setTimeout(() => toast.remove(), 3000);
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
  