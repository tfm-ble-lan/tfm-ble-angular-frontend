import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Agent, AgentResponse } from "./agent"
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AgentsService {
  private baseUrl = `http://192.168.0.16:5000/api`
  //private baseUrl = process.env.NG_APP_BLE_API_URL;
  constructor(private http:HttpClient) { }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-KEY': "582K1D9FS-B2bFjfUbUf0w"
    });
    return headers;
  }

  getAgents(): Observable<Agent[]> {
    
    let header = this.getHeaders();
    
    return this.http.get<AgentResponse>(`${this.baseUrl}/agent`, {
      headers:header
    }).pipe( 
      map(response => response.agent),
      map(agents => agents.map(agent => ({ active: agent.active, name: agent.name, 
        api_key: agent.api_key, bt_address: agent.bt_address })))      

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
