"use client";

import { useState, useEffect, useRef } from "react";
import { Pet } from "../models/pet";
import { TextField, Button, Box, Typography, MenuItem, Select } from "@mui/material";
import PetFileRepository from "../repositories/PetFileRepository";
import { weightRepository } from "../repositories/weightRepository";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface WeightRecord {
  petId: number;
  date: string;
  weight: number;
}

export default function AddWeights() {
  const [pets, setPets] = useState<Pet[]>([] as Pet[]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const weightInputRef = useRef<HTMLInputElement>(null);
  const petRepository = new PetFileRepository();
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      let allPets = await petRepository.getAllPets();
      setPets(allPets);
      if (allPets.length > 0) {
        setSelectedPetId(allPets[0].id);
      }
    };
    fetchPets();
  }, []);

  useEffect(() => {
    if (weightInputRef.current) {
      weightInputRef.current.focus();
    }
  }, []);

  

  const handleAddWeight = () => {
    if (weight !== null && date && selectedPetId !== null) {
      const newRecord: WeightRecord = { petId: Number(selectedPetId), date, weight };
      const updatedRecords = weightRecords.map(record =>
        record.date === date ? newRecord : record
      );
      // 日付が同じ場合は上書き、そうでない場合は追加
      if (!updatedRecords.some(record => record.date === date)) {
        updatedRecords.push(newRecord);
      }
      setWeightRecords(updatedRecords);
      weightRepository.saveWeights(Number(selectedPetId), updatedRecords);
      setWeight(null);
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleShowChart = () => {
    setShowChart(!showChart);
  };

  const chartData = {
    labels: weightRecords.map(record => record.date),
    datasets: [
      {
        label: '体重 (kg)',
        data: weightRecords.map(record => record.weight),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        ペットの体重記録
      </Typography>
      <Select
        value={selectedPetId}
        onChange={(e) => setSelectedPetId(e.target.value as number)}
        fullWidth
        margin="dense"
      >
        {pets.map((pet) => (
          <MenuItem key={pet.id} value={pet.id}>
            {pet.name}
          </MenuItem>
        ))}
      </Select>
      {!showChart && (
        <>
          <TextField
            label="日付"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="体重 (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value === "" ? null : Number(e.target.value))}
            fullWidth
            margin="normal"
            inputRef={weightInputRef}
          />
          
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleAddWeight}>
              追加
            </Button>
          </Box>
        </>
      )}
      <Box mt={2}>
        <Button variant="contained" color="secondary" onClick={handleShowChart}>
          {showChart ? 'チャートを隠す' : 'チャートを表示'}
        </Button>
      </Box>
      {showChart && (
        <Box mt={2}>
          <Line data={chartData} />
        </Box>
      )}
      <Box mt={2}>
        <Typography variant="h6" component="h3">
          記録一覧
        </Typography>
        {weightRecords.map((record, index) => (
          <Box key={index} display="flex" justifyContent="space-between" mt={1}>
            <Typography>{record.date}</Typography>
            <Typography>{record.weight} kg</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
