// simulation.model.ts
export interface Cell {
  isOnFire: boolean;
  isAsh: boolean; 
  isBurned?: boolean; 
}

export interface SimulationConfig {
  gridSize: {
    rows: number;
    cols: number;
  };
  initialFires: { row: number; col: number }[];
  propagationProbability: number;
}
