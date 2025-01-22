// import { writeTextFile, readTextFile, BaseDirectory,mkdir,exists } from '@tauri-apps/plugin-fs';

import { IPetRepository } from './PetRepository';
import { Pet } from '../models/pet';
// import { invoke } from '@tauri-apps/api/core';
import { LazyStore } from '@tauri-apps/plugin-store';



class PetFileRepository implements IPetRepository {
    private fileName: string;
    private store = new LazyStore('data.json');

    constructor() {
        this.fileName = 'data.json';
        
        console.log(this.fileName);
    }
    async saveAllPets(pets: Pet[]): Promise<void> {
        let jsonData = JSON.stringify(pets);
        if (this.store == null) {
            alert("store is null");
            return;
        }
        this.store?.set("pets.json", jsonData).then(() => this.store?.save()).catch((err) => {
            console.error(err);
            alert(err);
        });

        // writeTextFile("pets.json", jsonData, { "baseDir": BaseDirectory.AppData }).then((res) => {
        // await invoke("save_pets", { petsJson: jsonData }).then((res) => {


        // writeTextFile(this.fileName, jsonData);
        return Promise.resolve();
    }

    async getAllPets(): Promise<Pet[]> {
        try {
            if (!this.store) {
                return [] as Pet[];
            }
            return this.store.get<string>("pets.json").then((res: string | undefined) => {
                if (res == undefined ) {
                    return [] as Pet[];
                } else {
                    let pets = JSON.parse(res);
                    let pets2: Pet[] = pets.map((pet: any) => {
                        let p: Pet = Object.assign(new Pet(), pet);
                        return p;
                    });
                    return pets2 as Pet[];
                }
            }).catch((err) => {
                console.error(err);
                alert(err);
                return [] as Pet[];
            });




            //     return readTextFile("pets.json", { "baseDir": BaseDirectory.AppConfig }).then((res) => {
            //         // const res = await load_pets();
            //         // alert(res);
            //         console.log(res);
            //         let pets = JSON.parse(res);
            //         let pets2: Pet[] = pets.map((pet: any) => {
            //             // alert(pet.id);
            //             console.log(pet);
            //             let p: Pet = Object.assign(new Pet(), pet);
            //             return p
            //         });
            //         console.log(pets2);
            //         return pets2 as Pet[];
            //     }).catch((err) => {
            //         console.error(err);
            //         alert(err);
            //         return [] as Pet[];
            //     });
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
