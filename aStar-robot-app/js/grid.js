class Grid {
  constructor(rows = 10, cols = 10) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];
    this.start = null;
    this.goal = null;
    this.initialize();
  }

  initialize() {
    this.cells = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(0));
    this.start = null;
    this.goal = null;
  }

  isValid(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  isFree(row, col) {
    if (!this.isValid(row, col)) return false;
    return this.cells[row][col] === 0;
  }

  isOccupied(row, col) {
    if (!this.isValid(row, col)) return false;
    return this.cells[row][col] === 1;
  }

  setCell(row, col, value) {
    if (!this.isValid(row, col)) return false;
    this.cells[row][col] = value;
    return true;
  }

  getCell(row, col) {
    if (!this.isValid(row, col)) return null;
    return this.cells[row][col];
  }

  toggleCell(row, col) {
    if (!this.isValid(row, col)) return false;
    if (this.isStart(row, col) || this.isGoal(row, col)) return false;
    this.cells[row][col] = this.cells[row][col] === 0 ? 1 : 0;
    return true;
  }

  setStart(row, col) {
    if (!this.isValid(row, col)) return false;
    if (this.start) {
      const [oldRow, oldCol] = this.start;
      if (this.cells[oldRow][oldCol] !== 1) {
        this.cells[oldRow][oldCol] = 0;
      }
    }
    this.start = [row, col];
    return true;
  }

  setGoal(row, col) {
    if (!this.isValid(row, col)) return false;
    if (this.goal) {
      const [oldRow, oldCol] = this.goal;
      if (this.cells[oldRow][oldCol] !== 1) {
        this.cells[oldRow][oldCol] = 0;
      }
    }
    this.goal = [row, col];
    return true;
  }

  isStart(row, col) {
    if (!this.start) return false;
    return this.start[0] === row && this.start[1] === col;
  }

  isGoal(row, col) {
    if (!this.goal) return false;
    return this.goal[0] === row && this.goal[1] === col;
  }

  clear() {
    this.initialize();
  }

  clearObstacles() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!this.isStart(i, j) && !this.isGoal(i, j)) {
          this.cells[i][j] = 0;
        }
      }
    }
  }

  loadFromArray(array) {
    if (!array || !array.length || !array[0].length) {
      throw new Error("Array inválido");
    }
    this.rows = array.length;
    this.cols = array[0].length;
    for (let i = 0; i < this.rows; i++) {
      if (array[i].length !== this.cols) {
        throw new Error("Mapa não é retangular");
      }
    }
    this.cells = array.map((row) => [...row]);
    this.start = null;
    this.goal = null;
  }

  toArray() {
    return this.cells.map((row) => [...row]);
  }

  clone() {
    const newGrid = new Grid(this.rows, this.cols);
    newGrid.cells = this.cells.map((row) => [...row]);
    newGrid.start = this.start ? [...this.start] : null;
    newGrid.goal = this.goal ? [...this.goal] : null;
    return newGrid;
  }

  getNeighbors(row, col, allowDiagonal = false) {
    const neighbors = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    if (allowDiagonal) {
      directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (this.isValid(newRow, newCol) && this.isFree(newRow, newCol)) {
        neighbors.push([newRow, newCol]);
      }
    }
    return neighbors;
  }

  moveRobot(row, col) {
    if (!this.isValid(row, col)) {
      return { success: false, message: "Coordenada fora dos limites do mapa" };
    }
    if (this.isOccupied(row, col)) {
      return { success: false, message: "Célula ocupada - movimento não permitido" };
    }
    this.cells[row][col] = 1;
    return { success: true, message: `Robô movido para (${row}, ${col})` };
  }

  validateForPathfinding() {
    if (!this.start) {
      return { valid: false, message: "Ponto inicial não definido" };
    }
    if (!this.goal) {
      return { valid: false, message: "Ponto de destino não definido" };
    }
    const [startRow, startCol] = this.start;
    const [goalRow, goalCol] = this.goal;
    if (this.isOccupied(startRow, startCol)) {
      return { valid: false, message: "Ponto inicial está ocupado" };
    }
    if (this.isOccupied(goalRow, goalCol)) {
      return { valid: false, message: "Ponto de destino está ocupado" };
    }
    return { valid: true };
  }
}
