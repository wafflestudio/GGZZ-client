import { TLLCoordinates, TMapInfo, TXYCoordinates } from "./types/locationTypes";

export const LLToXY = (
  { long, lat }: TLLCoordinates,
  { width, height, centerLLCoordinates }: TMapInfo
): TXYCoordinates => {
  const { long: cLong } = centerLLCoordinates;
  const LLRadius = 0.1;
  const minLong = cLong - LLRadius;
  const maxLong = cLong + LLRadius;

  const x = (long - minLong) * (width / (maxLong - minLong));

  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (width * mercN) / (2 * Math.PI);

  return { x, y };
};
