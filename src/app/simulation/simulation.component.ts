import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { SimulationService } from '../services/simulation.service';
import { Cell, SimulationConfig } from '../../app/model/simulation.model';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {
  public grid: Cell[][] = [];
  public simulationService!: SimulationService;
  constructor(private configService: ConfigService, private _simulationService: SimulationService) {
    this.simulationService = _simulationService;
  }

  ngOnInit(): void {
    this.grid = this._simulationService.getGrid();
    this.configService.getConfig().subscribe((config: SimulationConfig) => {
      this._simulationService.initializeSimulation(config);
    });
  }

  startSimulation(): void {
    this._simulationService.startSimulation();
  }
  stopSimulation(): void {
    const simulationInterval: NodeJS.Timeout | null = this._simulationService.getSimulationInterval();
  
    if (simulationInterval !== null) {
      clearInterval(simulationInterval);
      // Faites d'autres opérations nécessaires
  
      this._simulationService.stopSimulation(simulationInterval);
    }
  }
}  
