// src/components/MapContainer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import maplibregl from 'maplibre-gl';
import { MapPopupContent } from '@/components/MapPopupContent';

export const MapContainer = ({ animalName }: { animalName: string }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [lng] = useState(-109);
  const [lat] = useState(44.5);
  const [zoom] = useState(9);
  const lowerCaseAnimalName = animalName.toLowerCase().replace(" ", "");
  
  const hoveredStateId = useRef<number | string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);

  // Initial map setup effect
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    if (map.current || !mapContainer.current) {
      return;
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/019895a3-b014-7954-b2bd-571b18a8f899/style.json?key=YOMnmGWiP1IpGO4Wx3Mt`,
      center: [lng, lat],
      zoom: zoom,
      scrollZoom: true,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      document.head.removeChild(link);
    };
  }, [lng, lat, zoom]);

  // Data loading and layer management effect
  useEffect(() => {
    if (!map.current) return;

    setIsLoading(true);

    const sourceName = `${lowerCaseAnimalName}-areas`;
    const fillLayerId = `${lowerCaseAnimalName}-areas-fill`;
    const outlineLayerId = `${lowerCaseAnimalName}-areas-outline`;
    const labelLayerId = `${lowerCaseAnimalName}-areas-labels`;
    const geojsonPath = lowerCaseAnimalName 
      ? `/${lowerCaseAnimalName}/${lowerCaseAnimalName}huntareas.geojson`
      : '/antelope/antelopehuntareas.geojson';

    const cleanupMap = () => {
      if (!map.current) return;

      const currentLayers = map.current.getStyle().layers.map(layer => layer.id);
      currentLayers.forEach(layerId => {
        if (layerId.includes('-areas') && map.current!.getLayer(layerId)) {
          map.current!.removeLayer(layerId);
        }
      });
      const currentSources = Object.keys(map.current.getStyle().sources);
      currentSources.forEach(sourceId => {
        if (sourceId.includes('-areas') && map.current!.getSource(sourceId)) {
          map.current!.removeSource(sourceId);
        }
      });
    };
    
    const mousemoveHandler = (e: maplibregl.MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0) {
        const featureId = e.features[0].id;
        if (featureId) {
          if (hoveredStateId.current !== null) {
            map.current!.setFeatureState(
              { source: sourceName, id: hoveredStateId.current },
              { hover: false }
            );
          }
          hoveredStateId.current = featureId;
          map.current!.setFeatureState(
            { source: sourceName, id: featureId },
            { hover: true }
          );
        }
      }
    };

    const mouseleaveHandler = () => {
      if (hoveredStateId.current !== null) {
        map.current!.setFeatureState(
          { source: sourceName, id: hoveredStateId.current },
          { hover: false }
        );
      }
      hoveredStateId.current = null;
    };

    const mouseenterHandler = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    };

    const mouseleaveCanvasHandler = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    };

    const clickHandler = (e: maplibregl.MapLayerMouseEvent) => {
      if (!e.features || e.features.length === 0) return;

      const features = e.features[0];
      const coordinates = e.lngLat;
      const properties = features.properties;


      const typedProperties = properties as {
        [key: string]: any;
        HUNTAREA: string;
        HUNTNAME: string;
        HERDNAME: string;
      };

      const popupContainer = document.createElement('div');
      const root = ReactDOM.createRoot(popupContainer);

      // HERE is the key change: pass the animal name to the popup content.
      root.render(<MapPopupContent properties={typedProperties} animalName={lowerCaseAnimalName} />);

      const popup = new maplibregl.Popup({ closeOnClick: true })
        .setLngLat(coordinates)
        .setDOMContent(popupContainer)
        .addTo(map.current!);

      popup.on('close', () => {
          root.unmount();
        });
    };

    const handleLoad = () => {
      cleanupMap();

      map.current!.addSource(sourceName, {
        type: 'geojson',
        data: geojsonPath,
        promoteId: 'HUNTAREA', 
      });

      map.current!.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: sourceName,
        layout: {},
        paint: {
          'fill-color': '#0080ff',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.6,
            0.4,
          ],
        },
      });

      map.current!.addLayer({
        id: outlineLayerId,
        type: 'line',
        source: sourceName,
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#f00',
            '#FFFFFF',
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            4,
            2,
          ],
        },
      });

      map.current!.addLayer({
        id: labelLayerId,
        type: 'symbol',
        source: sourceName,
        layout: {
          'text-field': ['get', 'HUNTAREA'],
          'text-font': ['literal', ['Inter Bold', 'Arial Unicode MS Bold']],
          'text-size': 12,
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        },
      });

      map.current!.on('mousemove', fillLayerId, mousemoveHandler);
      map.current!.on('mouseleave', fillLayerId, mouseleaveHandler);
      map.current!.on('mouseenter', fillLayerId, mouseenterHandler);
      map.current!.on('mouseleave', fillLayerId, mouseleaveCanvasHandler);
      map.current!.on('click', fillLayerId, clickHandler);

      setIsLoading(false);
    };

    if (map.current.isStyleLoaded()) {
      handleLoad();
    } else {
      map.current.on('load', handleLoad);
    }

    return () => {
      if (map.current) {
        map.current.off('load', handleLoad);
        map.current.off('mousemove', fillLayerId, mousemoveHandler);
        map.current.off('mouseleave', fillLayerId, mouseleaveHandler);
        map.current.off('mouseenter', fillLayerId, mouseenterHandler);
        map.current.off('mouseleave', fillLayerId, mouseleaveCanvasHandler);
        map.current.off('click', fillLayerId, clickHandler);
        cleanupMap();
      }
    };
  }, [lowerCaseAnimalName]);

  return (
    <div
      ref={mapContainer}
      className="relative w-full h-full bg-gray-200 overflow-hidden"
    >
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-4 rounded-lg bg-white bg-opacity-75 flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="ml-2 text-gray-700 font-medium">Loading map data...</span>
        </div>
      )}
    </div>
  );
};