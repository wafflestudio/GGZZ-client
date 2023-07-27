import React, { useCallback, useEffect, useState } from "react";
import { useMyPositionStore } from "../../../store/useMyPositionStore";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import styles from "./LocationSection.module.scss";
import Map from "../../Home/Map/Map";

const LocationSection = () => {
  // TODO: clicks 고치기
  const [zoom, setZoom] = useState(15); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const myPosition = useMyPositionStore((state) => state.currentCoordinates);
  const setViewPosition = useMyPositionStore((state) => state.setViewCoordinates);

  const render = useCallback(
    (status: Status) => {
      if (status === Status.FAILURE) return <h3>{status} ...</h3>;
      return <h3>{status} ..</h3>;
    },
    [center]
  );

  const onIdle = useCallback((m: google.maps.Map) => {
    const bounds = m.getBounds();
    if (!bounds) return;
    const newCenter = m.getCenter()?.toJSON();
    if (!newCenter) return;
    setZoom(m.getZoom() ?? 10);
    setCenter(newCenter);
    setViewPosition(newCenter);
  }, []);

  useEffect(() => {
    setCenter(myPosition);
  }, [myPosition]);

  return (
    <section className={styles["locationSection"]}>
      <div className={styles["label"]}>위치 등록</div>
      <div className={styles["chips"]}>
        <div className={styles["locationChip"]}>Hyundai Department Store</div>
        <div className={styles["locationChip"]}>Hyundai Department Store</div>
        <div className={styles["locationChip"]}>Hyundai Department Store</div>
        <div className={styles["locationChip"]}>Hyundai Department Store</div>
      </div>
      <div className={styles["mapContainer"]}>
        <Wrapper
          apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY || ""}
          version="beta"
          libraries={["marker"]}
          render={render}
        >
          <Map
            center={center}
            onIdle={onIdle}
            zoom={zoom}
            // TODO
            letters={[]}
            className={styles["map"]}
          />
        </Wrapper>
      </div>
    </section>
  );
};

export default LocationSection;
