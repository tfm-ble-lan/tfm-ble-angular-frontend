export interface BleDevicesResponse {
    ble_devices: BleDevice[];
}

export interface Localization {
    latitude: number;
    longitude: number;
}
  

export interface Manufacturer {
    id: number;
    name: string;
}
  

export interface Detection {
    timestamp: number;
    rssi: number;
    tx_power: number;
    detected_by_agent: string;
    agent_localization: Localization;
}
  
export interface BleDevice {
    address: string;
    bluetooth_address: number;
    certified: boolean;
    detections: Detection[];
    manufacturer: Manufacturer;
    


}