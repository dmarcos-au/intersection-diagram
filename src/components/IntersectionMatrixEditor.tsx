import React from "react";
import { Intersection, VehicleType } from "../types/RoadNetwork";

interface Props {
  intersection: Intersection;
  onUpdate: (matrix: Intersection['trafficMatrix']) => void;
}

export const IntersectionMatrixEditor: React.FC<Props> = ({ intersection, onUpdate }) => {
  const handleVolumeChange = (fromRoadId: string, toRoadId: string, vehicleType: VehicleType, value: number) => {
    const newMatrix = { ...intersection.trafficMatrix };
    if (!newMatrix[fromRoadId]) {
      newMatrix[fromRoadId] = {};
    }
    if (!newMatrix[fromRoadId][toRoadId]) {
      newMatrix[fromRoadId][toRoadId] = { Bus: 0, HV: 0, LV: 0 };
    }
    newMatrix[fromRoadId][toRoadId][vehicleType] = value;
    onUpdate(newMatrix);
  };

  return (
    <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "white" }}>
      <h4>Turning Movement Volumes</h4>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={headerStyle}>From → To</th>
              {intersection.connectedRoads.map(road => (
                <th key={road.id} style={headerStyle}>{road.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {intersection.connectedRoads.map(fromRoad => (
              <tr key={fromRoad.id}>
                <td style={cellStyle}><strong>{fromRoad.name}</strong></td>
                {intersection.connectedRoads.map(toRoad => (
                  <td key={toRoad.id} style={cellStyle}>
                    {fromRoad.id !== toRoad.id && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        {(['Bus', 'HV', 'LV'] as VehicleType[]).map(vehicleType => (
                          <div key={vehicleType} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <label style={{ minWidth: "40px" }}>{vehicleType}:</label>
                            <input
                              type="number"
                              min="0"
                              value={intersection.trafficMatrix[fromRoad.id]?.[toRoad.id]?.[vehicleType] || 0}
                              onChange={(e) => handleVolumeChange(
                                fromRoad.id,
                                toRoad.id,
                                vehicleType,
                                parseInt(e.target.value) || 0
                              )}
                              style={inputStyle}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  padding: "8px",
  backgroundColor: "#f5f5f5",
  borderBottom: "2px solid #ddd",
  textAlign: "left"
};

const cellStyle: React.CSSProperties = {
  padding: "8px",
  border: "1px solid #ddd"
};

const inputStyle: React.CSSProperties = {
  width: "60px",
  padding: "4px",
  border: "1px solid #ddd",
  borderRadius: "4px"
}; 