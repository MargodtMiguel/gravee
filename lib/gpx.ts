export interface GpxCoordinate {
  lat: number;
  lng: number;
  ele?: number;
}

/**
 * Parse GPX XML content and extract track coordinates
 */
export function parseGpx(gpxContent: string): GpxCoordinate[] {
  const coordinates: GpxCoordinate[] = [];
  
  // Match all trackpoints in the GPX, including multi-line content
  const trkptRegex = /<trkpt\s+lat="([^"]+)"\s+lon="([^"]+)"[^>]*>([\s\S]*?)<\/trkpt>/g;
  const eleRegex = /<ele>([^<]+)<\/ele>/;
  
  let match;
  while ((match = trkptRegex.exec(gpxContent)) !== null) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    const trkptContent = match[3];
    
    // Extract elevation from within the trkpt content
    const eleMatch = trkptContent.match(eleRegex);
    const ele = eleMatch ? parseFloat(eleMatch[1]) : undefined;
    
    if (!isNaN(lat) && !isNaN(lng)) {
      coordinates.push({ lat, lng, ele });
    }
  }
  
  return coordinates;
}

/**
 * Convert GPX coordinates to GeoJSON LineString format for Mapbox
 */
export function gpxToGeoJson(coordinates: GpxCoordinate[]): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: coordinates.map((coord) => [coord.lng, coord.lat]),
    },
  };
}

/**
 * Calculate the bounding box for a set of coordinates
 */
export function getBounds(coordinates: GpxCoordinate[]): [[number, number], [number, number]] {
  if (coordinates.length === 0) {
    return [[0, 0], [0, 0]];
  }

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const coord of coordinates) {
    if (coord.lng < minLng) minLng = coord.lng;
    if (coord.lng > maxLng) maxLng = coord.lng;
    if (coord.lat < minLat) minLat = coord.lat;
    if (coord.lat > maxLat) maxLat = coord.lat;
  }

  return [[minLng, minLat], [maxLng, maxLat]];
}
