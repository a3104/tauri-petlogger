import { LazyStore } from '@tauri-apps/plugin-store';
import { ClinicVisit } from '../models/clinicVisit';

interface IClinicVisitRepository {
    getClinicVisitsByPetId(petId: number): Promise<ClinicVisit[]>;
    addClinicVisit(visit: ClinicVisit): Promise<void>;
    updateClinicVisit(visit: ClinicVisit): Promise<void>;
    deleteClinicVisit(id: string): Promise<void>;
}

class ClinicVisitFileRepository implements IClinicVisitRepository {
    private store = new LazyStore('clinicVisits.json');

    async getClinicVisitsByPetId(petId: number): Promise<ClinicVisit[]> {
        try {
            const visits = await this.getAllClinicVisits();
            return visits.filter(visit => visit.petId === petId);
        } catch (err) {
            console.error(err);
            alert(err);
            return [];
        }
    }

    async getAllClinicVisits(): Promise<ClinicVisit[]> {
        try {
            if (!this.store) {
                return [] as ClinicVisit[];
            }
            return this.store.get<string>("clinicVisits").then((res: string | undefined) => {
                if (res == undefined ) {
                    return [] as ClinicVisit[];
                } else {
                    let clinicVisits = JSON.parse(res);
                    let clinicVisits2: ClinicVisit[] = clinicVisits.map((visit: any) => {
                        return visit as ClinicVisit;
                    });
                    return clinicVisits2 as ClinicVisit[];
                }
            }).catch((err) => {
                console.error(err);
                alert(err);
                return [] as ClinicVisit[];
            });
        } catch (err) {
            console.error(err);
            alert(err);
            return [] as ClinicVisit[];
        }
    }

    async saveAllClinicVisits(visits: ClinicVisit[]): Promise<void> {
        try {
            const jsonData = JSON.stringify(visits);
            await this.store.set("clinicVisits", jsonData);
            await this.store.save();
        } catch (err) {
            console.error("Failed to save clinic visits:", err);
            throw new Error("Failed to save clinic visits");
        }
    }

    generateId(): string {
        return crypto.randomUUID();
    }

    async addClinicVisit(visit: ClinicVisit): Promise<void> {
        try {
            const visits = await this.getAllClinicVisits();
            visit.id = this.generateId();
            visits.push(visit);
            await this.saveAllClinicVisits(visits);
        } catch (error) {
            console.error("Error adding clinic visit:", error);
            throw new Error("Could not add clinic visit");
        }
    }


    async updateClinicVisit(visit: ClinicVisit): Promise<void> {
        const visits = await this.getAllClinicVisits();
        const index = visits.findIndex(v => v.id === visit.id);
        if (index !== -1) {
            visits[index] = visit;
            await this.saveAllClinicVisits(visits);
        } else {
            throw new Error(`Clinic visit with id ${visit.id} not found`);
        }
    }

    async deleteClinicVisit(id: string): Promise<void> {
        let visits = await this.getAllClinicVisits();
        visits = visits.filter(visit => visit.id !== id);
        await this.saveAllClinicVisits(visits);
    }
}

export default ClinicVisitFileRepository;
