// import { IPetRepository } from './PetRepository';
// import { Pet } from '../models/pet';

// export class PetLocalStorageRepository implements IPetRepository {
//     private storageKey: string;
//     private pets: Pet[] = [];

//     constructor() {
//         this.storageKey = 'fixedStorageKey';
//         this.load();
//     }
//     saveAllPets(pets: Pet[]): Promise<void> {
//         throw new Error('Method not implemented.');
//     }

//     save(): void {
//         const jsonData = JSON.stringify(this.pets);
//         localStorage.setItem(this.storageKey, jsonData);
//     }

//     load(): void {
//         const jsonData = localStorage.getItem(this.storageKey);
//         if (jsonData) {
//             this.pets = JSON.parse(jsonData);
//         }
//     }

//     async getAllPets(): Promise<Pet[]> {
//         return this.pets;
//     }

//     async getPetById(id: number): Promise<Pet | null> {
//         return this.pets.find(pet => pet.id === id) || null;
//     }

//     async addPet(pet: Pet): Promise<void> {
//         this.pets.push(pet);
//         this.save();
//     }

//     async updatePet(pet: Pet): Promise<void> {
//         const index = this.pets.findIndex(p => p.id === pet.id);
//         if (index !== -1) {
//             this.pets[index] = pet;
//             this.save();
//         }
//     }

//     async deletePet(id: number): Promise<void> {
//         this.pets = this.pets.filter(pet => pet.id !== id);
//         this.save();
//     }
// }

// export default PetLocalStorageRepository;
