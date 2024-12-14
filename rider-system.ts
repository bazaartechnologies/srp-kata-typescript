
export class RiderService {
   
    private riders: string[] = []; // List of available riders

    // Rider Operations
    addRider(riderId: string): void {
        this.riders.push(riderId);
    }

    getRiders(): string[] {
        return this.riders;
    }

    shiftRider() {
        if (this.riders.length === 0) return null;
        return this.riders.shift();
    }
}
