import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Agent, AgentResponse } from "./agent"


@Injectable({
  providedIn: 'root'
})
export class AgentsService {
  private baseUrl = "http://192.168.0.16:8080/api"

  constructor(private http:HttpClient) { }

  getAgents(): Observable<Agent[]> {
    
    let header = new HttpHeaders().set('Content-Type','application/json')
    
    return this.http.get<AgentResponse>(`${this.baseUrl}/agent`, {
      headers:header
    }).pipe( 
      map(response => response.agent),
      map(agents => agents.map(agent => ({ active: agent.active, name: agent.name })))      

    );
  }

  getAgent(agent_name: string) {
    return this.http.get(`${this.baseUrl}/agent/${agent_name}`);
  }

  deleteAgent(agent: Agent) {
    return this.http.delete(`${this.baseUrl}/agent/${agent.name}`);
  }

  putAgent(agent: Agent) {
    return this.http.put(`${this.baseUrl}/agent/`, agent);
  }

  postAgent(agent: Agent) {
    return this.http.post(`${this.baseUrl}/agent/`, agent);
  }

}
