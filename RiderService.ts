let riderInstance: RiderService | null = null;


export class RiderService {
    private riders: string[] = []; // List of available riders

    constructor() {
        if (riderInstance) {
            return riderInstance;
        }
        riderInstance = this;
    }

    add(riderId: string): void {
        this.riders.push(riderId);
    }

    getAll(): string[] {
        return this.riders;
    }

    isAvailable(): boolean {
        return this.riders.length > 0;
    }

    get(): string {
        return this.riders.shift() || '';
    }
}
