class Game {
    constructor(board = document.body, {difficulty = 'med', paths = 1} = {}) {
        this.options = {difficulty, paths};
        this.grid = new Grid(board);
        this.actionedElements = new Set(); // Usamos un conjunto para almacenar los elementos actioned para una búsqueda más eficiente
        this.eventListeners = new Map(); // Usamos un Map para almacenar los event listeners asociados a cada elemento
        this.buffer = [];
    }

    init() {
        switch (this.options.difficulty) {
            case 'easy':
                // Implementar para dificultad fácil
                break;
            case 'med':
                this.mediumGame();
                break;
            case 'hard':
                // Implementar para dificultad difícil
                break;
        }
    }

    createGrid({gridCols, gridRows}) {
        this.grid.createTable(gridCols, gridRows);
        this.grid.draw();
        return this.grid.elements;
    }

    mediumGame() {
        let gameGrid = this.createGrid({gridRows: 6, gridCols: 7});
        let direction = 'h';
        this.setLineToActionable(direction, gameGrid, 0, 0, true);
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
}
