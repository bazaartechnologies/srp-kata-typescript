export class Notification {
    // Notification
    public sendNotification(recipient: string, message: string): void {
        console.log(`Notification sent to ${recipient}: ${message}`);
    }
}