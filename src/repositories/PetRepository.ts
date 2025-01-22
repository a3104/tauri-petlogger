import { Pet } from "../models/pet";

export interface IPetRepository {
  getAllPets(): Promise<Pet[]>;
  getPetById(id: number): Promise<Pet | null>;
  addPet(pet: Pet): Promise<void>;
  updatePet(pet: Pet): Promise<void>;
  deletePet(id: number): Promise<void>;
  saveAllPets(pets: Pet[]): Promise<void>;
}


