import React, { useState, useEffect, useRef } from 'react';
import PetFileRepository from '../repositories/PetFileRepository';
import ClinicVisitFileRepository from '../repositories/ClinicVisitRepository';
import { Pet } from '../models/pet';
import { ClinicVisit } from '../models/clinicVisit';
import { 
    Box, Autocomplete, TextField, Button, Typography, MenuItem, Select, 
     Dialog, DialogContent, Paper, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, IconButton, FormControl, 
    InputLabel, Card, CardContent, Avatar, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PetsIcon from '@mui/icons-material/Pets';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { v4 as uuidv4 } from 'uuid';
import { confirm } from '@tauri-apps/plugin-dialog';

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
        confirm('本当に削除しますか？').then((isDelete) => {
            if (isDelete) {
                const clinicVisitRepository = new ClinicVisitFileRepository();
                clinicVisitRepository.deleteClinicVisit(visitId).then(() => {
                    if (selectedPetId) {
                        clinicVisitRepository.getClinicVisitsByPetId(selectedPetId).then(setClinicVisits);
                    }
                });
            }
        });
    }

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
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        setNewVisitPhotos(prevPhotos => [...prevPhotos, e.target?.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
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

    const handleDeletePhoto = (index: number) => {
        confirm('画像を削除しますか？').then((isDelete) => {
            if (isDelete) {
                setNewVisitPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
            }
        });

    }


    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Card elevation={3} sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ 
                        borderBottom: '2px solid #3f51b5',
                        pb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'medium'
                    }}>
                        <PetsIcon sx={{ mr: 1 }} /> 通院記録
                    </Typography>

                    <FormControl fullWidth margin="dense" sx={{ mb: 3 }}>
                        <InputLabel id="pet-select-label">ペットを選択してください</InputLabel>
                        <Select
                            labelId="pet-select-label"
                            value={selectedPetId || ''}
                            label="ペットを選択してください"
                            onChange={(e) => setSelectedPetId(Number(e.target.value))}
                            sx={{ '& .MuiSelect-select': { display: 'flex', alignItems: 'center' } }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {pets.map((pet) => (
                                <MenuItem key={pet.id} value={pet.id} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: '#3f51b5' }}>
                                        <PetsIcon fontSize="small" />
                                    </Avatar>
                                    {pet.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {selectedPetId && (
                <Card elevation={3}>
                    <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                                {pets.find((pet) => pet.id === selectedPetId)?.name} の通院記録
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleAddNewVisitClick} 
                                disabled={isAddingNewVisit || isEditingVisit}
                                startIcon={<AddCircleIcon />}
                                sx={{ borderRadius: 2 }}
                            >
                                新規登録
                            </Button>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2}>
                            <TextField
                                label="病状検索"
                                variant="outlined"
                                size="small"
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ width: '250px' }}
                            />
                        </Box>

                        {(isAddingNewVisit || isEditingVisit) && (
                            <Card variant="outlined" sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {isEditingVisit ? '通院記録の編集' : '新規通院記録の追加'}
                                    </Typography>
                                    
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
                                        variant="outlined"
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
                                    
                                    <TextField
                                        label="病状"
                                        value={newVisitCondition}
                                        onChange={(e) => setNewVisitCondition(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        placeholder="病状の詳細を入力してください"
                                    />
                                    
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handlePhotoUpload}
                                            style={{ display: 'block', marginBottom: '10px' }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {newVisitPhotos.length > 0 && `写真 ${newVisitPhotos.length} 枚`}
                                        </Typography>
                                    </Box>
                                    
                                    <Box mt={2} display="flex" flexWrap="wrap">
                                        {newVisitPhotos.map((photo, index) => (
                                            <Box key={index} position="relative" display="inline-block" mr={1} mb={1}>
                                                <img
                                                    src={photo}
                                                    alt={`Visit Photo ${index + 1}`}
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                                                    onClick={() => handleImageClick(photo)}
                                                />
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDeletePhoto(index)}
                                                    style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.7)' }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                    
                                    <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                                        <Button variant="outlined" color="secondary" onClick={handleCancelVisit}>
                                            キャンセル
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={handleSaveVisit}>
                                            保存
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}

                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead sx={{ bgcolor: '#f0f4f8' }}>
                                    <TableRow>
                                        <TableCell><Typography fontWeight="bold">日付</Typography></TableCell>
                                        <TableCell><Typography fontWeight="bold">病院名</Typography></TableCell>
                                        <TableCell><Typography fontWeight="bold">病状</Typography></TableCell>
                                        <TableCell align="right"><Typography fontWeight="bold">操作</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredClinicVisits.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    記録がありません。「新規登録」から記録を追加してください。
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredClinicVisits.map((visit, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>{visit.date}</TableCell>
                                                <TableCell>{visit.hospitalName}</TableCell>
                                                <TableCell>{visit.condition.length > 30 ? `${visit.condition.slice(0, 30)}...` : visit.condition}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton color="primary" size="small" onClick={() => handleEditVisitClick(visit.id)} sx={{ mr: 1 }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton color="error" size="small" onClick={() => handleDeleteVisitClick(visit.id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md">
                <DialogContent>
                    <img src={dialogImage} alt="Enlarged" style={{ width: '100%', height: 'auto' }} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Clinic;
