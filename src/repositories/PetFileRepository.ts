// import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import { IPetRepository } from './PetRepository';
import { Pet } from '../models/pet';
import { invoke } from '@tauri-apps/api/core';


async function load_pets(): Promise<string> {
    return await invoke("load_pets");
}

class PetFileRepository implements IPetRepository {
    private fileName: string;

    constructor() {
        this.fileName = 'pets_data.json';
        console.log(this.fileName);
    }
    async saveAllPets(pets: Pet[]): Promise<void> {
        let jsonData = JSON.stringify(pets);
        await invoke("save_pets", { petsJson: jsonData }).then((res) => {
            console.log(res);

        }).catch((err) => {
            console.error(err);
            alert(err);
        });


        // writeTextFile(this.fileName, jsonData);
        return Promise.resolve();
    }

    async getAllPets(): Promise<Pet[]> {
        try {
            const res = await load_pets();
            // alert(res);
            console.log(res);
            let pets = JSON.parse(res);
            let pets2: Pet[] = pets.map((pet: any) => {
                // alert(pet.id);
                console.log(pet);
                let p: Pet = Object.assign(new Pet(), pet);
                return p
            });
            console.log(pets2);
            return pets2 as Pet[];
        } catch (err) {
            console.error(err);
            alert(err);
            return [] as Pet[];
        }
    }

    async getPetById(id: number): Promise<Pet | null> {
        const pets = await this.getAllPets();
        return pets.find(pet => pet.id === id) || null;
    }

    async addPet(pet: Pet): Promise<void> {
        const pets = await this.getAllPets();
        pets.push(pet);
        await this.saveAllPets(pets);
    }

    async updatePet(pet: Pet): Promise<void> {
        const pets = await this.getAllPets();
        const index = pets.findIndex(p => p.id === pet.id);
        if (index !== -1) {
            pets[index] = pet;
        }
        await this.saveAllPets(pets);
    }

    async deletePet(id: number): Promise<void> {
        let pets = await this.getAllPets();
        pets = pets.filter(pet => pet.id !== id);
        await this.saveAllPets(pets);
    }

}


export default PetFileRepository;
