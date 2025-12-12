import nodemailer from "nodemailer";

// Gmail transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER || "zairo.developer@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD || "gwlz rnrv gpio uzcp",
    },
  });
};

// Email types for type safety
interface BaseEmailOptions {
  to: string | string[];
  subject: string;
}

interface TextEmailOptions extends BaseEmailOptions {
  text: string;
  html?: never;
}

interface HtmlEmailOptions extends BaseEmailOptions {
  html: string;
  text?: never;
}

type EmailOptions = TextEmailOptions | HtmlEmailOptions;

// Generic send email function
export const sendMail = async (options: EmailOptions) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `Holidays Era <no-reply@holidaysera.com>`,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      ...(options.text ? { text: options.text } : {}),
      ...(options.html ? { html: options.html } : {}),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Contact form email
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: string;
  message: string;
}

export const sendContactEmail = async (data: ContactFormData) => {
  const companyEmail = process.env.COMPANY_EMAIL || "support@holidaysera.com";
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .field { margin-bottom: 20px; }
        .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .value { background: white; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin-top: 20px; }
        .footer { background: #1e293b; color: #94a3b8; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; }
        .category-badge { display: inline-block; background: #dbeafe; color: #1d4ed8; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Category</div>
            <span class="category-badge">${data.category.toUpperCase()}</span>
          </div>
          
          <div class="field">
            <div class="label">From</div>
            <div class="value"><strong>${data.name}</strong></div>
          </div>
          
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          
          ${data.phone ? `
          <div class="field">
            <div class="label">Phone</div>
            <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">Subject</div>
            <div class="value">${data.subject}</div>
          </div>
          
          <div class="message-box">
            <div class="label">Message</div>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${data.message}</p>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the Holidays Era contact form.</p>
          <p>© ${new Date().getFullYear()} Holidays Era. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send to company
  await sendMail({
    to: companyEmail,
    subject: `[Contact Form] ${data.category}: ${data.subject}`,
    html: htmlContent,
  });

  // Send confirmation to user
  const userConfirmationHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; }
        .header p { margin: 0; opacity: 0.9; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
        .highlight-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 25px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; }
        .social-links { margin: 15px 0; }
        .social-links a { color: #0ea5e9; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Contacting Us! 🎉</h1>
          <p>We've received your message</p>
        </div>
        <div class="content">
          <p>Hi <strong>${data.name}</strong>,</p>
          
          <p>Thank you for reaching out to Holidays Era! We've received your message and our support team will get back to you as soon as possible.</p>
          
          <div class="highlight-box">
            <p style="margin: 0;"><strong>📋 Your Reference:</strong></p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
            <p style="margin: 5px 0;"><strong>Category:</strong> ${data.category}</p>
            <p style="margin: 5px 0;"><strong>Expected Response:</strong> Within 24 hours</p>
          </div>
          
          <p>In the meantime, you might find answers to common questions in our <a href="https://holidaysera.com/help-center" style="color: #0ea5e9;">Help Center</a>.</p>
          
          <p>Best regards,<br><strong>The Holidays Era Team</strong></p>
        </div>
        <div class="footer">
          <div class="social-links">
            <a href="#">Facebook</a> |
            <a href="#">Instagram</a> |
            <a href="#">Twitter</a>
          </div>
          <p>© ${new Date().getFullYear()} Holidays Era. All rights reserved.</p>
          <p>117/N/70 3rd Floor, Kakadeo, Kanpur</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail({
    to: data.email,
    subject: "We've received your message - Holidays Era",
    html: userConfirmationHtml,
  });

  return { success: true };
};

// User details to company (for property listing)
export interface UserDetailsData {
  name: string;
  email: string;
  phone: string;
  VSID?: string;
  Link?: string;
  price?: string;
}

export const sendUserDetailsToCompany = async (userDetails: UserDetailsData) => {
  const companyEmail = process.env.COMPANY_EMAIL || "support@holidaysera.com";
  
  let subject: string;
  let htmlContent: string;

  if (userDetails.price !== undefined) {
    subject = "💰 New Plan Selection - User Details";
    htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; }
          .field { margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; }
          .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
          .value { font-size: 16px; color: #1e293b; margin-top: 5px; }
          .price-badge { display: inline-block; background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New Plan Selection!</h1>
            <p>Someone has chosen a subscription plan</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Selected Plan</div>
              <div class="value"><span class="price-badge">${userDetails.price}</span></div>
            </div>
            <div class="field">
              <div class="label">Name</div>
              <div class="value">${userDetails.name}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${userDetails.email}">${userDetails.email}</a></div>
            </div>
            <div class="field">
              <div class="label">Phone</div>
              <div class="value"><a href="tel:${userDetails.phone}">${userDetails.phone}</a></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  } else {
    subject = "🏠 New Property Listed - Contact Details";
    htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; }
          .field { margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; }
          .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
          .value { font-size: 16px; color: #1e293b; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 New Property Listed!</h1>
            <p>Someone has listed a new property</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name</div>
              <div class="value">${userDetails.name}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${userDetails.email}">${userDetails.email}</a></div>
            </div>
            <div class="field">
              <div class="label">Phone</div>
              <div class="value"><a href="tel:${userDetails.phone}">${userDetails.phone}</a></div>
            </div>
            ${userDetails.VSID ? `
            <div class="field">
              <div class="label">VS ID</div>
              <div class="value">${userDetails.VSID}</div>
            </div>
            ` : ''}
            ${userDetails.Link ? `
            <div class="field">
              <div class="label">Property Link</div>
              <div class="value"><a href="${userDetails.Link}">${userDetails.Link}</a></div>
            </div>
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  await sendMail({
    to: companyEmail,
    subject,
    html: htmlContent,
  });

  return { success: true };
};

// Simple email function for basic notifications
export const sendSimpleEmail = async ({
  email,
  subject,
  text,
}: {
  email: string;
  subject: string;
  text: string;
}) => {
  await sendMail({
    to: email,
    subject,
    text,
  });

  return { success: true };
};
