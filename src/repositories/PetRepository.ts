import { Pet } from "../models/pet";

export interface IPetRepository {
  getAllPets(): Promise<Pet[]>;
  getPetById(id: number): Promise<Pet | null>;
  addPet(pet: Pet): Promise<void>;
  updatePet(pet: Pet): Promise<void>;
  deletePet(id: number): Promise<void>;
  saveAllPets(pets: Pet[]): Promise<void>;
}

export class PetLocalStorageRepository implements IPetRepository {
  private pets: Pet[] = [];

  async getAllPets(): Promise<Pet[]> {
    return this.pets;
  }

  async getPetById(id: number): Promise<Pet | null> {
    return this.pets.find(pet => pet.id === id) || null;
  }

  async addPet(pet: Pet): Promise<void> {
    this.pets.push(pet);
  }

  async updatePet(pet: Pet): Promise<void> {
    const index = this.pets.findIndex(p => p.id === pet.id);
    if (index !== -1) {
      this.pets[index] = pet;
    }
  }
  async 

  async deletePet(id: number): Promise<void> {
    this.pets = this.pets.filter(pet => pet.id !== id);
  }
}

