import { WeightRepository } from '../repositories/weightRepository';
import { Pet } from '../models/pet';
import PetFileRepository from '../repositories/PetFileRepository';
import ClinicVisitFileRepository from '../repositories/ClinicVisitRepository';
import { Box, Button } from "@mui/material";
import { useState } from 'react';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';

export const Configuration = () => {

    const [ setExportPetDataUrl] = useState<string>('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, importFunction: (fileContent: string) => Promise<void>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const fileContent = e.target?.result as string;
                await importFunction(fileContent);
            };
            reader.readAsText(file);
        }
    };

    

    const exportAllData = async () => {
        const petRepository = new PetFileRepository();
        const weightRepository = new WeightRepository();
        const clinicVisitRepository = new ClinicVisitFileRepository();

        const pets = await petRepository.getAllPets();
        const weights = await weightRepository.getAllWeights();
        const clinicVisits = await clinicVisitRepository.getAllClinicVisits();

        const allData = {
            pets: pets,
            weights: weights,
            clinicVisits: clinicVisits
        };

        const json = JSON.stringify(allData, null, 2);
        // const blob = new Blob([json], { type: 'application/force-download' });


        // const url = URL.createObjectURL(blob);
        const filePath = await save({ defaultPath: 'all_data.json' });
        if (filePath) {
            await writeTextFile(filePath, json);
           
        }

    };


    
    const importAllData = async (fileContent: string) => {
        try {
            const allData = JSON.parse(fileContent);
            await importPetDataFromJson(allData.pets);
            await importWeightDataFromJson(allData.weights);
            await importClinicVisitDataFromJson(allData.clinicVisits);
            alert('All data imported successfully!');
        } catch (e) {
            alert('Failed to import all data.');
        }
    };

    const importPetDataFromJson = async (petsJson: Pet[]) => {
        const petRepository = new PetFileRepository();
        try {
            const pets: Pet[] = petsJson.map((pet: any) => {
                return Object.assign(new Pet(), pet);
            });
            await petRepository.saveAllPets(pets);
        } catch (e) {
            alert('Failed to import pet data.');
        }
    };

    const importWeightDataFromJson = async (weightsJson: any) => {
        const weightRepository = new WeightRepository();
        try {
            const weights = weightsJson; // Assuming Weight type is properly handled in WeightRepository
            const weightsByPetId = weights.reduce((acc: { [key: number]: any[] }, weight: { petId: number; date: string; weight: number }) => {
                if (!acc[weight.petId]) {
                    acc[weight.petId] = [];
                }
                acc[weight.petId].push(weight);
                return acc;
            }, {});

            for (const petId in weightsByPetId) {
                await weightRepository.saveWeights(Number(petId), weightsByPetId[petId]);
            }
        } catch (e) {
            alert('Failed to import weight data.');
        }
    };

    const importClinicVisitDataFromJson = async (clinicVisitsJson: any) => {
        const clinicVisitRepository = new ClinicVisitFileRepository();
        try {
            await clinicVisitRepository.saveAllClinicVisits(clinicVisitsJson);
        } catch (e) {
            alert('Failed to import clinic visit data.');
        }
    };


    return (
        <div>
            <h1>設定</h1>
            <h3>データ管理</h3>
            <div>
                <Box>
                    <Button component="label" variant="contained" color="primary">
                        すべてのデータimport
                        <input type="file" accept=".json" onChange={(e) => handleFileUpload(e, importAllData)} hidden />
                    </Button>
                </Box>

                <Box>
                    <Button variant="contained" color="primary" onClick={exportAllData}>
                        すべてのデータexport
                    </Button>
                </Box>
            </div>
        </div>
    );
};

