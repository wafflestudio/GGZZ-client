import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import styles from "./Home.module.scss";
import { useNavigate } from "react-router-dom";
import { ReceiveContainer } from "../components/Home/Receive/Receive";
// import { apiGetLetters, useApiData } from "../lib/hooks/apiHooks";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import React from "react";
import { TypeEqualityComparator, createCustomEqual, deepEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { Root, createRoot } from "react-dom/client";
import { useHomeModalStore } from "../store/useHomeModalStore";
import { useMyPositionStore } from "../store/useMyPositionStore";

const Home = () => {
  const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = React.useState(15); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral | null>({
    lat: 37.46474,
    lng: 126.954547,
  });

  const modalLetter = useHomeModalStore((state) => state.letter);
  const myPosition = useMyPositionStore((state) => state.currentCoordinates);
  //   const viewPosition = useMyPositionStore((state) => state.viewCoordinates);
  const setViewPosition = useMyPositionStore((state) => state.setViewCoordinates);
  const navigate = useNavigate();

  //   const currentLLCoordinates = useCallback(() => {
  //     if (viewPosition) return viewPosition;
  //     if (myPosition) {
  //       setCenter(myPosition);
  //       return myPosition;
  //     }
  //     return null;
  //   }, [myPosition, viewPosition]);

  //   const letters = useApiData<
  //     { id: number; title: string; summary: string; longitude: number; latitude: number }[]
  //   >(
  //     () => {
  //       const currentLL = currentLLCoordinates();
  //       if (!currentLL) return Promise.resolve([]);
  //       const { lat, lng } = currentLL;
  //       return apiGetLetters(lat, lng);
  //     },
  //     [],
  //     [myPosition, viewPosition]
  //   );

  const render = useCallback(
    (status: Status) => {
      if (status === Status.FAILURE) return <h3>{status} ...</h3>;
      return <h3>{status} ..</h3>;
    },
    [center]
  );

  const onClick = useCallback((e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    if (!e.latLng) return;
    setClicks([...clicks, e.latLng]);
  }, []);
  console.log(clicks.length);

  const onIdle = useCallback((m: google.maps.Map) => {
    const bounds = m.getBounds();
    if (!bounds) return;
    const newCenter = m.getCenter()?.toJSON();
    if (!newCenter) return;
    setZoom(m.getZoom() ?? 10);
    setCenter(newCenter);
    setViewPosition(newCenter);
  }, []);

  return (
    <div className={styles["home"]}>
      <>
        <Wrapper
          apiKey={process.env.VITE_GOOGLE_MAP_API_KEY || ""}
          version="beta"
          libraries={["marker"]}
          render={render}
        >
          <Map
            center={center}
            onClick={onClick}
            onIdle={onIdle}
            zoom={zoom}
            clicks={clicks}
            className={styles["map"]}
          />
          {/* TODO: 서버가 내려가 있어서 자세한 테스트는 진행 못함. */}
          {/* {letters.map((letter) => (
            <Marker
              key={letter.id}
              position={new google.maps.LatLng(letter.latitude, letter.longitude)}
              labelContent={letterElement}
              map={map}
            />
          ))} */}
        </Wrapper>
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
  clicks: google.maps.LatLng[];
}

const Map: React.FC<MapProps> = ({ onClick, onIdle, clicks, className, ...options }) => {
  const [map, setMap] = React.useState<google.maps.Map>();
  const [highLight, setHighlight] = useState<number>();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { ...options, disableDefaultUI: true }));
    }
  }, []);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      // TODO: mapId 추가하여 마커 로딩 확인
      map.setOptions({ ...options, mapId: "DEMO_MAP_ID" });
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

  const onMarkerClick = (index: number) => {
    if (index === highLight) setHighlight(undefined);
    else setHighlight(index);
  };

  return (
    <>
      <div ref={ref} className={className} />
      {map &&
        clicks.map((click, i) => {
          return (
            <Marker
              key={i}
              map={map}
              position={{ lat: click.lat(), lng: click.lng() }}
              onClick={() => onMarkerClick(i)}
            >
              {highLight !== i ? (
                <div className={styles.marker} />
              ) : (
                <div className={styles.highlight}>
                  <div className={styles.letterHeader}>
                    <div className={styles.nickname}>닉네임</div>
                    <div className={styles.createTime}>1분 전</div>
                  </div>
                  <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1774&q=80" />
                  <p className={styles.content}>
                    내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지
                    내용 뭐
                  </p>
                  <button className={styles.more}>더보기</button>
                </div>
              )}
            </Marker>
          );
        })}
    </>
  );
};

interface MarkerProps {
  map: google.maps.Map;
  position: { lat: number; lng: number };
  children: React.ReactNode;
  onClick: () => void;
}

const Marker = ({ map, children, position, onClick }: MarkerProps) => {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerView>();
  const rootRef = useRef<Root>();

  useEffect(() => {
    if (!rootRef.current) {
      const container = document.createElement("div");
      rootRef.current = createRoot(container);
      markerRef.current = new google.maps.marker.AdvancedMarkerView({
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
