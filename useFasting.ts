import { useState, useEffect, useCallback, useRef } from 'react';
import { loadFastState, saveFastState, startFast, endFast, markMilestoneSeen } from '../store/fastingStore';
import {
  getElapsedDisplay,
  checkNewMilestone,
  getBodyState,
  getWarningLevel,
  getNextMilestone,
  getLastMilestone,
  type FastState,
} from '../utils/fastingEngine';
import type { FastingMilestone } from '../data/milestones';

export interface FastingData {
  fastState: FastState;
  elapsed: { hours: number; minutes: number; seconds: number; totalHours: number };
  bodyState: { state: string; detail: string };
  warningLevel: 'normal' | 'caution' | 'danger';
  nextMilestone: FastingMilestone | null;
  lastMilestone: FastingMilestone | null;
  pendingMilestone: FastingMilestone | null;
  isLoading: boolean;
}

export function useFasting() {
  const [fastState, setFastState] = useState<FastState>({
    isActive: false,
    startTime: null,
    milestonesSeen: [],
    lastUpdated: Date.now(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pendingMilestone, setPendingMilestone] = useState<FastingMilestone | null>(null);
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadFastState().then(state => {
      setFastState(state);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (fastState.isActive) {
      intervalRef.current = setInterval(() => setTick(t => t + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fastState.isActive]);

  // Check for new milestones
  useEffect(() => {
    if (!fastState.isActive || !fastState.startTime) return;
    const elapsed = getElapsedDisplay(fastState.startTime);
    const newMilestone = checkNewMilestone(elapsed.totalHours, fastState.milestonesSeen);
    if (newMilestone && !pendingMilestone) {
      setPendingMilestone(newMilestone);
    }
  }, [tick]);

  const elapsed = fastState.startTime
    ? getElapsedDisplay(fastState.startTime)
    : { hours: 0, minutes: 0, seconds: 0, totalHours: 0 };

  const bodyState = getBodyState(elapsed.totalHours);
  const warningLevel = getWarningLevel(elapsed.totalHours);
  const nextMilestone = getNextMilestone(elapsed.totalHours);
  const lastMilestone = getLastMilestone(elapsed.totalHours);

  const handleStartFast = useCallback(async () => {
    const state = await startFast();
    setFastState(state);
  }, []);

  const handleEndFast = useCallback(async () => {
    await endFast(fastState);
    setFastState({ isActive: false, startTime: null, milestonesSeen: [], lastUpdated: Date.now() });
  }, [fastState]);

  const dismissMilestone = useCallback(async () => {
    if (!pendingMilestone) return;
    const updated = await markMilestoneSeen(fastState, pendingMilestone.hours);
    setFastState(updated);
    setPendingMilestone(null);
  }, [pendingMilestone, fastState]);

  return {
    fastState,
    elapsed,
    bodyState,
    warningLevel,
    nextMilestone,
    lastMilestone,
    pendingMilestone,
    isLoading,
    startFast: handleStartFast,
    endFast: handleEndFast,
    dismissMilestone,
  };
}
