import { v4 as uuidv4 } from 'uuid';


export class RiderService {
    private riders: string[] = []; // List of available riders

    addRider(riderId: string): void {
        this.riders.push(riderId);
    }

    getRiders(): string[] {
        return this.riders;
    }
}