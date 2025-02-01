import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Group, Text, Arrow } from "react-konva";
import { RoadNetwork, Intersection, RoadSegment, TrafficFlow } from "../types/RoadNetwork";
import { RoadSegmentComponent } from "./RoadSegmentComponent";
import { IntersectionComponent } from "./IntersectionComponent";
import { TrafficFlowEditor } from './TrafficFlowEditor';
import { IntersectionMatrixEditor } from './IntersectionMatrixEditor';
import { Paper, Typography, Button, Box, IconButton } from "@mui/material";
import { Delete as DeleteIcon, ZoomIn, ZoomOut, PanTool } from "@mui/icons-material";

interface Props {
    roadNetwork: RoadNetwork;
    onAddIntersection: (x: number, y: number) => void;
    onAddRoadSegment: (startId: string, endId: string, name: string) => void;
    onUpdateTrafficFlow: (roadId: string, flows: TrafficFlow[]) => void;
    onUpdateIntersectionMatrix: (intersectionId: string, matrix: Intersection['trafficMatrix']) => void;
    onDeleteIntersection: (id: string) => void;
    onDeleteRoad: (id: string) => void;
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
}

const Canvas: React.FC<Props> = ({
    roadNetwork,
    onAddIntersection,
    onAddRoadSegment,
    onUpdateTrafficFlow,
    onUpdateIntersectionMatrix,
    onDeleteIntersection,
    onDeleteRoad,
    selectedElementId,
    onSelectElement,
}) => {
    const [isDrawingRoad, setIsDrawingRoad] = useState(false);
    const [roadStartIntersectionId, setRoadStartIntersectionId] = useState<string | null>(null);
    const stageRef = useRef<any>(null);
    
    // Add new state for stage transform
    const [stageScale, setStageScale] = useState(1);
    const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);

    console.log('Canvas render state:', {
        isDrawingRoad,
        roadStartIntersectionId,
        selectedElementId,
        intersectionCount: roadNetwork.getAllIntersections().length,
        roadCount: roadNetwork.getAllRoadSegments().length
    });

    // Handle zoom
    const handleWheel = (e: any) => {
        e.evt.preventDefault();
        
        const stage = stageRef.current;
        const oldScale = stageScale;
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stagePosition.x) / oldScale,
            y: (pointer.y - stagePosition.y) / oldScale,
        };

        // Handle zoom with mouse wheel
        const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;
        
        // Limit zoom level
        const limitedScale = Math.max(0.1, Math.min(newScale, 5));

        setStageScale(limitedScale);
        
        const newPos = {
            x: pointer.x - mousePointTo.x * limitedScale,
            y: pointer.y - mousePointTo.y * limitedScale,
        };
        
        setStagePosition(newPos);
    };

    // Handle pan
    const handleDragStart = () => {
        if (isPanning) {
            setStagePosition({
                x: stageRef.current.x(),
                y: stageRef.current.y(),
            });
        }
    };

    const handleDragMove = () => {
        if (isPanning) {
            setStagePosition({
                x: stageRef.current.x(),
                y: stageRef.current.y(),
            });
        }
    };

    // Convert screen coordinates to stage coordinates
    const getRelativePointerPosition = (stage: any) => {
        const transform = stage.getAbsoluteTransform().copy();
        transform.invert();
        const pos = stage.getPointerPosition();
        return transform.point(pos);
    };

    const handleIntersectionClick = (intersectionId: string) => {
        console.log('Intersection clicked:', intersectionId);
        if (isDrawingRoad && roadStartIntersectionId) {
            console.log('Finishing road connection');
            if (roadStartIntersectionId !== intersectionId) {
                const roadName = prompt("Enter road name:");
                if (roadName) {
                    onAddRoadSegment(roadStartIntersectionId, intersectionId, roadName);
                }
            }
            setIsDrawingRoad(false);
            setRoadStartIntersectionId(null);
            onSelectElement(null);
        } else {
            console.log('Starting road connection');
            setIsDrawingRoad(true);
            setRoadStartIntersectionId(intersectionId);
            onSelectElement(intersectionId);
        }
    };

    // Update click handler to use relative coordinates
    const handleStageClick = (e: any) => {
        if (!isPanning && e.target === e.target.getStage()) {
            const stage = e.target.getStage();
            const pos = getRelativePointerPosition(stage);
            if (pos) {
                onAddIntersection(pos.x, pos.y);
                setIsDrawingRoad(false);
                setRoadStartIntersectionId(null);
                onSelectElement(null);
            }
        }
    };

    return (
        <div style={{ 
            position: 'relative', 
            height: 'calc(100vh - 64px)', // Subtract header height if you have one
            overflow: 'hidden' 
        }}>
            {/* Instructions panel - keep at top left */}
            <Paper
                elevation={3}
                sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: 1000,
                    p: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
            >
                <Typography variant="body2">
                    {isDrawingRoad ? 
                        'Click another intersection to create a road'
                        : 
                        <>
                            Click anywhere to add an intersection<br/>
                            Click an intersection to start drawing a road
                        </>
                    }
                </Typography>
            </Paper>

            {/* Move zoom controls to top right, above the editor panel */}
            <Paper
                elevation={3}
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: selectedElementId ? 420 : 10, // Move aside if editor is open
                    zIndex: 1000,
                    display: 'flex',
                    gap: 1,
                    p: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
            >
                <IconButton
                    onClick={() => setStageScale(scale => Math.min(scale * 1.2, 5))}
                    size="small"
                    title="Zoom In"
                >
                    <ZoomIn />
                </IconButton>
                <IconButton
                    onClick={() => setStageScale(scale => Math.max(scale / 1.2, 0.1))}
                    size="small"
                    title="Zoom Out"
                >
                    <ZoomOut />
                </IconButton>
                <IconButton
                    onClick={() => setIsPanning(!isPanning)}
                    color={isPanning ? "primary" : "default"}
                    size="small"
                    title="Pan Tool"
                >
                    <PanTool />
                </IconButton>
            </Paper>

            <Stage
                ref={stageRef}
                width={window.innerWidth * 0.8}
                height={window.innerHeight - 64} // Subtract header height
                onClick={handleStageClick}
                onWheel={handleWheel}
                scaleX={stageScale}
                scaleY={stageScale}
                x={stagePosition.x}
                y={stagePosition.y}
                draggable={isPanning}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                style={{ cursor: isPanning ? 'grab' : 'default' }}
            >
                <Layer>
                    {/* Render road segments */}
                    {roadNetwork.getAllRoadSegments().map((segment) => (
                        <RoadSegmentComponent
                            key={segment.id}
                            segment={segment}
                            startIntersection={roadNetwork.getIntersection(segment.startIntersectionId)!}
                            endIntersection={roadNetwork.getIntersection(segment.endIntersectionId)!}
                            isSelected={selectedElementId === segment.id}
                            onClick={() => onSelectElement(segment.id)}
                        />
                    ))}

                    {/* Render intersections */}
                    {roadNetwork.getAllIntersections().map((intersection) => (
                        <IntersectionComponent
                            key={intersection.id}
                            intersection={intersection}
                            isSelected={selectedElementId === intersection.id}
                            onClick={() => handleIntersectionClick(intersection.id)}
                        />
                    ))}
                </Layer>
            </Stage>
            
            {selectedElementId && (
                <Paper
                    elevation={3}
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 400,
                        maxHeight: 'calc(100vh - 84px)', // Leave some padding
                        overflowY: 'auto',
                        p: 2,
                        zIndex: 1000
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            {roadNetwork.getRoadSegment(selectedElementId) ? 'Road Properties' : 'Intersection Properties'}
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => {
                                if (roadNetwork.getRoadSegment(selectedElementId)) {
                                    onDeleteRoad(selectedElementId);
                                } else {
                                    onDeleteIntersection(selectedElementId);
                                }
                            }}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Box>
                    
                    {roadNetwork.getRoadSegment(selectedElementId) && (
                        <TrafficFlowEditor
                            flows={roadNetwork.getRoadSegment(selectedElementId)!.trafficFlows}
                            onUpdate={(flows) => onUpdateTrafficFlow(selectedElementId, flows)}
                        />
                    )}
                    {roadNetwork.getIntersection(selectedElementId) && (
                        <IntersectionMatrixEditor
                            intersection={roadNetwork.getIntersection(selectedElementId)!}
                            onUpdate={(matrix) => onUpdateIntersectionMatrix(selectedElementId, matrix)}
                        />
                    )}
                </Paper>
            )}
        </div>
    );
};

export default Canvas;
