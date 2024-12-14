"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
class Notification {
    // Notification
    sendNotification(recipient, message) {
        console.log(`Notification sent to ${recipient}: ${message}`);
    }
}
exports.Notification = Notification;
