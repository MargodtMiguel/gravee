
import { calculateStats, GpxCoordinate } from './gpx';

describe('calculateStats', () => {
    it('should return 0 distance and 0 elevation for empty coordinates', () => {
        const stats = calculateStats([]);
        expect(stats.distance).toBe(0);
        expect(stats.elevation).toBe(0);
    });

    it('should calculate distance correctly for two points', () => {
        const coords: GpxCoordinate[] = [
            { lat: 51.0, lng: 3.0, ele: 0 },
            { lat: 51.0, lng: 3.01, ele: 0 } // Approx 0.7km diff at this latitude
        ];
        const stats = calculateStats(coords);
        expect(stats.distance).toBeGreaterThan(0.6);
        expect(stats.distance).toBeLessThan(0.8);
        expect(stats.elevation).toBe(0);
    });

    it('should calculate cumulative elevation gain', () => {
        const coords: GpxCoordinate[] = [
            { lat: 51.0, lng: 3.0, ele: 10 },
            { lat: 51.0, lng: 3.001, ele: 20 }, // +10
            { lat: 51.0, lng: 3.002, ele: 15 }, // -5
            { lat: 51.0, lng: 3.003, ele: 25 }  // +10
        ];
        const stats = calculateStats(coords);
        expect(stats.elevation).toBe(20); // 10 + 10
    });

    it('should handle missing elevation data', () => {
        const coords: GpxCoordinate[] = [
            { lat: 51.0, lng: 3.0 },
            { lat: 51.0, lng: 3.01 }
        ];
        const stats = calculateStats(coords);
        expect(stats.distance).toBeGreaterThan(0);
        expect(stats.elevation).toBe(0);
    });
});
