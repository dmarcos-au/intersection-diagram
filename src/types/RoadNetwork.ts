export type VehicleType = 'Bus' | 'HV' | 'LV';
export type Direction = 'left' | 'through' | 'right';

export interface TrafficFlow {
    vehicleType: VehicleType;
    direction: Direction;
    volume: number;
}

export interface RoadSegment {
    id: string;
    name: string;
    startIntersectionId: string;
    endIntersectionId: string;
    trafficFlows: TrafficFlow[];
}

export interface Intersection {
    id: string;
    x: number;
    y: number;
    connectedRoads: RoadSegment[];
    trafficMatrix: {
        [fromRoadId: string]: {
            [toRoadId: string]: {
                [vehicleType in VehicleType]: number;
            };
        };
    };
}

export class RoadNetwork {
    private intersections: Map<string, Intersection> = new Map();
    private roadSegments: Map<string, RoadSegment> = new Map();

    addIntersection(intersection: Intersection) {
        this.intersections.set(intersection.id, intersection);
    }

    addRoadSegment(segment: RoadSegment) {
        this.roadSegments.set(segment.id, segment);
    }

    getIntersection(id: string): Intersection | undefined {
        return this.intersections.get(id);
    }

    getRoadSegment(id: string): RoadSegment | undefined {
        return this.roadSegments.get(id);
    }

    getAllIntersections(): Intersection[] {
        return Array.from(this.intersections.values());
    }

    getAllRoadSegments(): RoadSegment[] {
        return Array.from(this.roadSegments.values());
    }
} 