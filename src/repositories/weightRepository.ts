import { LazyStore } from '@tauri-apps/plugin-store';

export class WeightRepository {
    private store = new LazyStore('weight.json');

    async saveWeights(petId: number, weights: { petId: number; date: string; weight: number }[]): Promise<void> {
        let jsonData = JSON.stringify(weights);
        if (this.store == null) {
            alert("store is null");
            return;
        }
        this.store?.set(`weights_${petId}.json`, jsonData).then(() => this.store?.save()).catch((err) => {
            console.error(err);
            alert(err);
        });
    }

    async getWeights(petId: number): Promise<{ petId: number; date: string; weight: number }[]> {
        try {
            if (!this.store) {
                return [];
            }
            return this.store.get<string>(`weights_${petId}.json`).then((res: string | undefined) => {
                if (res == undefined) {
                    return [];
                } else {
                    let weights = JSON.parse(res);
                    return weights as { petId: number; date: string; weight: number }[];
                }
            }).catch((err) => {
                console.error(err);
                alert(err);
                return [];
            });
        } catch (err) {
            console.error(err);
            alert(err);
            return [];
        }
    }

    async getAllWeights(): Promise<{ petId: number; date: string; weight: number }[]> {
        try {
            const keys = await this.store.keys();
            const allWeights: { petId: number; date: string; weight: number }[] = [];
            for (const key of keys) {
                if (key.startsWith('weights_')) {
                    const weights = await this.getWeights(parseInt(key.split('_')[1]));
                    allWeights.push(...weights);
                }
            }
            return allWeights;
        } catch (err) {
            console.error(err);
            alert(err);
            return [];
        }
    }
}

export const weightRepository = new WeightRepository();
