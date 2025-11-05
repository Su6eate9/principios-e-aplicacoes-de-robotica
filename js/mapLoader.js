class MapLoader {
  constructor() {
    this.defaultMaps = this.generateDefaultMaps();
  }

  generateDefaultMaps() {
    return {
      small: this.generateEmptyMap(10, 10, [
        [1, 1, 0],
        [1, 3, 0],
        [2, 2, 1],
        [2, 3, 1],
        [2, 4, 1],
        [3, 2, 1],
        [4, 2, 1],
        [5, 2, 1],
        [5, 3, 1],
        [5, 4, 1],
        [5, 5, 1],
        [6, 5, 1],
        [7, 5, 1],
        [7, 6, 1],
        [7, 7, 1],
      ]),
      medium: this.generateEmptyMap(20, 20, [
        [2, 5, 1],
        [3, 5, 1],
        [4, 5, 1],
        [5, 5, 1],
        [6, 5, 1],
        [7, 5, 1],
        [8, 5, 1],
        [9, 5, 1],
        [10, 5, 1],
        [5, 10, 1],
        [6, 10, 1],
        [7, 10, 1],
        [8, 10, 1],
        [9, 10, 1],
        [10, 10, 1],
        [11, 10, 1],
        [12, 10, 1],
        [13, 10, 1],
        [10, 2, 1],
        [10, 3, 1],
        [10, 4, 1],
        [10, 5, 1],
        [10, 6, 1],
        [10, 7, 1],
        [10, 8, 1],
        [10, 9, 1],
        [10, 10, 1],
        [15, 8, 1],
        [15, 9, 1],
        [15, 10, 1],
        [15, 11, 1],
        [15, 12, 1],
        [3, 15, 1],
        [4, 15, 1],
        [5, 15, 1],
        [6, 15, 1],
        [7, 15, 1],
      ]),
      large: this.generateEmptyMap(30, 30, [
        [5, 5, 1],
        [5, 6, 1],
        [5, 7, 1],
        [5, 8, 1],
        [5, 9, 1],
        [5, 10, 1],
        [5, 11, 1],
        [5, 12, 1],
        [5, 13, 1],
        [5, 14, 1],
        [10, 5, 1],
        [10, 6, 1],
        [10, 7, 1],
        [10, 8, 1],
        [10, 9, 1],
        [10, 15, 1],
        [10, 16, 1],
        [10, 17, 1],
        [10, 18, 1],
        [10, 19, 1],
        [15, 5, 1],
        [15, 6, 1],
        [15, 7, 1],
        [15, 8, 1],
        [15, 9, 1],
        [15, 10, 1],
        [15, 11, 1],
        [15, 12, 1],
        [15, 13, 1],
        [15, 14, 1],
        [20, 10, 1],
        [20, 11, 1],
        [20, 12, 1],
        [20, 13, 1],
        [20, 14, 1],
        [20, 15, 1],
        [20, 16, 1],
        [20, 17, 1],
        [20, 18, 1],
        [20, 19, 1],
        [25, 5, 1],
        [25, 6, 1],
        [25, 7, 1],
        [25, 8, 1],
        [25, 9, 1],
        [25, 10, 1],
        [25, 11, 1],
        [25, 12, 1],
        [25, 13, 1],
        [25, 14, 1],
        [3, 20, 1],
        [4, 20, 1],
        [5, 20, 1],
        [6, 20, 1],
        [7, 20, 1],
        [12, 20, 1],
        [13, 20, 1],
        [14, 20, 1],
        [15, 20, 1],
        [16, 20, 1],
        [22, 20, 1],
        [23, 20, 1],
        [24, 20, 1],
        [25, 20, 1],
        [26, 20, 1],
      ]),
    };
  }

  generateEmptyMap(rows, cols, obstacles = []) {
    const map = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0));

    for (const [row, col, value] of obstacles) {
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        map[row][col] = value;
      }
    }

    return map;
  }

  loadFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const map = this.parseMapContent(content);
          resolve(map);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Erro ao ler o arquivo"));
      };

      reader.readAsText(file);
    });
  }

  parseMapContent(content) {
    const lines = content
      .trim()
      .split("\n")
      .filter((line) => line.trim() !== "");

    if (lines.length === 0) {
      throw new Error("Arquivo vazio");
    }

    const map = [];
    let expectedCols = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      let row;

      if (line.includes(",")) {
        row = line.split(",").map((cell) => cell.trim());
      } else if (line.includes(" ")) {
        row = line.split(/\s+/);
      } else {
        row = line.split("");
      }

      row = row.map((cell) => {
        const num = parseInt(cell);
        if (isNaN(num) || (num !== 0 && num !== 1)) {
          throw new Error(
            `Valor inválido na linha ${
              i + 1
            }: "${cell}". Apenas 0 e 1 são permitidos.`
          );
        }
        return num;
      });

      if (expectedCols === null) {
        expectedCols = row.length;
      } else if (row.length !== expectedCols) {
        throw new Error(
          `Mapa não é retangular. Linha ${i + 1} tem ${
            row.length
          } colunas, esperado ${expectedCols}.`
        );
      }

      map.push(row);
    }

    if (map.length < 2 || map[0].length < 2) {
      throw new Error("Mapa muito pequeno. Mínimo 2×2.");
    }

    if (map.length > 200 || map[0].length > 200) {
      throw new Error("Mapa muito grande. Máximo 200×200.");
    }

    return map;
  }

  mapToText(map, useSeparator = true) {
    const separator = useSeparator ? "," : "";
    return map.map((row) => row.join(separator)).join("\n");
  }

  saveToFile(map, filename = "mapa.txt") {
    const content = this.mapToText(map, true);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  getDefaultMap(size) {
    const map = this.defaultMaps[size];
    if (!map) {
      throw new Error("Mapa padrão não encontrado");
    }
    return map.map((row) => [...row]);
  }

  validateMap(map) {
    if (!Array.isArray(map) || map.length === 0) {
      return { valid: false, message: "Mapa inválido" };
    }

    const cols = map[0].length;

    if (cols === 0) {
      return { valid: false, message: "Mapa vazio" };
    }

    for (let i = 0; i < map.length; i++) {
      if (!Array.isArray(map[i]) || map[i].length !== cols) {
        return { valid: false, message: "Mapa não é retangular" };
      }

      for (let j = 0; j < cols; j++) {
        const value = map[i][j];
        if (value !== 0 && value !== 1) {
          return {
            valid: false,
            message: `Valor inválido em (${i}, ${j}): ${value}`,
          };
        }
      }
    }

    return { valid: true };
  }

  generateRandomMap(rows, cols, obstaclePercentage = 0.3) {
    const map = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0));

    const totalCells = rows * cols;
    const obstacleCells = Math.floor(totalCells * obstaclePercentage);

    let placed = 0;
    while (placed < obstacleCells) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);

      if ((row === 0 && col === 0) || (row === rows - 1 && col === cols - 1)) {
        continue;
      }

      if (map[row][col] === 0) {
        map[row][col] = 1;
        placed++;
      }
    }

    return map;
  }
}
