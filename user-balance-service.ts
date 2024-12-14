import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from './food-delivery-system.types';

export class UserBalanceService {
    private userBalances: Map<string, number> = new Map(); // userId -> balance

    // User Operations
    addUserBalance(userId: string, balance: number): void {
        this.userBalances.set(userId, balance);
    }
    getUserBalance(userId: string): number {
        return this.userBalances.get(userId) || 0;
    }
    has(userId: string): boolean {
        return this.userBalances.has(userId);
    }
}