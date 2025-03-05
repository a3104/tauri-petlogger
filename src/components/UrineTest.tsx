import { useState, useEffect } from 'react';
import PetFileRepository from '../repositories/PetFileRepository';
import UrineTestRepository from '../repositories/UrineTestRepository';
import { Pet } from '../models/pet';
import { UrineTest } from '../models/urineTest';
import { 
    Box, Select, MenuItem, FormControl, InputLabel, TextField, Button,
    Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Divider, Grid, Chip, Avatar
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PetsIcon from '@mui/icons-material/Pets';
import { v4 as uuidv4 } from 'uuid';

const UrineTestComponent = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
    const [urineTests, setUrineTests] = useState<UrineTest[]>([]);
    const [isAddingNewTest, setIsAddingNewTest] = useState<boolean>(false);
    const [newTestDate, setNewTestDate] = useState<string>('');
    const [newTestResult, setNewTestResult] = useState<string>('');
    const [isEditingTest, setIsEditingTest] = useState<boolean>(false);
    const [editingTestData, setEditingTestData] = useState<UrineTest | null>(null);

    useEffect(() => {
        const petRepository = new PetFileRepository();
        petRepository.getAllPets().then(setPets);
    }, []);

    useEffect(() => {
        if (selectedPetId) {
            const urineTestRepository = new UrineTestRepository(selectedPetId);
            urineTestRepository.getAllTests().then(setUrineTests);
        } else {
            setUrineTests([]);
        }
    }, [selectedPetId]);

    const handleAddNewTestClick = () => {
        // 今日の日付をYYYY-MM-DD形式で取得
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        
        // 初期値として今日の日付をセット
        setNewTestDate(formattedDate);
        setIsAddingNewTest(true);
    };

    const handleEditTestClick = (testId: string) => {
        const testToEdit = urineTests.find(test => test.id === testId);
        if (testToEdit) {
            setEditingTestData(testToEdit);
            setIsEditingTest(true);
            setNewTestDate(testToEdit.date);
            setNewTestResult(testToEdit.result);
        }
    };

    const handleDeleteTestClick = (testId: string) => {
        if (!selectedPetId) return;
        const urineTestRepository = new UrineTestRepository(selectedPetId);
        urineTestRepository.deleteUrineTest(testId).then(() => {
            if (selectedPetId) {
                urineTestRepository.getUrineTestsByPetId(selectedPetId).then(setUrineTests);
            }
        });
    };


    const handleSaveTest = async () => {
        if (!selectedPetId) return;
        
        const test: UrineTest = {
            id: isEditingTest && editingTestData ? editingTestData.id : uuidv4(),
            petId: selectedPetId,
            date: newTestDate,
            result: newTestResult,
            image: null,
        };
        const urineTestRepository = new UrineTestRepository(selectedPetId);
        
        try {
            if (isEditingTest) {
                await urineTestRepository.updateUrineTest(test.id, test);
            } else {
                await urineTestRepository.addUrineTest(test);
            }
            
            setIsAddingNewTest(false);
            setIsEditingTest(false);
            setNewTestDate('');
            setNewTestResult('');
            setEditingTestData(null);
            
            // 保存後に最新のデータを再取得
            const updatedTests = await urineTestRepository.getAllTests();
            setUrineTests(updatedTests);
        } catch (error) {
            console.error("保存エラー:", error);
            alert("保存中にエラーが発生しました。");
        }
    };

    const handleCancelTest = () => {
        setIsAddingNewTest(false);
        setIsEditingTest(false);
        setNewTestDate('');
        setNewTestResult('');
        setEditingTestData(null);
    };


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
                        <PetsIcon sx={{ mr: 1 }} /> 尿検査記録
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
                                {pets.find((pet) => pet.id === selectedPetId)?.name} の尿検査記録
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleAddNewTestClick} 
                                disabled={isAddingNewTest}
                                startIcon={<AddCircleIcon />}
                                sx={{ borderRadius: 2 }}
                            >
                                新規登録
                            </Button>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {(isAddingNewTest || isEditingTest) && (
                            <Card variant="outlined" sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {isEditingTest ? '検査記録の編集' : '新規検査記録の追加'}
                                    </Typography>
                                    
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                label="検査日"
                                                type="date"
                                                value={newTestDate}
                                                onChange={(e) => setNewTestDate(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                label="検査結果"
                                                value={newTestResult}
                                                onChange={(e) => setNewTestResult(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                multiline
                                                rows={3}
                                                variant="outlined"
                                                placeholder="検査結果の詳細を入力してください"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                                        <Button 
                                            variant="outlined" 
                                            color="secondary" 
                                            onClick={handleCancelTest}
                                            startIcon={<CancelIcon />}
                                        >
                                            キャンセル
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={handleSaveTest}
                                            startIcon={<SaveIcon />}
                                        >
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
                                        <TableCell width="20%"><Typography fontWeight="bold">検査日</Typography></TableCell>
                                        <TableCell width="60%"><Typography fontWeight="bold">検査結果</Typography></TableCell>
                                        <TableCell width="20%" align="right"><Typography fontWeight="bold">操作</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {urineTests.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    検査記録がありません。「新規登録」から記録を追加してください。
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        urineTests.map((test, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>
                                                    <Chip 
                                                        label={test.date} 
                                                        size="small" 
                                                        variant="outlined"
                                                        sx={{ fontWeight: 'medium' }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                                                    {test.result}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => handleEditTestClick(test.id)}
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => handleDeleteTestClick(test.id)}
                                                        size="small"
                                                    >
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
        </Box>
    );
};

export default UrineTestComponent;
