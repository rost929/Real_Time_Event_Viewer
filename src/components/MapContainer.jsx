import React, { useState, useRef, useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import mapConfig from '../mapConfig';
import earthquakeIcon from '../assets/earthquake-icon.svg';
import { useSelector } from 'react-redux';

const customIcon = new Icon({
    iconUrl: earthquakeIcon,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25]
});

const baseLayers = {
    osm: {
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
        name: 'Satellite',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    carto: {
        name: 'CartoDB Positron',
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    darkCarto: {
        name: 'CartoDB Dark Matter',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
};

function MapContainer({ events, selectedEvent }) {
    const mapRef = useRef(null);
    const category = useSelector(state => state.events.category);
    const [activeBaseLayer, setActiveBaseLayer] = useState('osm'); // Default to OpenStreetMap

    useEffect(() => {
        if (selectedEvent && mapRef.current) {
            let position;
            if (category === 'earthquakes' && selectedEvent?.geometry?.coordinates) {
                const [longitude, latitude] = selectedEvent.geometry.coordinates;
                position = [latitude, longitude];
            } else if (category === 'volcanoes' && selectedEvent?.latitude && selectedEvent?.longitude) {
                position = [selectedEvent.latitude, selectedEvent.longitude];
            }
            
            if (position) {
                mapRef.current.flyTo(position, 8, { duration: 1.5 });
            } else {
                console.error("Invalid coordinates for selected event:", selectedEvent);
            }
        }
    }, [selectedEvent, category]);

    return (
        <div style={{ height: '110vh', width: '100%' }}>
            <LeafletMap
                center={mapConfig.defaultCenter}
                zoom={mapConfig.defaultZoom}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked={activeBaseLayer === 'osm'} name={baseLayers.osm.name}>
                        <TileLayer
                            attribution={baseLayers.osm.attribution}
                            url={baseLayers.osm.url}
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked={activeBaseLayer === 'satellite'} name={baseLayers.satellite.name}>
                        <TileLayer
                            attribution={baseLayers.satellite.attribution}
                            url={baseLayers.satellite.url}
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked={activeBaseLayer === 'carto'} name={baseLayers.carto.name}>
                        <TileLayer
                            attribution={baseLayers.carto.attribution}
                            url={baseLayers.carto.url}
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked={activeBaseLayer === 'darkCarto'} name={baseLayers.darkCarto.name}>
                        <TileLayer
                            attribution={baseLayers.darkCarto.attribution}
                            url={baseLayers.darkCarto.url}
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
                {events && events.map((event, index) => {
                    let position;
                    let popupContent;
                    const key = event?.id || event?.name || index;

                    if (category === 'earthquakes' && event?.geometry?.coordinates) {
                        const { geometry, properties } = event;
                        position = [geometry.coordinates[1], geometry.coordinates[0]];
                        popupContent = (
                            <Popup>
                                <b>{properties.place}</b><br />
                                Magnitude: {properties.mag}
                            </Popup>
                        );
                    } else if (category === 'volcanoes' && event?.latitude && event?.longitude) {
                        position = [event.latitude, event.longitude];
                        popupContent = (
                            <Popup>
                                <b>{event.name}</b><br />
                            </Popup>
                        );
                    }
                    if (position) {
                        return (
                            <Marker key={key} position={position} icon={customIcon}>
                                {popupContent}
                            </Marker>
                        );
                    }
                    return null;
                })}
            </LeafletMap>
        </div>
    );
}

export default MapContainer;