/**
 * StrideMap.web.tsx
 * Web/preview version — dynamically loads Leaflet + OpenStreetMap tiles.
 * Automatically selected over .native.tsx on Expo web / preview.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '../../constants/theme';

export interface RoutePoint {
  latitude: number;
  longitude: number;
}

export interface StrideMapProps {
  route: RoutePoint[];
  isActive: boolean;
  activityType: 'walking' | 'running' | 'still' | 'gym';
  showOfflineBadge?: boolean;
  offlineMB?: number;
  style?: any;
}

export function StrideMap({ route, isActive, activityType, style }: StrideMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const initDoneRef = useRef(false);

  // Default center: geographic center of the US
  const defaultCenter: [number, number] = [39.8283, -98.5795];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // ── 1. Inject Leaflet CSS ──────────────────────────────────────────────────
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!mapContainerRef.current || initDoneRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      initDoneRef.current = true;

      // Fix broken default marker icon URLs
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      // ── OpenStreetMap tile layer — LIVE, no API key ──────────────────────────
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);

      mapInstanceRef.current = map;
    };

    // ── 2. Load Leaflet JS ─────────────────────────────────────────────────────
    if ((window as any).L) {
      initMap();
    } else if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setTimeout(initMap, 50); // slight delay for DOM settle
      document.head.appendChild(script);
    } else {
      // Script tag exists but may still be loading — poll for it
      const poll = setInterval(() => {
        if ((window as any).L) { clearInterval(poll); initMap(); }
      }, 100);
      setTimeout(() => clearInterval(poll), 5000);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        polylineRef.current = null;
        initDoneRef.current = false;
      }
    };
  }, []);

  // ── Update route polyline whenever route or activity type changes ────────────
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (route.length < 2) return;

    const latlngs = route.map(p => [p.latitude, p.longitude]);
    const color = activityType === 'running' ? '#FFB800' : '#00E5A0';

    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latlngs);
      polylineRef.current.setStyle({ color });
    } else {
      polylineRef.current = L.polyline(latlngs, {
        color, weight: 4, opacity: 0.92,
      }).addTo(mapInstanceRef.current);
    }

    // Pan to latest GPS point when session is active
    if (isActive) {
      const last = route[route.length - 1];
      mapInstanceRef.current.panTo([last.latitude, last.longitude]);
    } else {
      // Fit whole route in view after session ends
      mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [24, 24] });
    }
  }, [route, activityType, isActive]);

  return (
    <View style={[styles.wrapper, style]}>
      {/* Live OSM badge */}
      <View style={styles.osmBadge} pointerEvents="none">
        <View style={styles.osmDot} />
        <Text style={styles.osmText}>OpenStreetMap · Live</Text>
      </View>

      {/* Leaflet map mounts into this div */}
      <div
        ref={mapContainerRef as any}
        style={{ width: '100%', height: '100%', backgroundColor: '#141420' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    overflow: 'hidden' as any,
    position: 'relative',
  },
  osmBadge: {
    position: 'absolute',
    bottom: 28, // above Leaflet attribution bar
    right: Spacing.sm,
    zIndex: 500,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.cardBg + 'DD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  osmDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  osmText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    includeFontPadding: false,
  },
});
