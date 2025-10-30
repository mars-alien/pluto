const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);


async function sendVerificationEmail(to, code) {

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Email sending is disabled.');
    throw new Error('Email service not configured');
  }

  try {
    
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: 'Your Verification Code - Pluto',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code - Pluto</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; max-width: 500px; width: 100%;">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white;">
                <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 24px; font-weight: bold;">🔐</span>
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Developer Simulator</h1>
                <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">Email Verification</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h2 style="color: #2d3748; margin: 0 0 10px; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
                  <p style="color: #718096; margin: 0; font-size: 16px; line-height: 1.5;">Please use the verification code below to complete your registration:</p>
                </div>
                
                <!-- Code Display -->
                <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px solid #e2e8f0; border-radius: 16px; padding: 30px; margin: 30px 0; text-align: center; position: relative;">
                  <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <span style="font-size: 36px; font-weight: 800; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</span>
                  </div>
                  <div style="margin-top: 15px;">
                    <span style="background: #667eea; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Verification Code</span>
                  </div>
                </div>
                
                <!-- Instructions -->
                <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 30px 0;">
                  <h3 style="color: #2d3748; margin: 0 0 10px; font-size: 16px; font-weight: 600;">📋 Instructions:</h3>
                  <ul style="color: #4a5568; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                    <li>Enter this code in the verification field</li>
                    <li>Code expires in <strong>15 minutes</strong></li>
                    <li>Do not share this code with anyone</li>
                  </ul>
                </div>
                
                <!-- Security Notice -->
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #a0aec0; font-size: 13px; margin: 0; line-height: 1.5;">
                    🔒 This is a secure verification code. If you didn't request this, please ignore this email.
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                  © 2024 Pluto. All rights reserved.
                </p>
                <p style="color: #a0aec0; font-size: 12px; margin: 5px 0 0;">
                  Sent from <strong>helper@pluto.com</strong>
                </p>
              </div>
              
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      
      // Handle specific Resend errors
      if (error.statusCode === 403) {
        const errorMessage = error.message || 'Email sending restricted';
        // If using sandbox, inform about limitation
        if (fromEmail.includes('resend.dev')) {
          throw new Error('Email service is in sandbox mode. Please verify your domain at resend.com/domains or check your email configuration.');
        }
        throw new Error(`Email sending failed: ${errorMessage}`);
      }
      
      throw new Error(`Failed to send verification email: ${error.message || 'Unknown error'}`);
    }

    console.log('Verification email sent via Resend:', data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // Re-throw the error with better message if it's already a string
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to send verification email');
  }
}



// Verify email configuration on startup
async function verifyEmailConfig() {
  try {
    // Test Resend API key
    const { data, error } = await resend.apiKeys.list();
    if (error) {
      console.error("Resend API key verification failed:", error);
      return false;
    }
    console.log("Resend email configuration verified");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error.message);
    return false;
  }
}

module.exports = {
  sendVerificationEmail,
  verifyEmailConfig
};