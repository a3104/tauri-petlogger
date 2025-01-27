import React, { useState, useEffect, useRef } from 'react';
import PetFileRepository from '../repositories/PetFileRepository';
import ClinicVisitFileRepository from '../repositories/ClinicVisitRepository';
import { Pet } from '../models/pet';
import { ClinicVisit } from '../models/clinicVisit';
import { Box, Autocomplete, TextField, Button, Typography, MenuItem, Select, TextareaAutosize, Dialog, DialogContent } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const Clinic = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
    const [clinicVisits, setClinicVisits] = useState<ClinicVisit[]>([]);
    const [isAddingNewVisit, setIsAddingNewVisit] = useState<boolean>(false);
    const [newVisitDate, setNewVisitDate] = useState<string>('');
    const [newVisitHospitalName, setNewVisitHospitalName] = useState<string>('');
    const [newVisitCondition, setNewVisitCondition] = useState<string>('');
    const [newVisitPhotos, setNewVisitPhotos] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [hospitalNames, setHospitalNames] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isEditingVisit, setIsEditingVisit] = useState<boolean>(false);
    const [editingVisitData, setEditingVisitData] = useState<ClinicVisit | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredClinicVisits, setFilteredClinicVisits] = useState<ClinicVisit[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogImage, setDialogImage] = useState<string>('');

    useEffect(() => {
        const petRepository = new PetFileRepository();
        petRepository.getAllPets().then(setPets);
    }, []);

    useEffect(() => {
        if (selectedPetId) {
            const clinicVisitRepository = new ClinicVisitFileRepository();
            clinicVisitRepository.getClinicVisitsByPetId(selectedPetId).then(visits => {
                setClinicVisits(visits);
                setFilteredClinicVisits(visits);
                const names = [...new Set(visits.map(visit => visit.hospitalName))];
                setHospitalNames(names);
            });
        } else {
            setClinicVisits([]);
            setFilteredClinicVisits([]);
            setHospitalNames([]);
        }
    }, [selectedPetId]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = clinicVisits.filter(visit =>
                visit.condition.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredClinicVisits(filtered);
        } else {
            setFilteredClinicVisits(clinicVisits);
        }
    }, [searchTerm, clinicVisits]);

    useEffect(() => {
        if (isAddingNewVisit && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAddingNewVisit]);

    (event: React.ChangeEvent<HTMLSelectElement>) => {
        const petId = event.target.value === "" ? null : parseInt(event.target.value);
        setSelectedPetId(petId);
    };

    const handleAddNewVisitClick = () => {
        setIsAddingNewVisit(true);
    };

    const handleEditVisitClick = (visitId: string) => {
        const visitToEdit = clinicVisits.find(visit => visit.id === visitId);
        if (visitToEdit) {
            setEditingVisitData(visitToEdit);
            setIsEditingVisit(true);
            setNewVisitPhotos(visitToEdit.photos || []);
        }
    };

    const handleDeleteVisitClick = (visitId: string) => {
        if (window.confirm('本当に削除しますか？')) {
            const clinicVisitRepository = new ClinicVisitFileRepository();
            clinicVisitRepository.deleteClinicVisit(visitId).then(() => {
                if (selectedPetId) {
                    clinicVisitRepository.getClinicVisitsByPetId(selectedPetId).then(setClinicVisits);
                }
            });
        }
    };

    const handleSaveVisit = () => {
        if (!selectedPetId) return;
        const visit: ClinicVisit = {
            id: isEditingVisit && editingVisitData ? editingVisitData.id : uuidv4(),
            petId: selectedPetId,
            date: newVisitDate,
            hospitalName: newVisitHospitalName,
            condition: newVisitCondition,
            photos: newVisitPhotos,
        };
        const clinicVisitRepository = new ClinicVisitFileRepository();
        const savePromise = isEditingVisit
            ? clinicVisitRepository.updateClinicVisit(visit)
            : clinicVisitRepository.addClinicVisit(visit);

        savePromise.then(() => {
            setIsAddingNewVisit(false);
            setIsEditingVisit(false);
            setNewVisitDate('');
            setNewVisitHospitalName('');
            setNewVisitCondition('');
            setNewVisitPhotos([]);
            setEditingVisitData(null);
            clinicVisitRepository.getClinicVisitsByPetId(selectedPetId).then(setClinicVisits);
        });
    };

    const handleCancelVisit = () => {
        setIsAddingNewVisit(false);
        setIsEditingVisit(false);
        setNewVisitDate('');
        setNewVisitHospitalName('');
        setNewVisitCondition('');
        setNewVisitPhotos([]);
        setEditingVisitData(null);
    };

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files).map(file => URL.createObjectURL(file));
            setNewVisitPhotos(prevPhotos => prevPhotos.concat(fileArray));
        }
    };

    const handleImageClick = (image: string) => {
        setDialogImage(image);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setDialogImage('');
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                通院記録
            </Typography>

            <Select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value as number)}
                fullWidth
                margin="dense"
            >
                <MenuItem value="">ペットを選択してください</MenuItem>
                {pets.map((pet) => (
                    <MenuItem key={pet.id} value={pet.id}>
                        {pet.name}
                    </MenuItem>
                ))}
            </Select>

            {selectedPetId && (
                <Box mt={2}>
                    <Typography variant="h6" component="h4">
                        {pets.find((pet) => pet.id === selectedPetId)?.name} の通院記録
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Button variant="contained" color="primary" onClick={handleAddNewVisitClick} disabled={isAddingNewVisit}>
                            新規登録
                        </Button>
                        <TextField
                            label="病状検索"
                            variant="outlined"
                            size="small"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ marginLeft: '16px' }}
                        />
                    </Box>

                    {(isAddingNewVisit || isEditingVisit) && (
                        <Box sx={{ mt: 2, mb: 2, p: 2, border: '1px solid grey', borderRadius: '5px' }}>
                            <TextField
                                label="日付"
                                type="date"
                                value={newVisitDate}
                                onChange={(e) => setNewVisitDate(e.target.value)}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputRef={inputRef}
                            />
                            <Autocomplete
                                inputValue={inputValue}
                                options={hospitalNames}
                                freeSolo
                                onInputChange={(_, newInputValue) => {
                                    setInputValue(newInputValue);
                                    setNewVisitHospitalName(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="病院名" variant="outlined" fullWidth margin="normal" />
                                )}
                            />
                            <TextareaAutosize
                                value={newVisitCondition}
                                onChange={(e) => setNewVisitCondition(e.target.value)}
                                style={{ width: '100%', marginTop: '16px', padding: '8px', boxSizing: 'border-box' }}
                                minRows={3}
                                placeholder="病状"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                style={{ display: 'block', marginTop: '16px' }}
                            />
                            <Box mt={2} display="flex" flexWrap="wrap">
                                {newVisitPhotos.map((photo, index) => (
                                    <img key={index} src={photo} alt={`Visit Photo ${index + 1}`} style={{ width: '100px', height: '100px', marginRight: '8px', marginBottom: '8px', cursor: 'pointer' }} onClick={() => handleImageClick(photo)} />
                                ))}
                            </Box>
                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button variant="contained" color="primary" onClick={handleSaveVisit}>
                                    保存
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={handleCancelVisit}>
                                    キャンセル
                                </Button>
                            </Box>
                        </Box>
                    )}

                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>日付</th>
                                <th style={{ fontSize: '0.8em' }}>病院名</th>
                                <th style={{ fontSize: '0.8em' }}>病状</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '0.7em' }}>
                            {filteredClinicVisits.map((visit, index) => (
                                <tr key={index}>
                                    <td>{visit.date}</td>
                                    <td>{visit.hospitalName}</td>
                                    <td>{visit.condition.length > 10 ? `${visit.condition.slice(0, 10)}...` : visit.condition}</td>
                                    <td><Button variant="outlined" color="primary" onClick={() => handleEditVisitClick(visit.id)}>編集</Button>
                                        <Button variant="outlined" color="secondary" onClick={() => handleDeleteVisitClick(visit.id)}>削除</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            )}

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogContent>
                    <img src={dialogImage} alt="Enlarged" style={{ width: '100%', height: 'auto' }} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Clinic;
