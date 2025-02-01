import React, { useState } from 'react';
import { Html } from 'react-konva-utils';

interface Props {
  intersection: {
    id: number;
    x: number;
    y: number;
    lanes: Array<{
      direction: 'N' | 'S' | 'E' | 'W';
      trafficVolume: number;
    }>;
  };
  onUpdate: (id: number, lanes: Array<{ direction: 'N' | 'S' | 'E' | 'W'; trafficVolume: number }>) => void;
}

const isValidDirection = (value: string): value is 'N' | 'S' | 'E' | 'W' => 
  ['N', 'S', 'E', 'W'].includes(value);

const IntersectionEditor: React.FC<Props> = ({ intersection, onUpdate }) => {
  const addLane = () => {
    const newLanes = [...intersection.lanes, { direction: 'N', trafficVolume: 0 }];
    onUpdate(intersection.id, newLanes as Array<{ direction: 'N' | 'S' | 'E' | 'W'; trafficVolume: number }>);
  };

  const updateLane = (index: number, field: 'direction' | 'trafficVolume', value: string | number) => {
    const newLanes = intersection.lanes.map((lane, i) => {
      if (i !== index) return lane;
      if (field === 'direction' && !isValidDirection(value as string)) return lane;
      return {
        ...lane,
        [field]: field === 'direction' ? value : Number(value)
      };
    });
    onUpdate(intersection.id, newLanes);
  };

  return (
    <Html
      divProps={{
        style: {
          position: 'absolute',
          left: intersection.x + 30,
          top: intersection.y - 60,
          background: 'white',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 0 5px rgba(0,0,0,0.2)'
        }
      }}
    >
      <div>
        <button onClick={addLane}>Add Lane</button>
        {intersection.lanes.map((lane, index) => (
          <div key={index} style={{ marginTop: '10px' }}>
            <select
              value={lane.direction}
              onChange={(e) => updateLane(index, 'direction', e.target.value as 'N' | 'S' | 'E' | 'W')}
            >
              <option value="N">North</option>
              <option value="S">South</option>
              <option value="E">East</option>
              <option value="W">West</option>
            </select>
            <input
              type="number"
              value={lane.trafficVolume}
              onChange={(e) => updateLane(index, 'trafficVolume', parseInt(e.target.value))}
              style={{ marginLeft: '5px', width: '60px' }}
            />
            <span style={{ marginLeft: '5px' }}>vph</span>
          </div>
        ))}
      </div>
    </Html>
  );
};

export default IntersectionEditor; 