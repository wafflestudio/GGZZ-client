import { TLLCoordinates, TMapInfo, TXYCoordinates } from "./types/locationTypes";

export const deg2rad = (deg: number) => deg * (Math.PI / 180);

export const LLToXY = (
  { lon, lat }: TLLCoordinates,
  { width, height, centerLLCoordinates }: TMapInfo
): TXYCoordinates => {
  const { lon: cLon } = centerLLCoordinates;
  const LLRadius = 0.1;
  const minLon = cLon - LLRadius;
  const maxLon = cLon + LLRadius;

  const x = (lon - minLon) * (width / (maxLon - minLon));

  const latRad = deg2rad(lat);
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (width * mercN) / (2 * Math.PI);

  return { x, y };
};

export const getDistanceFromLatLonInM = (
  { lat: lat1, lon: lon1 }: TLLCoordinates,
  { lat: lat2, lon: lon2 }: TLLCoordinates
) => {
  const earthRadius = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = earthRadius * c * 1000; // Distance in m
  return d;
};

// export function getDistance(
//   { lat: lat1, lon: lon1 }: TLLCoordinates,
//   { lat: lat2, lon: lon2 }: TLLCoordinates
// ) {
//   const radLat1 = (Math.PI * lat1) / 180;
//   const radLat2 = (Math.PI * lat2) / 180;
//   const theta = lon1 - lon2;
//   const radTheta = (Math.PI * theta) / 180;
//   let dist =
//     Math.sin(radLat1) * Math.sin(radLat2) +
//     Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
//   if (dist > 1) dist = 1;

//   dist = Math.acos(dist);
//   dist = (dist * 180) / Math.PI;
//   dist = dist * 60 * 1.1515 * 1.609344 * 1000;
//   // if (dist < 100) dist = Math.round(dist / 10) * 10;
//   // else dist = Math.round(dist / 100) * 100;

//   return dist;
// }
