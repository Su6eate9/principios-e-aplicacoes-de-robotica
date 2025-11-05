class Node {
  constructor(row, col, parent = null) {
    this.row = row;
    this.col = col;
    this.parent = parent;
    this.g = 0;
    this.h = 0;
    this.f = 0;
  }

  equals(other) {
    return this.row === other.row && this.col === other.col;
  }
}

class AStar {
  constructor(grid) {
    this.grid = grid;
    this.openList = [];
    this.closedList = [];
    this.path = [];
    this.visitedNodes = 0;
    this.allowDiagonal = false;
  }

  manhattanDistance(node, goal) {
    return Math.abs(node.row - goal.row) + Math.abs(node.col - goal.col);
  }

  euclideanDistance(node, goal) {
    const dx = node.row - goal.row;
    const dy = node.col - goal.col;
    return Math.sqrt(dx * dx + dy * dy);
  }

  chebyshevDistance(node, goal) {
    return Math.max(
      Math.abs(node.row - goal.row),
      Math.abs(node.col - goal.col)
    );
  }

  heuristic(node, goal) {
    if (this.allowDiagonal) {
      return this.euclideanDistance(node, goal);
    }
    return this.manhattanDistance(node, goal);
  }

  isInList(node, list) {
    return list.some((n) => n.equals(node));
  }

  findInList(node, list) {
    return list.find((n) => n.equals(node));
  }

  getLowestFNode() {
    let lowest = this.openList[0];
    for (let i = 1; i < this.openList.length; i++) {
      if (this.openList[i].f < lowest.f) {
        lowest = this.openList[i];
      }
    }
    return lowest;
  }

  removeFromOpenList(node) {
    const index = this.openList.findIndex((n) => n.equals(node));
    if (index !== -1) {
      this.openList.splice(index, 1);
    }
  }

  reconstructPath(currentNode) {
    const path = [];
    let current = currentNode;

    while (current !== null) {
      path.unshift([current.row, current.col]);
      current = current.parent;
    }

    return path;
  }

  movementCost(from, to) {
    const dx = Math.abs(from.row - to.row);
    const dy = Math.abs(from.col - to.col);

    if (dx === 1 && dy === 1) {
      return Math.SQRT2;
    }
    return 1;
  }

  findPath(allowDiagonal = false) {
    this.allowDiagonal = allowDiagonal;

    const validation = this.grid.validateForPathfinding();
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message,
        path: [],
        cost: 0,
        visitedNodes: 0,
      };
    }

    this.openList = [];
    this.closedList = [];
    this.visitedNodes = 0;

    const [startRow, startCol] = this.grid.start;
    const [goalRow, goalCol] = this.grid.goal;

    const startNode = new Node(startRow, startCol);
    const goalNode = new Node(goalRow, goalCol);

    startNode.g = 0;
    startNode.h = this.heuristic(startNode, goalNode);
    startNode.f = startNode.g + startNode.h;

    this.openList.push(startNode);

    while (this.openList.length > 0) {
      const currentNode = this.getLowestFNode();
      this.visitedNodes++;

      if (currentNode.equals(goalNode)) {
        const path = this.reconstructPath(currentNode);
        return {
          success: true,
          message: "Caminho encontrado com sucesso",
          path: path,
          cost: currentNode.g,
          visitedNodes: this.visitedNodes,
          openList: [...this.openList],
          closedList: [...this.closedList],
        };
      }

      this.removeFromOpenList(currentNode);
      this.closedList.push(currentNode);

      const neighbors = this.grid.getNeighbors(
        currentNode.row,
        currentNode.col,
        allowDiagonal
      );

      for (const [neighborRow, neighborCol] of neighbors) {
        const neighborNode = new Node(neighborRow, neighborCol, currentNode);

        if (this.isInList(neighborNode, this.closedList)) {
          continue;
        }

        const tentativeG =
          currentNode.g + this.movementCost(currentNode, neighborNode);

        const existingNode = this.findInList(neighborNode, this.openList);

        if (existingNode) {
          if (tentativeG < existingNode.g) {
            existingNode.g = tentativeG;
            existingNode.f = existingNode.g + existingNode.h;
            existingNode.parent = currentNode;
          }
        } else {
          neighborNode.g = tentativeG;
          neighborNode.h = this.heuristic(neighborNode, goalNode);
          neighborNode.f = neighborNode.g + neighborNode.h;
          this.openList.push(neighborNode);
        }
      }
    }

    return {
      success: false,
      message: "Caminho impossível - não há rota disponível",
      path: [],
      cost: 0,
      visitedNodes: this.visitedNodes,
      openList: [...this.openList],
      closedList: [...this.closedList],
    };
  }

  *findPathStepByStep(allowDiagonal = false) {
    this.allowDiagonal = allowDiagonal;

    const validation = this.grid.validateForPathfinding();
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message,
      };
    }

    this.openList = [];
    this.closedList = [];
    this.visitedNodes = 0;

    const [startRow, startCol] = this.grid.start;
    const [goalRow, goalCol] = this.grid.goal;

    const startNode = new Node(startRow, startCol);
    const goalNode = new Node(goalRow, goalCol);

    startNode.g = 0;
    startNode.h = this.heuristic(startNode, goalNode);
    startNode.f = startNode.g + startNode.h;

    this.openList.push(startNode);

    while (this.openList.length > 0) {
      const currentNode = this.getLowestFNode();
      this.visitedNodes++;

      yield {
        type: "step",
        currentNode: { row: currentNode.row, col: currentNode.col },
        openList: this.openList.map((n) => ({ row: n.row, col: n.col })),
        closedList: this.closedList.map((n) => ({ row: n.row, col: n.col })),
        visitedNodes: this.visitedNodes,
      };

      if (currentNode.equals(goalNode)) {
        const path = this.reconstructPath(currentNode);
        yield {
          type: "complete",
          success: true,
          message: "Caminho encontrado com sucesso",
          path: path,
          cost: currentNode.g,
          visitedNodes: this.visitedNodes,
        };
        return;
      }

      this.removeFromOpenList(currentNode);
      this.closedList.push(currentNode);

      const neighbors = this.grid.getNeighbors(
        currentNode.row,
        currentNode.col,
        allowDiagonal
      );

      for (const [neighborRow, neighborCol] of neighbors) {
        const neighborNode = new Node(neighborRow, neighborCol, currentNode);

        if (this.isInList(neighborNode, this.closedList)) {
          continue;
        }

        const tentativeG =
          currentNode.g + this.movementCost(currentNode, neighborNode);
        const existingNode = this.findInList(neighborNode, this.openList);

        if (existingNode) {
          if (tentativeG < existingNode.g) {
            existingNode.g = tentativeG;
            existingNode.f = existingNode.g + existingNode.h;
            existingNode.parent = currentNode;
          }
        } else {
          neighborNode.g = tentativeG;
          neighborNode.h = this.heuristic(neighborNode, goalNode);
          neighborNode.f = neighborNode.g + neighborNode.h;
          this.openList.push(neighborNode);
        }
      }
    }

    yield {
      type: "complete",
      success: false,
      message: "Caminho impossível - não há rota disponível",
      path: [],
      cost: 0,
      visitedNodes: this.visitedNodes,
    };
  }
}
