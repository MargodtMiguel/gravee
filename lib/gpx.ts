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

/**
 * Calculate distance (in km) and elevation gain (in m) from GPX coordinates
 */
export function calculateStats(coordinates: GpxCoordinate[]): { distance: number; elevation: number } {
  let distance = 0;
  let elevation = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[i + 1];

    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat * Math.PI) / 180) *
        Math.cos((p2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance += R * c;

    // Calculate elevation gain
    if (p1.ele !== undefined && p2.ele !== undefined) {
      const eleDiff = p2.ele - p1.ele;
      if (eleDiff > 0) {
        elevation += eleDiff;
      }
    }
  }

  // Round distance to 1 decimal place
  distance = Math.round(distance * 10) / 10;
  // Round elevation to integer
  elevation = Math.round(elevation);

  return { distance, elevation };
}
