import { Component, OnInit } from '@angular/core';
import { AgentsService } from 'src/app/services/agents/agents.service';
import { Agent } from 'src/app/services/agents/agent';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  agents: Agent[];

  constructor(private agentsService: AgentsService) { }

  ngOnInit(): void {
  
    this.agentsService.getAgents().subscribe(
      agents => {
        this.agents = agents;
        console.log('Agents:', agents);
      },
      error => console.log(error)
        // Manejar el error aquí
      
    );

  }
}
