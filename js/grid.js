class Grid {
    constructor(board = document.body, elementValues = ["55", "BD", "1C", "E9", "FF"]) {
        this.board = board;
        this.parent = document.createElement('div');
        this.parent.className = 'grid';
        this.elements = [];
        this.elementValues = elementValues;
        this.values = [];
    }

    initializeElements(cols, rows) {
        let array = [];
        for (let i = 0; i < rows; i++) {
            array.push(new Array(cols).fill(0));
        }
        return array;
    }

    wipeOut() {
        this.elements.length = 0;
        this.parent.innerHTML = '';
    }

    insertElement(rowIndex, colIndex) {
        let newElement = document.createElement('div');
        newElement.className = 'grid-element';
        this.elements[rowIndex][colIndex] = newElement;
        this.parent.appendChild(newElement);
        let value = document.createElement('p');
        value.innerHTML = this.elementValues[parseInt(Math.random()* this.elementValues.length)]
        this.values[rowIndex][colIndex] = value;
        newElement.appendChild(value);
    }

    createTable(cols, rows) {
        this.parent.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        this.elements = this.initializeElements(cols, rows);
        this.values = this.initializeElements(cols, rows);
        
        for(let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.insertElement(i, j);
            }
        }
        
    }

    draw() {
        this.board.innerHTML = '';
        this.board.appendChild(this.parent);
    }

}