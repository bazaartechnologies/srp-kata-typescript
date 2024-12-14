let userInstance: UserService | null = null;


export class UserService {

    // static #instance = null;
    constructor() {
        if (userInstance) {
            return userInstance;
        }
        userInstance = this;
    }



    private userBalances: Map<string, number> = new Map(); // userId -> balance
    addUser(userId: string, balance: number): void {
        this.userBalances.set(userId, balance);
    }

    doesUserExist(userId: string): boolean {
        return this.userBalances.has(userId);
    }

    getUserBalance(userId: string): number {
        return this.userBalances.get(userId) || 0;
    }
}
