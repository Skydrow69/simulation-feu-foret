import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { SimulationService } from '../services/simulation.service';
import { Cell, SimulationConfig } from '../../app/model/simulation.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {
  public simulationIsRunning$!: Observable<boolean>;
  public grid: Cell[][] = [];
  constructor(private configService: ConfigService, public simulationService: SimulationService) {

  }

  ngOnInit(): void {
    this.simulationIsRunning$ = this.simulationService.isSimulationRunning$;
    this.configService.getConfig().subscribe((config: SimulationConfig) => {
      this.simulationService.initializeSimulation(config);
    });
  }
  
  startSimulation(): void {
    this.simulationService.lightInitialFires();
  
    this.simulationService.startSimulation();
  }
  
  stopSimulation(): void {
    const simulationInterval: NodeJS.Timeout | null = this.simulationService.getSimulationInterval();
  
    if (simulationInterval !== null) {
      clearInterval(simulationInterval);  
      this.simulationService.stopSimulation();
    }
  }
}  
