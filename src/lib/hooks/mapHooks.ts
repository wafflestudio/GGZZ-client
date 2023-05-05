import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { TypeEqualityComparator, createCustomEqual, deepEqual } from "fast-equals";
import { useEffect, useRef } from "react";

export function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: unknown[]
) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

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
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}
