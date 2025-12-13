
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Configure transport based on environment variables
        // Default to a mock or console if not configured
        if (process.env.SMTP_HOST) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        } else {
            console.warn('SMTP not configured. Emails will be logged to console.');
            this.transporter = {
                sendMail: async (options) => {
                    console.log('--- MOCK EMAIL SEND ---');
                    console.log('To:', options.to);
                    console.log('Subject:', options.subject);
                    console.log('Body:', options.text);
                    console.log('-----------------------');
                    return { messageId: 'mock-id' };
                }
            };
        }
    }

    async sendCredentialsToUser(email, accessCode, plainPassword, appCategory) {
        const subject = `Your Zibuke Access Code - ${appCategory}`;
        const message = this.getUserEmailTemplate(accessCode, plainPassword, appCategory);

        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"Zibuke" <noreply@zibuke.com>',
                to: email,
                subject: subject,
                text: message
            });
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    async sendExtensionNotification(email, accessCode, appCategory, newExpiry) {
        const subject = `Subscription Extended: Zibuke ${appCategory}`;
        let message = "Your Zibuke subscription has been extended!\n\n";
        message += `App: ${appCategory}\n`;
        message += `Access Code: ${access_code}\n`;
        message += `New Expiry Date: ${new Date(newExpiry).toISOString().split('T')[0]}\n\n`;
        message += "You can continue using your existing access code. No action is required.\n\n";
        message += "Thank you for renewing with Zibuke!\n";

        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"Zibuke" <noreply@zibuke.com>',
                to: email,
                subject: subject,
                text: message
            });
            return true;
        } catch (error) {
            console.error('Error sending extension email:', error);
            return false;
        }
    }

    getUserEmailTemplate(accessCode, plainPassword, appCategory) {
        let body = "Welcome to Zibuke!\n";
        body += "=========================\n\n";
        body += `Thank you for choosing Zibuke ${appCategory}.\n\n`;
        body += "Your login credentials:\n";
        body += "------------------------\n";
        body += `Access Code: ${accessCode}\n`;

        if (plainPassword) {
            body += `Password: ${plainPassword}\n\n`;
        } else {
            body += "Password: Use the same password you created for your Zibuke account during checkout.\n\n";
        }

        body += "Next Steps:\n";
        body += `1. Download the Zibuke ${appCategory} app from Google Play Store\n`;
        body += "2. Open the app and select 'Login'\n";
        body += "3. Enter your access code and password\n";
        body += "4. Start using your subscription\n\n";
        body += "Important: Keep your password secure. Never share it with anyone.\n";
        body += "If you didn't request this code, please contact support immediately.\n\n";
        body += "Questions? Visit https://zibukeafrica.co.za\n";
        body += "\nBest regards,\n";
        body += "Zibuke Team";

        return body;
    }
}

module.exports = new EmailService();
