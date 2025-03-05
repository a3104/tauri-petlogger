import { Pet } from "../models/pet";

export interface IPetRepository {
  getAllPets(): Promise<Pet[]>;
  getPetById(id: number): Promise<Pet | null>;
  addPet(pet: Pet): Promise<void>;
  updatePet(pet: Pet): Promise<void>;
  deletePet(id: number): Promise<void>;
  saveAllPets(pets: Pet[]): Promise<void>;
}

const getAllPets = async (): Promise<Pet[]> => {
  // Implement the logic to fetch all pets
  // This could involve fetching from local storage, a database, or an API
  return [];
};

export { getAllPets };


