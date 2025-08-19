// src/components/MapContainer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import maplibregl from 'maplibre-gl';
import { MapPopupContent } from '@/components/MapPopupContent';

export const MapContainer = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const [lng] = useState(-109);
  const [lat] = useState(44.5);
  const [zoom] = useState(9);

  useEffect(() => {
    // Dynamically load MapLibre GL CSS
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

    map.current!.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current!.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    map.current!.on('load', () => {
      map.current!.addSource('elk-areas', {
        type: 'geojson',
        data: '/elkhuntareas.geojson',
        promoteId: 'id',
      });

      map.current!.addLayer({
        id: 'elk-areas-fill',
        type: 'fill',
        source: 'elk-areas',
        layout: {},
        paint: {
          'fill-color': '#0080ff',
          'fill-opacity': 0.4,
        },
      });

      map.current!.addLayer({
        id: 'elk-areas-outline',
        type: 'line',
        source: 'elk-areas',
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
        id: 'elk-areas-labels',
        type: 'symbol',
        source: 'elk-areas',
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

      // Change cursor to pointer when hovering over clickable areas
      map.current!.on('mouseenter', 'elk-areas-fill', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      // Reset cursor when leaving clickable areas
      map.current!.on('mouseleave', 'elk-areas-fill', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });

      // Add click event listener for popups
      map.current!.on('click', 'elk-areas-fill', (e) => {
        if (!e.features || e.features.length === 0) return;

        const features = e.features[0];
        const coordinates = e.lngLat;
        const properties = features.properties;

        if (!properties || !properties.HUNTAREA || !properties.HUNTNAME || !properties.HERDNAME) {
          console.error('Clicked feature is missing required properties for the popup.');
          return;
        }

        const typedProperties = properties as {
            [key: string]: any;
            HUNTAREA: string;
            HUNTNAME: string;
            HERDNAME: string;
        };

        const popupContainer = document.createElement('div');
        const root = ReactDOM.createRoot(popupContainer);

        root.render(<MapPopupContent properties={typedProperties} />);

        const popup = new maplibregl.Popup({ closeOnClick: true })
          .setLngLat(coordinates)
          .setDOMContent(popupContainer)
          .addTo(map.current!);

        popup.on('close', () => {
          root.unmount();
        });
      });
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      document.head.removeChild(link);
    };
  }, [lng, lat, zoom]);

  return (
    <div
      ref={mapContainer}
      className="relative w-full h-full bg-gray-200 overflow-hidden"
    ></div>
  );
};