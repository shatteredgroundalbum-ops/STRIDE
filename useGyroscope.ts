import { useState, useEffect, useCallback } from 'react';
import { Gyroscope } from 'expo-sensors';

export type MotionType = 'still' | 'walking' | 'running' | 'gym';

export function useGyroscope() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [motionType, setMotionType] = useState<MotionType>('still');
  const [magnitude, setMagnitude] = useState(0);

  useEffect(() => {
    Gyroscope.isAvailableAsync().then(setIsAvailable);
  }, []);

  const startMonitoring = useCallback(() => {
    if (!isAvailable) return () => {};
    Gyroscope.setUpdateInterval(500);
    const sub = Gyroscope.addListener(data => {
      const mag = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
      setMagnitude(mag);
      // Thresholds: still < 0.1, walking 0.1-1.5, running > 1.5
      if (mag < 0.1) setMotionType('still');
      else if (mag < 1.5) setMotionType('walking');
      else setMotionType('running');
    });
    return () => sub.remove();
  }, [isAvailable]);

  return { isAvailable, motionType, magnitude, startMonitoring };
}
