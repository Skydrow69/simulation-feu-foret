export interface SimulationConfig {
    gridSize: {
      rows: number;
      cols: number;
    };
    initialFires: { row: number; col: number }[];
    propagationProbability: number;
  }
  
  export interface Cell {
    isOnFire: boolean;
  }
  