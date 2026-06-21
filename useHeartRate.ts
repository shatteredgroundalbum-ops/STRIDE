import { useState, useCallback } from 'react';

// Bluetooth LE heart rate - requires native environment to test
// Returns mock/unavailable state in simulator
export function useHeartRate() {
  const [isConnected, setIsConnected] = useState(false);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanAndConnect = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    // BLE requires real device - show informational message
    await new Promise(r => setTimeout(r, 2000));
    setIsScanning(false);
    setError('Bluetooth heart rate monitors require a physical device. Deploy to Android to use this feature.');
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setHeartRate(null);
    setDeviceName(null);
  }, []);

  return {
    isConnected,
    heartRate,
    deviceName,
    isScanning,
    error,
    scanAndConnect,
    disconnect,
  };
}
