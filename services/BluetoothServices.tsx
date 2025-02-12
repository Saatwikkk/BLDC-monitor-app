import React, { createContext, useState, useEffect } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { Buffer } from "buffer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BluetoothContext = createContext<any>(null);

const bleManager = new BleManager();

const BluetoothService = ({ children }: any) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [data, setData] = useState({ rpm: 0, voltage: 0, throttle: 0, temperature: 0 });

  useEffect(() => {
    scanForDevices();
    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

  const scanForDevices = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Bluetooth Scan Error:", error);
        return;
      }
      if (device?.name?.includes("ESP32")) {
        setDevices((prevDevices) => {
          const exists = prevDevices.some((d) => d.id === device.id);
          return exists ? prevDevices : [...prevDevices, device];
        });
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => bleManager.stopDeviceScan(), 10000);
  };

  const connectToDevice = async (device: Device) => {
    try {
      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      console.log(`Connected to ${device.name}`);

      readDataFromDevice(connected);
    } catch (error) {
      console.error("Connection Error:", error);
    }
  };

  const disconnectDevice = async () => {
    try {
      if (connectedDevice) {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        console.log("Device disconnected.");
      }
    } catch (error) {
      console.error("Disconnect Error:", error);
    }
  };

  const readDataFromDevice = async (device: Device) => {
    if (!device) return;

    try {
      const services = await device.services();
      for (const service of services) {
        const characteristics = await service.characteristics();
        for (const characteristic of characteristics) {
          if (characteristic.isNotifiable) {
            characteristic.monitor((error, characteristic) => {
              if (error) {
                console.error("Error reading data:", error);
                return;
              }
              if (characteristic?.value) {
                const receivedData = Buffer.from(characteristic.value, "base64").toString();
                try {
                  const parsedData = JSON.parse(receivedData);
                  setData(parsedData);
                  AsyncStorage.setItem("esp32Data", JSON.stringify(parsedData));
                } catch (e) {
                  console.error("Parsing error:", e);
                }
              }
            });
          }
        }
      }
    } catch (error) {
      console.error("Service Discovery Error:", error);
    }
  };

  return (
    <BluetoothContext.Provider
      value={{ devices, connectedDevice, data, scanForDevices, connectToDevice, disconnectDevice }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothService;
