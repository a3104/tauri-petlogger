import { WeightRepository } from '../repositories/weightRepository';
import { Pet } from '../models/pet';
import PetFileRepository from '../repositories/PetFileRepository';
import ClinicVisitFileRepository from '../repositories/ClinicVisitRepository';
import { Box, Button } from "@mui/material";

const Configuration = () => {

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

    const importPetData = async (fileContent: string) => {
        const petRepository = new PetFileRepository();
        try {
            const pets: Pet[] = JSON.parse(fileContent).map((pet: any) => {
                return Object.assign(new Pet(), pet);
            });
            await petRepository.saveAllPets(pets);
            alert('Pet data imported successfully!');
        } catch (e) {
            alert('Failed to import pet data.');
        }
    };

    const importWeightData = async (fileContent: string) => {
        const weightRepository = new WeightRepository();
        try {
            const weights = JSON.parse(fileContent); // Assuming Weight type is properly handled in WeightRepository
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
            alert('Weight data imported successfully!');
        } catch (e) {
            alert('Failed to import weight data.');
        }
    };

    const importClinicVisitData = async (fileContent: string) => {
        const clinicVisitRepository = new ClinicVisitFileRepository();
        try {
            const clinicVisits = JSON.parse(fileContent);
            await clinicVisitRepository.saveAllClinicVisits(clinicVisits);
            alert('Clinic visit data imported successfully!');
        } catch (e) {
            alert('Failed to import clinic visit data.');
        }
    };

    const exportPetData = async () => {
        const petRepository = new PetFileRepository();
        const pets = await petRepository.getAllPets();
        const json = JSON.stringify(pets, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pets.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportWeightData = async () => {
        const weightRepository = new WeightRepository();
        const weights = await weightRepository.getAllWeights();
        const json = JSON.stringify(weights, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'weights.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportClinicVisitData = async () => {
        const clinicVisitRepository = new ClinicVisitFileRepository();
        const clinicVisits = await clinicVisitRepository.getAllClinicVisits();
        const json = JSON.stringify(clinicVisits, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clinic_visits.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <h1>設定</h1>
            <h3>データ管理</h3>
            <div>
                <Box>
                    <Button component="label" variant="contained" color="primary">
                        ペット情報のimport
                        <input type="file" accept=".json" onChange={(e) => handleFileUpload(e, importPetData)} hidden/>
                    </Button>
                </Box>
                <Box>
                    <Button component="label" variant="contained" color="primary">
                        体重情報のimport
                        <input type="file" accept=".json" onChange={(e) => handleFileUpload(e, importWeightData)} hidden/>
                    </Button>
                </Box>
                <Box>
                    <Button component="label" variant="contained" color="primary">
                        通院記録のimport
                        <input type="file" accept=".json" onChange={(e) => handleFileUpload(e, importClinicVisitData)} hidden/>
                    </Button>
                </Box>
                <Box>
                    <Button variant="contained" color="primary" onClick={exportPetData}>
                        ペット情報のexport
                    </Button>
                </Box>
                <Box>
                    <Button variant="contained" color="primary" onClick={exportWeightData}>
                        体重情報のexport
                    </Button>
                </Box>
                <Box>
                    <Button variant="contained" color="primary" onClick={exportClinicVisitData}>
                        通院記録のexport
                    </Button>
                </Box>
            </div>
        </div>
    );
};

export default Configuration;
