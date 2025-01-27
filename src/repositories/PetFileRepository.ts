import { IPetRepository } from './PetRepository';
import { Pet } from '../models/pet';
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
        return Promise.resolve();
    }

    async getAllPets(): Promise<Pet[]> {
        try {
            if (!this.store) {
                return [] as Pet[];
            }
            return this.store.get<string>("pets.json").then((res: string | undefined) => {
                if (res == undefined) {
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
