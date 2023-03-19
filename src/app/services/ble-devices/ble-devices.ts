export interface BleDevicesResponse {
    ble_devices: BleDevice[];
}

export interface Localization {
    latitude: number;
    longitude: number;
}
  
export interface Detection {
    timestamp: number;
    rssi: number;
    detected_by_agent: string;
    agent_localization: Localization;
}
  
export interface BleDevice {
    mac: string;
    certified: boolean;
    detections: Detection[];
}