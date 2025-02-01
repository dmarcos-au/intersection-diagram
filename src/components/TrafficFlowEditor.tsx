import React, { useState } from "react";
import { TrafficFlow, VehicleType, Direction } from "../types/RoadNetwork";
import { 
  Paper, 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  IconButton,
  Typography,
  Box,
  Stack,
  FormControl,
  InputLabel
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

interface Props {
  flows: TrafficFlow[];
  onUpdate: (flows: TrafficFlow[]) => void;
}

export const TrafficFlowEditor: React.FC<Props> = ({ flows, onUpdate }) => {
  const [newFlow, setNewFlow] = useState<TrafficFlow>({
    vehicleType: 'LV',
    direction: 'through',
    volume: 0
  });

  const handleDeleteFlow = (index: number) => {
    const newFlows = flows.filter((_, i) => i !== index);
    onUpdate(newFlows);
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Traffic Flows</Typography>
      
      <Stack spacing={2}>
        {flows.map((flow, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                value={flow.vehicleType}
                label="Vehicle Type"
                onChange={(e) => {
                  const newFlows = [...flows];
                  newFlows[index] = { ...flow, vehicleType: e.target.value as VehicleType };
                  onUpdate(newFlows);
                }}
              >
                <MenuItem value="Bus">Bus</MenuItem>
                <MenuItem value="HV">Heavy Vehicle</MenuItem>
                <MenuItem value="LV">Light Vehicle</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Direction</InputLabel>
              <Select
                value={flow.direction}
                label="Direction"
                onChange={(e) => {
                  const newFlows = [...flows];
                  newFlows[index] = { ...flow, direction: e.target.value as Direction };
                  onUpdate(newFlows);
                }}
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="through">Through</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              type="number"
              label="Volume"
              value={flow.volume}
              onChange={(e) => {
                const newFlows = [...flows];
                newFlows[index] = { ...flow, volume: parseInt(e.target.value) || 0 };
                onUpdate(newFlows);
              }}
              sx={{ width: 100 }}
            />

            <IconButton 
              color="error" 
              onClick={() => handleDeleteFlow(index)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Vehicle Type</InputLabel>
            <Select
              value={newFlow.vehicleType}
              label="Vehicle Type"
              onChange={(e) => setNewFlow({ ...newFlow, vehicleType: e.target.value as VehicleType })}
            >
              <MenuItem value="Bus">Bus</MenuItem>
              <MenuItem value="HV">Heavy Vehicle</MenuItem>
              <MenuItem value="LV">Light Vehicle</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Direction</InputLabel>
            <Select
              value={newFlow.direction}
              label="Direction"
              onChange={(e) => setNewFlow({ ...newFlow, direction: e.target.value as Direction })}
            >
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="through">Through</MenuItem>
              <MenuItem value="right">Right</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="number"
            label="Volume"
            value={newFlow.volume}
            onChange={(e) => setNewFlow({ ...newFlow, volume: parseInt(e.target.value) || 0 })}
            sx={{ width: 100 }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              onUpdate([...flows, newFlow]);
              setNewFlow({ vehicleType: 'LV', direction: 'through', volume: 0 });
            }}
            size="small"
          >
            Add
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}; 