
export interface AgentResponse {
    agent: Agent[];
}

export interface Agent {
    name: string;
    active: boolean;
    api_key: string;
    bt_address: string;
}


