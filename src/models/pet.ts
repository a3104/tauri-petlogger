export class Pet {
    constructor(
        public id: number = 0,
        public name: string = "",
        public type: number = 1,
        public birthYear: number = 2020,
        public birthMonth: number = 1,
        public birthDay: number = 1,
        public gender: number = 0,
        public nickname: string = ""
    ) {}

    getAge(): number {
        const currentYear = new Date().getFullYear();
        return currentYear - this.birthYear;
    }

    getAnimalType(): string {
        switch (this.type) {
            case 1:
                return "猫";
            case 2:
                return "犬";
            case 3:
                return "その他";
            default:
                return "不明";
        }
    }
}
