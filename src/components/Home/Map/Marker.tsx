import { useEffect, useRef } from "react";
import { Root, createRoot } from "react-dom/client";

interface MarkerProps {
  map: google.maps.Map;
  position: { lat: number; lng: number };
  children: React.ReactNode;
  onClick: () => void;
}

const Marker = ({ map, children, position, onClick }: MarkerProps) => {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement>();
  const rootRef = useRef<Root>();

  useEffect(() => {
    if (!rootRef.current) {
      const container = document.createElement("div");
      rootRef.current = createRoot(container);
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position,
        content: container,
      });
    }
  }, []);

  useEffect(() => {
    if (rootRef.current) rootRef.current?.render(children);
    if (markerRef.current) {
      markerRef.current.position = position;
      markerRef.current.map = map;
    }
    const listener = markerRef.current?.addListener("click", onClick);
    return () => listener?.remove();
  }, [map, position, children]);

  return null;
};

export default Marker;
