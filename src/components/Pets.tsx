
import { Button, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
// import { PetInterface } from "../models/pet";
import { Pet } from "../models/pet";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Register from "./Register";
import { confirm } from "@tauri-apps/plugin-dialog";
import PetFileRepository from "../repositories/PetFileRepository";



export const Pets = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const petRepository = new PetFileRepository();

    useEffect(() => {
        petRepository.getAllPets().then((fetchedPets) => {
            // alert(JSON.stringify(fetchedPets));
            console.log(fetchedPets);
            setPets(fetchedPets);
        }).catch((err) => {
            console.error(err);
        });
        }, []);

    const handleEdit = (pet: Pet) => {
        setSelectedPet(pet);
    };
    const hideRegister = () => {
        setSelectedPet(null);
    }


    const handleDelete = async (petId: number) => {
        let updatedPets = pets.filter(pet => pet.id !== petId);
        setPets(updatedPets);
        await petRepository.saveAllPets(updatedPets);
    };

    const handleNew = () => {
        setSelectedPet(new Pet(0));
    };
    const handleUpdate = async (pet: Pet) => {
        let updatedPets: Pet[];
        if (pet.id === 0) {
            const maxId = pets.reduce((max, p) => Math.max(max, p.id), 0);
            pet.id = maxId + 1;
            updatedPets = [...pets, pet];
        } else {
            updatedPets = pets.map(p => p.id === pet.id ? pet : p);
        }
        setPets(updatedPets);
        await petRepository.saveAllPets(updatedPets);
        setSelectedPet(null);
    }

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom>ペット一覧</Typography>
            <Button variant="contained" color="primary" onClick={handleNew}>新規登録</Button>
            {selectedPet && <Register isVisible={true} pet={selectedPet} handleUpdate={handleUpdate}
                hideRegister={hideRegister} />}
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="body2">id</Typography></TableCell>
                            <TableCell><Typography variant="body2">名前</Typography></TableCell>
                            <TableCell><Typography variant="body2">種別</Typography></TableCell>
                            <TableCell><Typography variant="body2">年齢</Typography></TableCell>
                            {/* <TableCell><Typography variant="body2">誕生日</Typography></TableCell> */}
                            <TableCell><Typography variant="body2">性別</Typography></TableCell>
                            <TableCell><Typography variant="body2">体重</Typography></TableCell>
                            <TableCell><Typography variant="body2">操作</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pets && pets[0] && pets[0].id && pets.map((pet) => {
                            const isOverWeight = pet.targetWeight !== null && pet.targetWeight !== 0 && pet.latestWeight > pet.targetWeight;
                            return (
                            <TableRow key={pet.id} style={{ backgroundColor: isOverWeight ? 'orange' : 'inherit' }}>
                                <TableCell><Typography variant="body2">{pet.id}</Typography></TableCell>
                                <TableCell><Typography variant="body2">{pet.name}</Typography></TableCell>
                                <TableCell><Typography variant="body2">{pet.getAnimalType()}</Typography></TableCell>
                                <TableCell><Typography variant="body2">{pet.getAge()}才</Typography></TableCell>
                                {/* <TableCell><Typography variant="body2">{pet.birthYear}年{pet.birthMonth}月{pet.birthDay}日</Typography></TableCell> */}
                                <TableCell><Typography variant="body2">{pet.gender === 1 ? "オス" : pet.gender === 2 ? "メス" : "-"}</Typography></TableCell>
                                <TableCell><Typography variant="body2" >{pet.latestWeight ? `${pet.latestWeight} kg` : '-'}</Typography></TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" size="small"
                                        onClick={() => handleEdit(pet)}>編集</Button>
                                    <Button variant="outlined" color="secondary" size="small"
                                        onClick={async () => {
                                            let r = await confirm("本当に削除しますか？");
                                            r && handleDelete(pet.id);
                                        }}>削除</Button>
                                </TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Pets;
