import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import { RoadNetwork, TrafficFlow, Intersection } from "./types/RoadNetwork";

const App: React.FC = () => {
  // Use state to trigger re-renders when network changes
  const [roadNetwork, setRoadNetwork] = useState(() => new RoadNetwork());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleAddIntersection = (x: number, y: number) => {
    console.log('Adding intersection at:', x, y);
    const newNetwork = new RoadNetwork();
    // Copy existing data
    roadNetwork.getAllIntersections().forEach(i => newNetwork.addIntersection(i));
    roadNetwork.getAllRoadSegments().forEach(r => newNetwork.addRoadSegment(r));
    // Add new intersection
    newNetwork.addIntersection({
      id: `i${Date.now()}`,
      x,
      y,
      connectedRoads: [],
      trafficMatrix: {}
    });
    console.log('New network state:', newNetwork);
    setRoadNetwork(newNetwork);
  };

  const handleAddRoadSegment = (startId: string, endId: string, name: string) => {
    console.log('Adding road segment:', { startId, endId, name });
    const newNetwork = new RoadNetwork();
    // Copy existing data
    roadNetwork.getAllIntersections().forEach(i => newNetwork.addIntersection(i));
    roadNetwork.getAllRoadSegments().forEach(r => newNetwork.addRoadSegment(r));
    // Add new road
    newNetwork.addRoadSegment({
      id: `r${Date.now()}`,
      name,
      startIntersectionId: startId,
      endIntersectionId: endId,
      trafficFlows: []
    });
    console.log('New network state:', newNetwork);
    setRoadNetwork(newNetwork);
  };

  const handleUpdateTrafficFlow = (roadId: string, flows: TrafficFlow[]) => {
    console.log('Updating traffic flow:', { roadId, flows });
    const newNetwork = new RoadNetwork();
    roadNetwork.getAllIntersections().forEach(i => newNetwork.addIntersection(i));
    roadNetwork.getAllRoadSegments().forEach(r => {
      if (r.id === roadId) {
        newNetwork.addRoadSegment({ ...r, trafficFlows: flows });
      } else {
        newNetwork.addRoadSegment(r);
      }
    });
    setRoadNetwork(newNetwork);
  };

  const handleUpdateIntersectionMatrix = (intersectionId: string, matrix: Intersection['trafficMatrix']) => {
    console.log('Updating intersection matrix:', { intersectionId, matrix });
    const newNetwork = new RoadNetwork();
    roadNetwork.getAllIntersections().forEach(i => {
      if (i.id === intersectionId) {
        newNetwork.addIntersection({ ...i, trafficMatrix: matrix });
      } else {
        newNetwork.addIntersection(i);
      }
    });
    roadNetwork.getAllRoadSegments().forEach(r => newNetwork.addRoadSegment(r));
    setRoadNetwork(newNetwork);
  };

  const handleDeleteIntersection = (intersectionId: string) => {
    if (window.confirm('Are you sure you want to delete this intersection? This will also remove all connected roads.')) {
      console.log('Deleting intersection:', intersectionId);
      const newNetwork = new RoadNetwork();
      
      // Copy all intersections except the deleted one
      roadNetwork.getAllIntersections()
        .filter(i => i.id !== intersectionId)
        .forEach(i => newNetwork.addIntersection(i));
      
      // Copy all roads that don't connect to the deleted intersection
      roadNetwork.getAllRoadSegments()
        .filter(r => r.startIntersectionId !== intersectionId && r.endIntersectionId !== intersectionId)
        .forEach(r => newNetwork.addRoadSegment(r));
      
      setRoadNetwork(newNetwork);
      setSelectedElementId(null);
    }
  };

  const handleDeleteRoad = (roadId: string) => {
    if (window.confirm('Are you sure you want to delete this road?')) {
      console.log('Deleting road:', roadId);
      const newNetwork = new RoadNetwork();
      
      // Copy all intersections
      roadNetwork.getAllIntersections().forEach(i => newNetwork.addIntersection(i));
      
      // Copy all roads except the deleted one
      roadNetwork.getAllRoadSegments()
        .filter(r => r.id !== roadId)
        .forEach(r => newNetwork.addRoadSegment(r));
      
      setRoadNetwork(newNetwork);
      setSelectedElementId(null);
    }
  };

  const exportDiagram = () => {
    const data = JSON.stringify({
      intersections: roadNetwork.getAllIntersections(),
      roadSegments: roadNetwork.getAllRoadSegments()
    }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "road-network.json";
    link.click();
  };

  console.log('Current network state:', {
    intersections: roadNetwork.getAllIntersections(),
    roadSegments: roadNetwork.getAllRoadSegments(),
    selectedElementId
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar roadNetwork={roadNetwork} />
      <div style={{ flex: 1 }}>
        <Toolbar exportDiagram={exportDiagram} />
        <Canvas 
          roadNetwork={roadNetwork}
          onAddIntersection={handleAddIntersection}
          onAddRoadSegment={handleAddRoadSegment}
          onUpdateTrafficFlow={handleUpdateTrafficFlow}
          onUpdateIntersectionMatrix={handleUpdateIntersectionMatrix}
          onDeleteIntersection={handleDeleteIntersection}
          onDeleteRoad={handleDeleteRoad}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
        />
      </div>
    </div>
  );
};

export default App;
