import React from "react";
import { Group, Line, Text } from "react-konva";
import { RoadSegment, Intersection } from "../types/RoadNetwork";

interface Props {
    segment: RoadSegment;
    startIntersection: Intersection;
    endIntersection: Intersection;
    isSelected: boolean;
    onClick: () => void;
}

export const RoadSegmentComponent: React.FC<Props> = ({
    segment,
    startIntersection,
    endIntersection,
    isSelected,
    onClick,
}) => {
    const angle = Math.atan2(
        endIntersection.y - startIntersection.y,
        endIntersection.x - startIntersection.x
    );
    
    const midX = (startIntersection.x + endIntersection.x) / 2;
    const midY = (startIntersection.y + endIntersection.y) / 2;

    return (
        <Group onClick={onClick}>
            <Line
                points={[
                    startIntersection.x,
                    startIntersection.y,
                    endIntersection.x,
                    endIntersection.y,
                ]}
                stroke={isSelected ? "#ff9900" : "#666"}
                strokeWidth={isSelected ? 3 : 2}
            />
            
            {/* Road name */}
            <Text
                x={midX}
                y={midY}
                text={segment.name}
                fontSize={14}
                fill="#333"
                rotation={angle * (180 / Math.PI)}
                offsetX={-20}
                offsetY={-10}
            />

            {/* Traffic volume indicators */}
            {segment.trafficFlows.map((flow, index) => (
                <Text
                    key={index}
                    x={midX + (index * 20) - 30}
                    y={midY + 20}
                    text={`${flow.vehicleType}: ${flow.volume}`}
                    fontSize={12}
                    fill="#666"
                />
            ))}
        </Group>
    );
}; 