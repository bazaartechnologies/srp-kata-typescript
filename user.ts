import { FoodDeliverySystem } from "./food-delivery-system";

 export class User {

    system: FoodDeliverySystem
    constructor(){
        this.system = new FoodDeliverySystem()
    }
     
    addUser(userId: string, balance: number): void {
        this.system.userBalances.set(userId, balance);
    }
 }
   