import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const PROVIDER_GOOGLE = 'google';

export const Marker = ({ coordinate, title, description }: any) => (
    <View style={styles.markerPlaceholder}>
        <Text style={styles.markerText}>{title || 'Marker'}</Text>
        {description && <Text style={styles.markerDescription}>{description}</Text>}
    </View>
);

const MapView = ({ children, style, region }: any) => {
    // Default coordinates (e.g., Baku, Azerbaijan) if region is not provided
    const lat = region?.latitude || 40.4093;
    const lon = region?.longitude || 49.8671;
    const zoom = 15;

    // OpenStreetMap Embed URL using an iframe
    const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01}%2C${lat - 0.01}%2C${lon + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lon}`;

    return (
        <View style={[styles.container, style]}>
            <iframe
                src={osmUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Map"
            />
            <View style={styles.overlay}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        borderRadius: 8,
    },
    overlay: {
        position: 'absolute',
        top: 10,
        left: 10,
        pointerEvents: 'none',
    },
    markerPlaceholder: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    markerText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333',
    },
    markerDescription: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    }
});

export default MapView;
