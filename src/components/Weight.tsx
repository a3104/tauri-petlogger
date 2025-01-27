"use client";

import { useState, useEffect, useRef } from "react";
import React from 'react';
import { Pet } from "../models/pet";
import { TextField, Button, Box, Typography, MenuItem, Select } from "@mui/material";
import PetFileRepository from "../repositories/PetFileRepository";
import { WeightRepository } from "../repositories/weightRepository";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { ScriptableLineSegmentContext } from 'chart.js';

interface WeightRecord {
    petId: number;
    date: string;
    weight: number;
}

import { Modal } from "@mui/material";

export default function AddWeights() {
    const [pets, setPets] = useState<Pet[]>([] as Pet[]);
    const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
    const weightInputRef = useRef<HTMLInputElement>(null);
    const petRepository = new PetFileRepository();
    const weightRepository = new WeightRepository(); // 追加
    const [showChart, setShowChart] = useState(false);
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
    const [targetWeight, setTargetWeight] = useState<number | null>(null);

    const handleDeleteImage = async () => {
        if (selectedPetId !== null) {
            const currentPet = await petRepository.getPetById(selectedPetId);
            if (currentPet) {
                const updatedPet = Object.assign(new Pet(), { ...currentPet, imageUrl: null });
                const updatedPets = pets.map(pet =>
                    pet.id === selectedPetId ? updatedPet : pet
                );
                setPets(updatedPets);
                await petRepository.updatePet(updatedPet);
            }
        }
    };

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

    useEffect(() => {
        if (selectedPetId !== null) {
            const fetchWeights = async () => {
                const records = await weightRepository.getWeights(Number(selectedPetId));
                setWeightRecords(records);
            };
            fetchWeights();
        }
    }, [selectedPetId]);

    useEffect(() => {
        const fetchTargetWeight = async () => {
            if (selectedPetId !== null) {
                const pet = pets.find(p => p.id === selectedPetId);
                if (pet) {
                    setTargetWeight(pet.targetWeight || null);
                }
            }
        };
        fetchTargetWeight();
    }, [selectedPetId, pets]);

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
            setDate(new Date().toISOString().slice(0, 10));
        }
    };

    const handleDeleteWeight = (date: string) => {
        if (selectedPetId !== null) {
            const updatedRecords = weightRecords.filter(record => record.date !== date);
            setWeightRecords(updatedRecords);
            weightRepository.saveWeights(Number(selectedPetId), updatedRecords);
        }
    };

    const handleShowChart = () => {
        setShowChart(!showChart);
    };

    const reversedWeightRecordsForChart = [...weightRecords].reverse();

    const chartData = {
        labels: reversedWeightRecordsForChart.map(record => record.date),
        datasets: [
            {
                label: '体重 (kg)',
                data: reversedWeightRecordsForChart.map(record => record.weight),
                borderColor:  targetWeight ? reversedWeightRecordsForChart.map(record =>
                    record.weight > targetWeight ? 'rgba(255,0,0,1)' : 'rgba(75,192,192,1)'
                ) : 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                segment: {
                    borderColor: (ctx: ScriptableLineSegmentContext) => {
                        const weight = ctx.p0.parsed.y as number;
                        return targetWeight && weight > targetWeight ? 'rgba(255,0,0,1)' : 'rgba(75,192,192,1)';
                    }
                }
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
                {pets.map((pet) =>
                    <MenuItem key={pet.id} value={pet.id}>
                        {pet.name}
                    </MenuItem>
                )}
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
            {selectedPetId !== null && (() => {
                const pet = pets.find(p => p.id === selectedPetId);
                return pet && pet.imageUrl ? (
                    <div>
                        <img style={{ width: 100, height: 100, cursor: 'pointer' }} src={pet.imageUrl} alt={pet.name} onClick={() => setEnlargedImage(pet.imageUrl)} />
                        <Button variant="outlined" color="secondary" onClick={handleDeleteImage} style={{ marginLeft: 8 }}>
                            画像を削除
                        </Button>
                    </div>
                ) : null;
            })()}
                <Typography variant="h6" component="h3">
                    記録一覧
                </Typography>
                {weightRecords
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).reverse()
                    .map((record, index) => (
                        <><Box key={index} display="flex" justifyContent="space-between" mt={1}>
                            <Typography>{record.date}</Typography>
                            <Typography
                                style={{ color: targetWeight && record.weight > targetWeight ? 'orange' : 'inherit' }}
                            >
                                {record.weight} kg
                            </Typography>

                            <Button variant="outlined" color="secondary" onClick={() => handleDeleteWeight(record.date)}>
                                削除
                            </Button>
                        </Box><React.Fragment>
                                <Box>
                                    <Modal open={!!enlargedImage} onClose={() => setEnlargedImage(null)}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                                            {enlargedImage && (
                                                <>
                                                    <img src={enlargedImage} alt="Enlarged" style={{ maxWidth: '90%', maxHeight: '90%' }} />
                                                    <Button variant="contained" color="secondary" onClick={handleDeleteImage} style={{ marginTop: 8 }}>
                                                        画像を削除
                                                    </Button>
                                                </>
                                            )}
                                        </Box>
                                    </Modal>
                                </Box>
                            </React.Fragment></>
                    ))}
            </Box>
        </Box>
    );
}
