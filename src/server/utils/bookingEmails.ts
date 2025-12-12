import { sendMail } from "./gmailMailer";
import {
  DetailsExchangeTemplate,
  OwnerBookingTemplate,
  sendBookingCancellationEmailToTravellerTemplate,
  TravellerBookingConfirmationTemplate,
  TravellerBookingTemplate,
} from "@/app/emailTemplate/email";

// Booking confirmation to company
export const sendBookingConfirmationEmailToCompany = async (
  ownerName: string,
  ownerEmail: string,
  travellerName: string,
  travellerEmail: string,
  propertyId: string,
  propertyVSID: string
) => {
  const companyEmail = process.env.COMPANY_EMAIL || "support@holidaysera.com";
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; }
        .info-card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #10b981; }
        .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 16px; color: #1e293b; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Booking Confirmed!</h1>
          <p>A booking has been confirmed</p>
        </div>
        <div class="content">
          <div class="info-card">
            <div class="label">Owner</div>
            <div class="value">${ownerName} - <a href="mailto:${ownerEmail}">${ownerEmail}</a></div>
          </div>
          <div class="info-card">
            <div class="label">Traveller</div>
            <div class="value">${travellerName} - <a href="mailto:${travellerEmail}">${travellerEmail}</a></div>
          </div>
          <div class="info-card">
            <div class="label">Property</div>
            <div class="value">VS ID: ${propertyVSID} | Property ID: ${propertyId}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail({
    to: companyEmail,
    subject: `✅ Booking Confirmed - ${propertyVSID}`,
    html,
  });

  return { success: true };
};

// Booking confirmation to owner
export const sendBookingConfirmationEmailToOwner = async (
  ownerName: string,
  ownerEmail: string
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${ownerName}</strong>,</p>
          <p>Great news! You have successfully confirmed the booking request.</p>
          <p>The traveller has been notified and will proceed with the payment process.</p>
          <p>You can view all your bookings in your dashboard.</p>
          <p>Best regards,<br><strong>The Holidays Era Team</strong></p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Holidays Era. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail({
    to: ownerEmail,
    subject: "🎉 Booking Confirmed - Holidays Era",
    html,
  });

  return { success: true };
};

// Booking confirmation to traveller with payment link
export const sendBookingConfirmationEmailToTraveller = async (
  propertyId: string,
  travellerName: string,
  travellerEmail: string,
  bookingId: string,
  startDate: string,
  endDate: string,
  price: string,
  paymentToken: string
) => {
  const templateContent = TravellerBookingConfirmationTemplate(
    propertyId,
    travellerName,
    bookingId,
    startDate,
    endDate,
    price,
    paymentToken
  );

  await sendMail({
    to: travellerEmail,
    subject: "🎉 Booking Confirmed - Complete Your Payment",
    html: templateContent,
  });

  return { success: true };
};

// Booking notification to company
export const sendBookingEmailToCompany = async (
  ownerEmail: string,
  travellerEmail: string,
  propertyId: string,
  propertyVSID: string
) => {
  const companyEmail = process.env.COMPANY_EMAIL || "support@holidaysera.com";
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; }
        .field { margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; }
        .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 16px; color: #1e293b; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 New Booking Request</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Owner Email</div>
            <div class="value"><a href="mailto:${ownerEmail}">${ownerEmail}</a></div>
          </div>
          <div class="field">
            <div class="label">Traveller Email</div>
            <div class="value"><a href="mailto:${travellerEmail}">${travellerEmail}</a></div>
          </div>
          <div class="field">
            <div class="label">Property ID</div>
            <div class="value">${propertyId}</div>
          </div>
          <div class="field">
            <div class="label">Property VSID</div>
            <div class="value">${propertyVSID}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail({
    to: companyEmail,
    subject: `📋 New Booking Request - ${propertyVSID}`,
    html,
  });

  return { success: true };
};

// Booking notification to owner
export const sendBookingEmailToOwner = async (
  propertyId: string,
  ownerName: string,
  bookingId: string,
  startDate: string,
  endDate: string,
  price: string,
  emails: string | string[]
) => {
  const templateContent = OwnerBookingTemplate(
    ownerName,
    bookingId,
    startDate,
    endDate,
    price
  );

  await sendMail({
    to: emails,
    subject: "🏠 New Booking Request - Action Required",
    html: templateContent,
  });

  return { success: true };
};

// Booking notification to traveller
export const sendBookingEmailToTraveller = async (
  startDate: string,
  endDate: string,
  price: string,
  travellerName: string,
  emails: string | string[]
) => {
  const templateContent = TravellerBookingTemplate(
    startDate,
    endDate,
    price,
    travellerName
  );

  await sendMail({
    to: emails,
    subject: "📅 Your Booking Request Has Been Sent",
    html: templateContent,
  });

  return { success: true };
};

// Booking cancellation to traveller
export const sendBookingCancellationEmailToTraveller = async (
  travellerName: string,
  bookingId: string,
  emails: string | string[]
) => {
  const templateContent = sendBookingCancellationEmailToTravellerTemplate(
    bookingId,
    travellerName
  );

  await sendMail({
    to: emails,
    subject: "❌ Booking Cancellation Notice",
    html: templateContent,
  });

  return { success: true };
};

// Booking cancellation to company
export const sendBookingCancellationEmailToCompany = async (
  ownerEmail: string,
  travellerEmail: string,
  bookingId: string,
  cancellationReason: string
) => {
  const companyEmail = process.env.COMPANY_EMAIL || "support@holidaysera.com";
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; }
        .field { margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; }
        .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 16px; color: #1e293b; margin-top: 5px; }
        .reason-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Booking Cancelled</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Booking ID</div>
            <div class="value">${bookingId}</div>
          </div>
          <div class="field">
            <div class="label">Owner Email</div>
            <div class="value"><a href="mailto:${ownerEmail}">${ownerEmail}</a></div>
          </div>
          <div class="field">
            <div class="label">Traveller Email</div>
            <div class="value"><a href="mailto:${travellerEmail}">${travellerEmail}</a></div>
          </div>
          <div class="reason-box">
            <div class="label">Cancellation Reason</div>
            <p style="margin: 10px 0 0 0;">${cancellationReason}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail({
    to: companyEmail,
    subject: `❌ Booking Cancelled - ${bookingId}`,
    html,
  });

  return { success: true };
};

// Details exchange email
export const sendDetailsExchangeMail = async (
  owner: { name: string; email: string; phone?: string },
  traveller: { name: string; email: string; phone?: string },
  bookingId: string
) => {
  const templateContent = DetailsExchangeTemplate(owner, traveller, bookingId);

  await sendMail({
    to: [owner.email, traveller.email],
    subject: "📋 Contact Details Exchange - Holidays Era",
    html: templateContent,
  });

  return { success: true };
};
