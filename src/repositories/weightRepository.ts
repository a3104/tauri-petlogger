import { invoke } from "@tauri-apps/api/core";

export class WeightRepository {

    async saveWeightBridge(json: String): Promise<void> {
        await invoke("save_weights", { weightsJson: json }).then((res) => {
            console.log(res);

        }).catch((err) => {
            console.error(err);
            alert(err);
        });

    }
    async loadWeightsBridge(): Promise<string> {
        return await invoke("load_weights");
    }

    saveWeights(petId: number, weights: { petId: number; date: string; weight: number }[]): Promise<void> {
        let json = JSON.stringify(weights);
        return this.saveWeightBridge(json);
    }

    getWeights(petId: number): Promise<{ petId: number; date: string; weight: number }[]> {
        return this.loadWeightsBridge().then((res) => {
            console.log(res);
            let weights = JSON.parse(res);
            return weights.filter((weight: { petId: number; date: string; weight: number }) => weight.petId === petId);
        }).catch((err) => {
            // alert(err);
            return [];
        });
    }
}

export const weightRepository = new WeightRepository();
