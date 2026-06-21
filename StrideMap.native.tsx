/**
 * StrideMap.native.tsx
 * Native (iOS/Android) version using react-native-maps + OSM UrlTile.
 * Automatically selected over .web.tsx on native platforms.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { Colors } from '../../constants/theme';
import { tileUrlTemplate } from '../../utils/tileCache';

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

export function StrideMap({ route, isActive, activityType, showOfflineBadge, style }: StrideMapProps) {
  const center = route.length > 0
    ? { latitude: route[route.length - 1].latitude, longitude: route[route.length - 1].longitude }
    : { latitude: 39.8283, longitude: -98.5795 };

  return (
    <View style={[styles.wrapper, style]}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        mapType="none"
        initialRegion={{
          ...center,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        followsUserLocation={isActive}
      >
        {/* Live OSM tile layer — always active, no API key required */}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
          zIndex={0}
        />

        {/* Cached offline tiles overlay (zooms 12–15) when available */}
        {showOfflineBadge ? (
          <UrlTile
            urlTemplate={tileUrlTemplate()}
            maximumZ={15}
            minimumZ={12}
            flipY={false}
            zIndex={1}
          />
        ) : null}

        {/* Route polyline */}
        {route.length > 1 ? (
          <Polyline
            coordinates={route}
            strokeColor={activityType === 'running' ? Colors.warning : Colors.primary}
            strokeWidth={4}
          />
        ) : null}

        {/* Start marker */}
        {route.length > 0 ? (
          <Marker coordinate={route[0]} title="Start" anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.markerStart}>
              <View style={styles.markerInner} />
            </View>
          </Marker>
        ) : null}

        {/* Current position marker when active */}
        {isActive && route.length > 1 ? (
          <Marker coordinate={route[route.length - 1]} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.markerCurrent}>
              <View style={styles.markerCurrentInner} />
            </View>
          </Marker>
        ) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  map: { flex: 1 },
  markerStart: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.primary + '44',
    borderWidth: 2, borderColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  markerInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  markerCurrent: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#4A9FFF44',
    borderWidth: 2.5, borderColor: '#4A9FFF',
    justifyContent: 'center', alignItems: 'center',
  },
  markerCurrentInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4A9FFF' },
});
