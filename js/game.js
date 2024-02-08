class Game {
    constructor(board = document.body, {difficulty = 'med', paths = 1} = {}) {
        this.options = {difficulty, paths};
        this.gameGrid = new Grid(board);
        this.sequencesGrid = new Grid(document.querySelector('.sequences'));
        this.actionedElements = new Set();
        this.eventListeners = new Map();
        this.buffer = [];
        this.sequences = [];
        this.initGame();
    }

    initGame() {
        switch (this.options.difficulty) {
            case 'easy':
                // Implementar para dificultad fácil
                break;
            case 'med':
                this.setmediumGame();
                this.setMediumSequences();
                break;
            case 'hard':
                // Implementar para dificultad difícil
                break;
        }
    }

    setMediumSequences() {
        let rows = 3;
        let depth = [2, 3]
        this.initializeSequences(rows, depth);
        this.asignSequences();
        this.createSequencesGrid(rows, depth);

        this.updateSequencesGrid();

    }

    setmediumGame() {
        let gameGrid = this.createGameGrid({gridRows: 6, gridCols: 7});
        let direction = 'h';
        this.setLineToActionable(direction, gameGrid, 0, 0, true);
    }

    createGameGrid({gridCols, gridRows}) {
        this.gameGrid.createTable(gridCols, gridRows);
        this.gameGrid.draw();
        return this.gameGrid.elements;
    }

    setLineToActionable(direction, gameGrid, elementRowIndex, elementColIndex, firstRound = false) {

        const rowLength = gameGrid[elementRowIndex].length;
        const colLength = gameGrid.length;

        if (direction === 'v') {
            // Eliminar event listeners previos
            this.removeAllEventListeners(gameGrid.map(row => row[elementColIndex]));

            for (let i = 0; i < rowLength; i++) {
                const rowElement = gameGrid[elementRowIndex][i];
                if (!this.actionedElements.has(rowElement)) {
                    this.removeAllEventListeners([rowElement])
                    rowElement.classList.remove('actionable');
                }
            }

            for (let i = 0; i < colLength; i++) {
                const colElement = gameGrid[i][elementColIndex];
                if (!this.actionedElements.has(colElement)) {
                    colElement.classList.add('actionable');
                    const clickHandler = () => {
                        if (!this.actionedElements.has(colElement)) {
                            direction = this.toggleDirection(direction);
                            this.setLineToActionable(direction, gameGrid, i, elementColIndex);
                        }
                    };
                    this.eventListeners.set(colElement, clickHandler);
                    colElement.addEventListener('click', clickHandler);
                }
            }
        } else if (direction === 'h') {
            // Eliminar event listeners previos
            this.removeAllEventListeners(gameGrid[elementRowIndex]);

            for (let i = 0; i < colLength; i++) {
                const colElement = gameGrid[i][elementColIndex];
                if (!this.actionedElements.has(colElement)) {
                    this.removeAllEventListeners([colElement])
                    colElement.classList.remove('actionable');
                }
            }

            for (let i = 0; i < rowLength; i++) {
                const rowElement = gameGrid[elementRowIndex][i];
                if (!this.actionedElements.has(rowElement)) {
                    rowElement.classList.add('actionable');
                    const clickHandler = () => {
                        if (!this.actionedElements.has(rowElement)) {
                            direction = this.toggleDirection(direction);
                            this.setLineToActionable(direction, gameGrid, elementRowIndex, i);
                        }
                    };
                    this.eventListeners.set(rowElement, clickHandler);
                    rowElement.addEventListener('click', clickHandler);
                        
                }
            }
        }

        if (!firstRound && gameGrid[elementRowIndex][elementColIndex].classList.contains('actionable')) {
            this.setElementToActioned(gameGrid[elementRowIndex][elementColIndex]);
        }
    }

    setElementToActioned(actionedElement) {
        this.actionedElements.add(actionedElement);
        actionedElement.classList.remove('actionable');
        actionedElement.classList.add('actioned');

        let buffer = document.querySelector('.buffer');

        let bufferElement = document.createElement('div');
        bufferElement.classList.add('buffer-element');
        bufferElement.innerHTML = actionedElement.children[0].innerHTML;

        this.buffer.push(bufferElement.textContent);

        buffer.appendChild(bufferElement);

    }

    toggleDirection(direction) {
        return direction === 'h' ? 'v' : 'h';
    }

    removeAllEventListeners(elements) {
        elements.forEach(element => {
            const handler = this.eventListeners.get(element);
            if (handler) {
                element.removeEventListener('click', handler);
                this.eventListeners.delete(element);
            }
        });
    }

    initializeSequences(rows, depth) {
        for (let i = 0; i < rows; i++) {
            let asignedDepth = someNumberBetween(depth)
            this.sequences.push(new Array(asignedDepth).fill(0));
        }
    }
    
    asignSequences(){
        for (let i = 0; i < this.sequences.length; i++){
            for (let j = 0; j < this.sequences[i].length; j++){
                this.sequences[i][j] = this.gameGrid.elementValues[parseInt(Math.random() * this.gameGrid.elementValues.length)];
            }
        }
    }

    createSequencesGrid(rows, depth) {
        this.sequencesGrid.createTable(Math.max(depth[0], depth[1]), rows);
        this.updateSequencesGrid()
        this.sequencesGrid.draw();
    }

    updateSequencesGrid() {
        for (let i = 0; i < this.sequencesGrid.values.length; i++) {
            for (let j = 0; j < this.sequencesGrid.values[i].length; j++) {
                // Verificar si la fila y la columna existen en this.sequences
                if (this.sequences[i] !== undefined && this.sequences[i][j] !== undefined) {
                    this.sequencesGrid.values[i][j].innerHTML = this.sequences[i][j];
                } else {
                    this.sequencesGrid.values[i][j].innerHTML = '';
                }
            }
        }
    }

}
