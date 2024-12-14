
export class UserService {
    private userBalances: Map<string, number> = new Map(); // userId -> balance
    
    // User Operations
    setUserBalance(userId: string, balance: number): void {
        this.userBalances.set(userId, balance);
    }

    getUserBalances(){
        return this.userBalances;
    }

   
}
