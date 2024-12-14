

export class NotificationService {
    sendNotification(recipient: string, message: string): void {
        console.log(`Sending notification to ${recipient}: ${message}`);
    }
}
