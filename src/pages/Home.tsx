import { useCallback, useState } from "react";
import styles from "./Home.module.scss";
import { useNavigate } from "react-router-dom";
import { ReceiveContainer } from "../components/Home/Receive/Receive";
// import { apiGetLetters, useApiData } from "../lib/hooks/apiHooks";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useHomeModalStore } from "../store/useHomeModalStore";
import { useMyPositionStore } from "../store/useMyPositionStore";
import Map from "../components/Home/Map/Map";

const Home = () => {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(15); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>({
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
          apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY || ""}
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
      </>
      {modalLetter && <ReceiveContainer />}
    </div>
  );
};

export default Home;
