import { PropsWithChildren, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import styles from "./Home.module.scss";
import { TLLCoordinates } from "../lib/types/locationTypes";
import { getDistanceFromLatLngInM } from "../lib/lib";
import Letter from "../components/Home/Letter";
import { useMyPositionStore } from "../store/useMyPositionStore";
import me_icon from "../assets/icon/me.svg";
import { useNavigate } from "react-router-dom";
import { useHomeModalStore } from "../store/useHomeModalStore";
import { ReceiveContainer } from "../components/Home/Receive/Receive";
import { apiGetLetters, useApiData } from "../lib/hooks/apiHooks";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import React from "react";
import { TypeEqualityComparator, createCustomEqual, deepEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";

const Home = () => {
  const modalLetter = useHomeModalStore((state) => state.letter);
  const myPosition = useMyPositionStore((state) => state.currentCoordinates);
  const viewPosition = useMyPositionStore((state) => state.viewCoordinates);
  const setViewPosition = useMyPositionStore((state) => state.setViewCoordinates);
  const navigate = useNavigate();

  const currentLLCoordinates = useCallback(() => {
    if (viewPosition) return viewPosition;
    if (myPosition) {
      setCenter(myPosition);
      return myPosition;
    }
    return null;
  }, [myPosition, viewPosition]);

  const letters = useApiData<
    { id: number; title: string; summary: string; longitude: number; latitude: number }[]
  >(
    () => {
      const currentLL = currentLLCoordinates();
      if (!currentLL) return Promise.resolve([]);
      const { lat, lng } = currentLL;
      return apiGetLetters(lng, lat);
    },
    [],
    [myPosition, viewPosition]
  );
  const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = React.useState(15); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral | null>(null);

  const render = useCallback(
    (status: Status): ReactElement => {
      if (status === Status.LOADING || center === null) return <h3>{status} ..</h3>;
      if (status === Status.FAILURE) return <h3>{status} ...</h3>;
      else {
        return renderMap();
      }
    },
    [center]
  );
  const onClick = useCallback((e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    if (!e.latLng) return;
    setClicks([...clicks, e.latLng]);
  }, []);

  const onIdle = useCallback((m: google.maps.Map) => {
    const bounds = m.getBounds();
    if (!bounds) return;
    const newCenter = m.getCenter()?.toJSON();
    if (!newCenter) return;
    setZoom(m.getZoom() ?? 10);
    setCenter(newCenter);
    setViewPosition(newCenter);
  }, []);

  const renderMap = useCallback((): ReactElement => {
    return (
      <Map center={center} onClick={onClick} onIdle={onIdle} zoom={zoom} className={styles["map"]}>
        {/* TODO: 서버가 내려가 있어서 자세한 테스트는 진행 못함. */}
        {letters.map((letter) => (
          <Marker key={letter.id} position={{ lat: letter.latitude, lng: letter.longitude }} />
        ))}
        {/* 현재는 클릭하면 마커 생성되게 해둠. */}
        {clicks.map((latLng, i) => (
          <Marker key={i} position={latLng} />
        ))}
      </Map>
    );
  }, [center, onClick, onIdle, zoom, letters, clicks]);

  return (
    <div className={styles["home"]}>
      <>
        <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY || ""} render={render} />
        <button
          className={styles["new"]}
          onClick={() => {
            setViewPosition(null);
            navigate("./send");
          }}
        >
          새 편지 쓰기
        </button>
        <button
          className={styles["my-position-btn"]}
          onClick={() => {
            setViewPosition(null);
            setCenter(myPosition);
          }}
        >
          현재 위치
        </button>
      </>
      {modalLetter && <ReceiveContainer />}
    </div>
  );
};

interface MapProps extends PropsWithChildren<google.maps.MapOptions> {
  className: string;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

const Map: React.FC<MapProps> = ({ onClick, onIdle, children, className, ...options }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) => google.maps.event.clearListeners(map, eventName));

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} className={className} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

type LatLngObject = google.maps.LatLng | google.maps.LatLngLiteral;

const customCompare: TypeEqualityComparator<LatLngObject, undefined> = (a: any, b: any) => {
  if (
    isLatLngLiteral(a) ||
    isLatLngLiteral(b) ||
    a instanceof google.maps.LatLng ||
    b instanceof google.maps.LatLng
  ) {
    if (isLatLngLiteral(a)) {
      a = new google.maps.LatLng(a);
    }
    if (isLatLngLiteral(b)) {
      b = new google.maps.LatLng(b);
    }
    return a.equals(b);
  }

  // TODO extend to other types

  // use fast-equals for other objects
  return deepEqual(a, b);
};

const deepCompareEqualsForMaps = createCustomEqual({
  createCustomConfig: () => ({
    areObjectsEqual: customCompare,
  }),
});

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(callback: React.EffectCallback, dependencies: unknown[]) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default Home;
