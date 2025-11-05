class UI {
  constructor(canvas, grid) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.grid = grid;

    this.cellSize = 20;
    this.lineWidth = 1;
    this.padding = 10;

    this.colors = {
      free: "#0d1117",
      occupied: "#30363d",
      start: "#1f6feb",
      goal: "#238636",
      path: "#58a6ff",
      open: "rgba(88, 166, 255, 0.2)",
      closed: "rgba(139, 148, 158, 0.2)",
      hover: "rgba(88, 166, 255, 0.1)",
      grid: "#21262d",
      border: "#30363d",
    };

    this.currentPath = [];
    this.openNodes = [];
    this.closedNodes = [];
    this.hoveredCell = null;

    this.setupCanvas();
  }

  setupCanvas() {
    this.calculateCellSize();

    const width = this.grid.cols * this.cellSize + this.padding * 2;
    const height = this.grid.rows * this.cellSize + this.padding * 2;

    // Define o tamanho do canvas
    this.canvas.width = width;
    this.canvas.height = height;

    // Define o tamanho CSS para manter a proporção
    const maxWidth = this.canvas.parentElement.clientWidth - 40;
    const maxHeight = this.canvas.parentElement.clientHeight - 40;

    const scale = Math.min(maxWidth / width, maxHeight / height, 1);

    this.canvas.style.width = width * scale + "px";
    this.canvas.style.height = height * scale + "px";
  }

  calculateCellSize() {
    const maxRows = this.grid.rows;
    const maxCols = this.grid.cols;
    const maxDimension = Math.max(maxRows, maxCols);

    if (maxDimension <= 15) {
      this.cellSize = 30;
    } else if (maxDimension <= 25) {
      this.cellSize = 20;
    } else if (maxDimension <= 50) {
      this.cellSize = 12;
    } else {
      this.cellSize = 8;
    }
  }

  canvasToGrid(x, y) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;

    const col = Math.floor((canvasX - this.padding) / this.cellSize);
    const row = Math.floor((canvasY - this.padding) / this.cellSize);

    if (row >= 0 && row < this.grid.rows && col >= 0 && col < this.grid.cols) {
      return { row, col };
    }

    return null;
  }

  drawCell(row, col, color, alpha = 1) {
    const x = this.padding + col * this.cellSize;
    const y = this.padding + row * this.cellSize;

    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = alpha;
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
    this.ctx.globalAlpha = 1;
  }

  drawGrid() {
    this.ctx.fillStyle = this.colors.grid;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        let color = this.colors.free;

        if (this.grid.isOccupied(row, col)) {
          color = this.colors.occupied;
        } else if (this.grid.isStart(row, col)) {
          color = this.colors.start;
        } else if (this.grid.isGoal(row, col)) {
          color = this.colors.goal;
        }

        this.drawCell(row, col, color);
      }
    }

    for (const node of this.openNodes) {
      if (
        !this.grid.isStart(node.row, node.col) &&
        !this.grid.isGoal(node.row, node.col)
      ) {
        this.drawCell(node.row, node.col, this.colors.open);
      }
    }

    for (const node of this.closedNodes) {
      if (
        !this.grid.isStart(node.row, node.col) &&
        !this.grid.isGoal(node.row, node.col)
      ) {
        this.drawCell(node.row, node.col, this.colors.closed);
      }
    }

    for (const [row, col] of this.currentPath) {
      if (!this.grid.isStart(row, col) && !this.grid.isGoal(row, col)) {
        this.drawCell(row, col, this.colors.path);

        // Desenha um círculo no centro da célula
        const x = this.padding + col * this.cellSize + this.cellSize / 2;
        const y = this.padding + row * this.cellSize + this.cellSize / 2;

        this.ctx.beginPath();
        this.ctx.arc(x, y, this.cellSize / 6, 0, Math.PI * 2);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fill();
      }
    }

    if (this.grid.start) {
      const [row, col] = this.grid.start;
      this.drawCell(row, col, this.colors.start);
      this.drawLabel(row, col, "S");
    }

    if (this.grid.goal) {
      const [row, col] = this.grid.goal;
      this.drawCell(row, col, this.colors.goal);
      this.drawLabel(row, col, "D");
    }

    if (this.hoveredCell) {
      const { row, col } = this.hoveredCell;
      this.drawCell(row, col, this.colors.hover);
    }

    this.drawGridLines();
  }

  drawGridLines() {
    this.ctx.strokeStyle = this.colors.border;
    this.ctx.lineWidth = this.lineWidth;

    for (let col = 0; col <= this.grid.cols; col++) {
      const x = this.padding + col * this.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.padding);
      this.ctx.lineTo(x, this.padding + this.grid.rows * this.cellSize);
      this.ctx.stroke();
    }

    for (let row = 0; row <= this.grid.rows; row++) {
      const y = this.padding + row * this.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(this.padding, y);
      this.ctx.lineTo(this.padding + this.grid.cols * this.cellSize, y);
      this.ctx.stroke();
    }
  }

  drawLabel(row, col, text) {
    const x = this.padding + col * this.cellSize + this.cellSize / 2;
    const y = this.padding + row * this.cellSize + this.cellSize / 2;

    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = `bold ${Math.max(12, this.cellSize / 2)}px sans-serif`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, x, y);
  }

  setPath(path) {
    this.currentPath = path;
    this.render();
  }

  setExplorationNodes(openList, closedList) {
    this.openNodes = openList || [];
    this.closedNodes = closedList || [];
    this.render();
  }

  clearPath() {
    this.currentPath = [];
    this.openNodes = [];
    this.closedNodes = [];
    this.render();
  }

  setHoveredCell(row, col) {
    this.hoveredCell = { row, col };
    this.render();
  }

  clearHoveredCell() {
    this.hoveredCell = null;
    this.render();
  }

  render() {
    this.drawGrid();
  }

  updateGrid(grid) {
    this.grid = grid;
    this.clearPath();
    this.setupCanvas();
    this.render();
  }

  resize() {
    this.setupCanvas();
    this.render();
  }
}

class NotificationManager {
  constructor() {
    this.notification = document.getElementById("notification");
    this.timeout = null;
  }

  show(message, type = "info", duration = 3000) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.notification.textContent = message;
    this.notification.className = `notification ${type}`;

    if (duration > 0) {
      this.timeout = setTimeout(() => {
        this.hide();
      }, duration);
    }
  }

  hide() {
    this.notification.className = "notification hidden";
  }

  success(message, duration = 3000) {
    this.show(message, "success", duration);
  }

  error(message, duration = 5000) {
    this.show(message, "error", duration);
  }

  warning(message, duration = 4000) {
    this.show(message, "warning", duration);
  }

  info(message, duration = 3000) {
    this.show(message, "info", duration);
  }
}
