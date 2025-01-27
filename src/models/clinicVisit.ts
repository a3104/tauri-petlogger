export interface ClinicVisit {
    id: string;
    petId: number;
    date: string;
    hospitalName: string;
    condition: string;
    photos: string[]; // P6f3e
}
