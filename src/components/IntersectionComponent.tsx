import React from "react";
import { Group, Circle, Text } from "react-konva";
import { Intersection } from "../types/RoadNetwork";

interface Props {
    intersection: Intersection;
    isSelected: boolean;
    onClick: () => void;
}

export const IntersectionComponent: React.FC<Props> = ({
    intersection,
    isSelected,
    onClick,
}) => {
    return (
        <Group
            onClick={(e) => {
                e.cancelBubble = true; // Prevent stage click
                onClick();
            }}
        >
            <Circle
                x={intersection.x}
                y={intersection.y}
                radius={8}
                fill={isSelected ? "#ff9900" : "#333"}
                stroke="#000"
                strokeWidth={2}
            />
            
            {/* Traffic matrix display when selected */}
            {isSelected && Object.entries(intersection.trafficMatrix).map(([fromRoadId, toRoads], i) => (
                Object.entries(toRoads).map(([toRoadId, volumes], j) => (
                    <Text
                        key={`${fromRoadId}-${toRoadId}`}
                        x={intersection.x + 15}
                        y={intersection.y + (i * 60) + (j * 20)}
                        text={`${fromRoadId} → ${toRoadId}: ${JSON.stringify(volumes)}`}
                        fontSize={11}
                        fill="#333"
                    />
                ))
            ))}
        </Group>
    );
}; 