import { UrineTest } from '../models/urineTest';

export interface IUrineTestRepository {
  getAllTests(): Promise<UrineTest[]>;
  getTestById(id: string): Promise<UrineTest | null>;
  getUrineTestsByPetId(petId: number): Promise<UrineTest[]>;
  addUrineTest(test: UrineTest): Promise<void>;
  updateUrineTest(id: string, test: UrineTest): Promise<void>;
  deleteUrineTest(id: string): Promise<void>;
  saveAllTests(tests: UrineTest[]): Promise<void>;
  exportAllTests(): Promise<string>;
}
