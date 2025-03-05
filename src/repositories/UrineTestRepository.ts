import { IUrineTestRepository } from './IUrineTestRepository';
import { UrineTest } from '../models/urineTest';
import { LazyStore } from '@tauri-apps/plugin-store';

export class UrineTestRepository implements IUrineTestRepository {
    private fileName: string;
    private petId: number;
    private store = new LazyStore('urineTests.json');

    constructor(petId: number) {
        this.petId = petId;
        this.fileName = 'urineTests' + this.petId + '.json';
        console.log(this.fileName);
    }

    async saveAllTests(tests: UrineTest[]): Promise<void> {
        let jsonData = JSON.stringify(tests);
        // alert(jsonData);
        if (this.store == null) {
            alert("store is null");
            return;
        }
        await this.store?.set(this.fileName, jsonData);
        await this.store?.save();
        return Promise.resolve();
    }

    async getAllTests(): Promise<UrineTest[]> {
        try {
            if (!this.store) {
                return [] as UrineTest[];
            }
            const res = await this.store.get<string>(this.fileName);
            
            if (res === undefined) {
                return [] as UrineTest[];
            } else {
                // alert(res);
                let tests: UrineTest[] = JSON.parse(res);
                return tests;
            }
        } catch (err) {
            console.error(err);
            alert("データ読み込みエラー: " + err);
            return [] as UrineTest[];
        }
    }

    async getTestById(id: string): Promise<UrineTest | null> {
        const tests = await this.getAllTests();
        return tests.find(test => test.id === id) || null;
    }

    async getUrineTestsByPetId(petId: number): Promise<UrineTest[]> {
        const tests = await this.getAllTests();
        return tests.filter(test => test.petId === petId);
    }

    async addUrineTest(test: UrineTest): Promise<void> {
        const tests = await this.getAllTests();
        tests.push(test);
        await this.saveAllTests(tests);
    }

    async updateUrineTest(id: string, test: UrineTest): Promise<void> {
        const tests = await this.getAllTests();
        const index = tests.findIndex(t => t.id === id);
        if (index !== -1) {
            tests[index] = test;
            await this.saveAllTests(tests);
        }
    }

    async deleteUrineTest(id: string): Promise<void> {
        let tests = await this.getAllTests();
        tests = tests.filter(test => test.id !== id);
        await this.saveAllTests(tests);
    }

    async exportAllTests(): Promise<string> {
        const tests = await this.getAllTests();
        return JSON.stringify(tests, null, 2);
    }
}

export default UrineTestRepository;
