"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateDiscount = void 0;
class CalculateDiscount {
    // Order Operations
    calculateDiscount(total, discountCode) {
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
exports.CalculateDiscount = CalculateDiscount;
