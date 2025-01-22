"use client";
import { Button, TextField, Select, MenuItem, InputLabel, Box, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { Pet } from "../models/pet";


export default function Register({ isVisible, pet, handleUpdate, hideRegister }: { isVisible: boolean, pet: Pet, handleUpdate: (pet: Pet) => void, hideRegister: () => void }) {
    const [visible, setVisible] = useState(isVisible);

    const handleCancel = () => {
        hideRegister();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let form = new FormData(event.currentTarget);

        let petData = new Pet(
            pet.id,
            form.get("name") as string,
            Number(form.get("type") as string),
            Number(form.get("birthYear")),
            Number(form.get("birthMonth")),
            Number(form.get("birthDay")),
            Number(form.get("gender")),
            Number(form.get("targetWeight"))
        );
        handleUpdate(petData);
        setVisible(false);
    };

    return (
        visible && (
            <form onSubmit={handleSubmit}>
                <Box sx={{ maxWidth: 500, mx: "auto", p: 3, boxShadow: 3, borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom>ペット登録</Typography>
                    <TextField
                        label="名前"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        name="name"
                        defaultValue={pet.name}
                        required
                    />
                    <InputLabel>ペット種別</InputLabel>
                    <Select
                        name="type"
                        defaultValue={pet.type}
                        fullWidth
                        margin="dense"
                    >
                        <MenuItem value="1">猫</MenuItem>
                        <MenuItem value="2">犬</MenuItem>
                        <MenuItem value="3">その他</MenuItem>
                    </Select>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <TextField
                            label="誕生年"
                            type="number"
                            fullWidth
                            margin="dense"
                            name="birthYear"
                            defaultValue={pet.birthYear}
                        />
                        <TextField
                            label="誕生月"
                            type="number"
                            fullWidth
                            margin="dense"
                            name="birthMonth"
                            defaultValue={pet.birthMonth}
                        />
                        <TextField
                            label="誕生日"
                            type="number"
                            fullWidth
                            margin="dense"
                            name="birthDay"
                            defaultValue={pet.birthDay}
                        />
                    </Box>
                    <InputLabel>性別</InputLabel>
                    <Select
                        name="gender"
                        defaultValue={pet.gender}
                        fullWidth
                        margin="dense"
                    >
                        <MenuItem value={1}>オス</MenuItem>
                        <MenuItem value={2}>メス</MenuItem>
                        <MenuItem value={0}>登録しない</MenuItem>
                    </Select>
                    <TextField
                        label="目標体重"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="targetWeight"
                        defaultValue={pet.targetWeight}
                        type="number"
                    />
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>登録</Button>
                        <Button variant="outlined" color="secondary" fullWidth onClick={handleCancel}>キャンセル</Button>
                    </Box>
                </Box>
            </form>
        )
    );
}
