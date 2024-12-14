export class CalculateDiscount{
   // Order Operations
 
   public calculateDiscount(total: number, discountCode: string | null): number {
    switch (discountCode) {
        case "DISCOUNT10":
            return total * 0.10;
        case "DISCOUNT20":
            return total * 0.20;
        default:
            return 0;
    }
}
}