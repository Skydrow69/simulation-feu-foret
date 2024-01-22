import { BehaviorSubject } from "rxjs";
import { Cell, SimulationConfig } from "../model/simulation.model";
import { ChangeDetectorRef, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root', 
})



export class SimulationService {
  private simulationConfig!: SimulationConfig;
  private grid!: Cell[][];
  private isSimulationRunningSubject = new BehaviorSubject<boolean>(false);
  isSimulationRunning$ = this.isSimulationRunningSubject.asObservable();
  private simulationInterval: NodeJS.Timeout | null = null; 

  initializeSimulation(config: SimulationConfig): void {
    this.simulationConfig = config;
    this.initializeGrid();
  }
  

  getSimulationInterval(): NodeJS.Timeout | null {
    return this.simulationInterval;
  }

startSimulation(): void {
  if (!this.isSimulationRunningSubject.getValue()) {
    this.isSimulationRunningSubject.next(true);

    this.simulationInterval = setInterval(() => {
      this.propagateFire();
    }, 1000); 
  }
}


 stopSimulation(): void {
  if (this.simulationInterval) {
    clearInterval(this.simulationInterval);
    this.simulationInterval = null;
    this.isSimulationRunningSubject.next(false);
  }
}

  getGrid(): Cell[][] {
    return this.grid;
  }

  private initializeGrid(): void {
    this.grid = Array.from({ length: this.simulationConfig.gridSize.rows }, () =>
      Array(this.simulationConfig.gridSize.cols).fill({ isOnFire: false })
    );
  }

lightInitialFires(): void {
  console.log('Lighting initial fires:', this.simulationConfig.initialFires);
  this.simulationConfig.initialFires.forEach(fire => {
    this.grid[fire.row][fire.col].isOnFire = true;
  });
  console.log('Grid after lighting fires:', this.grid);
}

  
private propagateFire(): void {
  const newGrid: Cell[][] = [];

  for (let i = 0; i < this.simulationConfig.gridSize.rows; i++) {
    newGrid[i] = [];

    for (let j = 0; j < this.simulationConfig.gridSize.cols; j++) {
      const cell = { ...this.grid[i][j] };

      if (this.grid[i][j].isOnFire) {
        cell.isOnFire = false;

        console.log(`Cell [${i}, ${j}] is on fire, propagating to neighbors...`);
        this.propagateToNeighbor(i - 1, j, cell);
        this.propagateToNeighbor(i + 1, j, cell);
        this.propagateToNeighbor(i, j - 1, cell);
        this.propagateToNeighbor(i, j + 1, cell);
      }

      newGrid[i][j] = cell;
    }
  }

  this.grid = newGrid;
  console.log('Grid after propagation:', this.grid);
}


private propagateToNeighbor(row: number, col: number, cell: Cell): void {
  if (
    row >= 0 &&
    row < this.simulationConfig.gridSize.rows &&
    col >= 0 &&
    col < this.simulationConfig.gridSize.cols &&
    !this.grid[row][col].isOnFire &&
    !this.grid[row][col].isBurned && 
    Math.random() < this.simulationConfig.propagationProbability
  ) {
    console.log(`Neighbor cell [${row}, ${col}] catches fire.`);
    this.grid[row][col].isOnFire = true;
  }
  
}
}