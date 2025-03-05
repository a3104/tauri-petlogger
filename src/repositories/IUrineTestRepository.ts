import { UrineTest } from '../models/urineTest';

export interface IUrineTestRepository {
    getAllTests(): Promise<UrineTest[]>;
    getTestById(id: number): Promise<UrineTest | null>;
    addTest(test: UrineTest): Promise<void>;
    updateTest(test: UrineTest): Promise<void>;
    deleteTest(id: number): Promise<void>;
    exportAllTests(): Promise<string>;
}
