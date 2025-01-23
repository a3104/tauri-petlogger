import { WeightRepository } from '../repositories/weightRepository';
import { Pet } from '../models/pet';
import PetFileRepository from '../repositories/PetFileRepository';
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

    return (
        <div>
            <h1>設定</h1>
            <h3>データ管理</h3>
            <div>
                {/* <button onClick={exportPetData}>Export Pet Data</button> */}
                <Box>
                    <Button component="label" variant="contained" color="primary">
                        ペット情報のimport
                        <input type="file" accept=".json" onChange={(e) => handleFileUpload(e, importPetData)} hidden/>
                    </Button>
                </Box>
                {/* <button onClick={exportWeightData}>Export Weight Data</button> */}
                <Box>
                    <Button component="label" variant="contained" color="primary">
                        体重情報のimport
                        <input type="file" accept=".json" onChange={(e) => handleFileUpload(e, importWeightData)} hidden/>
                    </Button>
                </Box>
                
            </div>
        </div>
    );
};

export default Configuration;
