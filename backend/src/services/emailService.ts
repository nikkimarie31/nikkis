import { Client } from '@microsoft/microsoft-graph-client';
import { ClientCredentialRequest } from '@azure/msal-node';
import { ConfidentialClientApplication } from '@azure/msal-node';
import 'isomorphic-fetch';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

class EmailService {
  private graphClient: Client | null = null;
  private msalInstance: ConfidentialClientApplication;

  constructor() {
    // Initialize MSAL instance
    this.msalInstance = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.AZURE_CLIENT_ID!,
        clientSecret: process.env.AZURE_CLIENT_SECRET!,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
      },
    });
  }

  private async getAccessToken(): Promise<string> {
    const clientCredentialRequest: ClientCredentialRequest = {
      scopes: ['https://graph.microsoft.com/.default'],
    };

    try {
      const response = await this.msalInstance.acquireTokenByClientCredential(clientCredentialRequest);
      return response?.accessToken || '';
    } catch (error) {
      console.error('Failed to acquire access token:', error);
      throw new Error('Failed to authenticate with Microsoft Graph');
    }
  }

  private async getGraphClient(): Promise<Client> {
    if (!this.graphClient) {
      const accessToken = await this.getAccessToken();

      this.graphClient = Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        },
      });
    }
    return this.graphClient;
  }

  async sendContactEmail(formData: ContactFormData): Promise<void> {
    const { name, email, message } = formData;

    try {
      const graphClient = await this.getGraphClient();

      const mailMessage = {
        subject: `New Contact Form Message from ${name}`,
        body: {
          contentType: 'HTML' as const,
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #89CFF0 0%, #0284c7 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white;">
                <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">From your portfolio website</p>
              </div>

              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #89CFF0;">
                  <h2 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 18px;">Contact Information</h2>
                  <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                  <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #89CFF0;">${email}</a></p>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #89CFF0;">
                  <h2 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 18px;">Message</h2>
                  <p style="line-height: 1.6; color: #4b5563; white-space: pre-wrap;">${message}</p>
                </div>

                <div style="margin-top: 30px; padding: 15px; background: #e0f2fe; border-radius: 8px; border-left: 4px solid #89CFF0;">
                  <p style="margin: 0; font-size: 14px; color: #0369a1;">
                    💡 <strong>Quick Reply:</strong> You can reply directly to this email to respond to ${name}.
                  </p>
                </div>

                <div style="margin-top: 20px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    This message was sent from the contact form on inmyop1nion.com<br>
                    Sent on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          `,
        },
        toRecipients: [
          {
            emailAddress: {
              address: process.env.CONTACT_EMAIL!,
            },
          },
        ],
        replyTo: [
          {
            emailAddress: {
              address: email,
              name: name,
            },
          },
        ],
      };

      // Send email using Microsoft Graph with application permissions
      // Use the specific user's mailbox instead of /me
      const fromEmail = process.env.CONTACT_EMAIL!;

      await graphClient
        .api(`/users/${fromEmail}/sendMail`)
        .post({
          message: mailMessage,
        });

      console.log('✅ Email sent successfully via Microsoft Graph');
    } catch (error) {
      console.error('❌ Failed to send email via Microsoft Graph:', error);
      throw new Error('Failed to send email');
    }
  }

  // Test Microsoft Graph connection
  async testConnection(): Promise<boolean> {
    try {
      const graphClient = await this.getGraphClient();

      // Test by getting the specific user instead of /me
      const userEmail = process.env.CONTACT_EMAIL!;
      const user = await graphClient.api(`/users/${userEmail}`).get();
      console.log('✅ Microsoft Graph connection verified for:', user.mail || user.userPrincipalName);
      return true;
    } catch (error) {
      console.error('❌ Microsoft Graph connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();