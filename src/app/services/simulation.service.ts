import { BehaviorSubject } from "rxjs";
import { Cell, SimulationConfig } from "../model/simulation.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root', // Ceci permet l'injection de dépendances au niveau global
})

export class SimulationService {
  private simulationConfig!: SimulationConfig;
  private grid!: Cell[][];
  private isSimulationRunningSubject = new BehaviorSubject<boolean>(false);
  private simulationInterval!: NodeJS.Timeout;;
  isSimulationRunning$ = this.isSimulationRunningSubject.asObservable();

  constructor() {}

  initializeSimulation(config: SimulationConfig): void {
    this.simulationConfig = config;
    this.initializeGrid();
  }

  startSimulation(): void {
    this.isSimulationRunningSubject.next(true);
  
    // Simulation loop
    const simulationInterval: NodeJS.Timeout = setInterval(() => {
      this.propagateFire();
      if (!this.hasActiveFires()) {
        this.stopSimulation(simulationInterval);
      }
    }, 1000); // Change this interval as needed
  }
  
  stopSimulation(interval: NodeJS.Timeout): void {
    clearInterval(interval);
    this.isSimulationRunningSubject.next(false);
  }
  getSimulationInterval(): NodeJS.Timeout | null {
    return this.simulationInterval;
  }

  getGrid(): Cell[][] {
    return this.grid; // Cette méthode permet d'accéder à la propriété grid depuis l'extérieur
  }

  private initializeGrid(): void {
    this.grid = Array.from({ length: this.simulationConfig.gridSize.rows }, () =>
      Array(this.simulationConfig.gridSize.cols).fill({ isOnFire: false })
    );

    // Set initial fires
    this.simulationConfig.initialFires.forEach(fire => {
      this.grid[fire.row][fire.col].isOnFire = true;
    });
  }

  private propagateFire(): void {
    const newGrid: Cell[][] = [];

    for (let i = 0; i < this.simulationConfig.gridSize.rows; i++) {
      newGrid[i] = [];

      for (let j = 0; j < this.simulationConfig.gridSize.cols; j++) {
        const cell = { ...this.grid[i][j] };

        if (this.grid[i][j].isOnFire) {
          // Current cell is on fire, it turns off
          cell.isOnFire = false;

          // Propagate fire to neighbors with a certain probability
          this.propagateToNeighbor(i - 1, j, cell);
          this.propagateToNeighbor(i + 1, j, cell);
          this.propagateToNeighbor(i, j - 1, cell);
          this.propagateToNeighbor(i, j + 1, cell);
        }

        newGrid[i][j] = cell;
      }
    }

    this.grid = newGrid;
  }

  private propagateToNeighbor(row: number, col: number, cell: Cell): void {
    if (row >= 0 && row < this.simulationConfig.gridSize.rows &&
        col >= 0 && col < this.simulationConfig.gridSize.cols &&
        !this.grid[row][col].isOnFire &&
        Math.random() < this.simulationConfig.propagationProbability) {
      // Neighbor cell catches fire
      this.grid[row][col].isOnFire = true;
    }
  }

  private hasActiveFires(): boolean {
    return this.grid.some(row => row.some(cell => cell.isOnFire));
  }
}