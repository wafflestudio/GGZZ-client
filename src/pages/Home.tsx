import { PropsWithChildren, ReactElement, useEffect, useRef, useState } from "react";
import styles from "./Home.module.scss";
import Letter from "../components/Home/Letter";
import { useMyPositionStore } from "../../store/useMyPositionStore";
import { useNavigate } from "react-router-dom";
import { useHomeModalStore } from "../../store/useHomeModalStore";
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

  // 형석: Api 사용

  const currentLLCoordinates = () => {
    if (viewPosition) return viewPosition;
    return myPosition ? myPosition : { lat: -37.4780396, lon: -126.945793 };
  };

  const letters = useApiData<
    { id: number; title: string; summary: string; longitude: number; latitude: number }[]
  >(
    // TODO: initial value를 서울대 혹은 서울대 정문으로 설정?
    () =>
      apiGetLetters(
        currentLLCoordinates().lon ?? 37.459109,
        currentLLCoordinates().lat ?? 126.9529286
      ),
    [],
    [myPosition]
  );
  const render = (status: Status): ReactElement => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    else {
      return <></>;
    }
  };
  const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = React.useState(15); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 37.459109,
    lng: 126.9529286,
  });

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setClicks([...clicks, e.latLng!]);
  };

  const onIdle = (m: google.maps.Map) => {
    const bounds = m.getBounds();
    if (!bounds) return;
    const newCenter = m.getCenter()?.toJSON();
    if (!newCenter) return;
    setZoom(m.getZoom() ?? 10);
    setCenter(newCenter);
  };

  return (
    <div className={styles["home"]}>
      {!currentLLCoordinates() ? (
        <div />
      ) : (
        <>
          <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY} render={render}>
            <Map
              center={center}
              onClick={onClick}
              onIdle={onIdle}
              zoom={zoom}
              style={{ flexGrow: "1", height: "100%" }}
            >
              {/* TODO: 서버가 내려가 있어서 자세한 테스트는 진행 못함. */}
              {letters.map((letter) => (
                <Marker
                  key={letter.id}
                  position={{ lat: letter.latitude, lng: letter.longitude }}
                />
              ))}
              {/* 현재는 클릭하면 마커 생성되게 해둠. */}
              {clicks.map((latLng, i) => (
                <Marker key={i} position={latLng} />
              ))}
            </Map>
          </Wrapper>
          <button
            className={styles["new"]}
            onClick={() => {
              setViewPosition(null);
              navigate("./send");
            }}
          >
            새 편지 남기기
          </button>
        </>
      )}
      {modalLetter && <ReceiveContainer />}
    </div>
  );
};

interface MapProps extends PropsWithChildren<google.maps.MapOptions> {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

const Map: React.FC<MapProps> = ({ onClick, onIdle, children, style, ...options }) => {
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
      <div ref={ref} style={style} />
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
