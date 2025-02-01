import React from "react";
import { RoadNetwork } from "../types/RoadNetwork";

interface Props {
  roadNetwork: RoadNetwork;
}

const Sidebar: React.FC<Props> = ({ roadNetwork }) => {
  const intersections = roadNetwork.getAllIntersections();
  const roadSegments = roadNetwork.getAllRoadSegments();

  return (
    <div style={{ width: "300px", padding: "20px", borderRight: "1px solid #ccc" }}>
      <h2>Network Details</h2>
      
      <h3>Intersections</h3>
      <div style={{ marginBottom: "20px" }}>
        {intersections.map((intersection) => (
          <div key={intersection.id} style={{ marginBottom: "10px" }}>
            <div>ID: {intersection.id}</div>
            <div>Position: ({Math.round(intersection.x)}, {Math.round(intersection.y)})</div>
            <div>Connected Roads: {intersection.connectedRoads.length}</div>
          </div>
        ))}
      </div>

      <h3>Road Segments</h3>
      <div>
        {roadSegments.map((segment) => (
          <div key={segment.id} style={{ marginBottom: "10px" }}>
            <div>Name: {segment.name}</div>
            <div>Traffic Flows:</div>
            <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
              {segment.trafficFlows.map((flow, index) => (
                <li key={index}>
                  {flow.vehicleType}: {flow.volume} ({flow.direction})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
