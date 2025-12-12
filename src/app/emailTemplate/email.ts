// Email Templates for Holidays Era

// Traveller Booking Confirmation Template (with payment link)
export const TravellerBookingConfirmationTemplate = (
  propertyId: string,
  travellerName: string,
  bookingId: string,
  startDate: string,
  endDate: string,
  price: string,
  paymentToken: string
): string => {
  const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://holidaysera.com'}/booking/payment?token=${paymentToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .booking-details { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #64748b; font-size: 14px; }
        .detail-value { font-weight: 600; color: #1e293b; }
        .price-row { background: #ecfdf5; padding: 15px; border-radius: 8px; margin-top: 15px; }
        .price-label { color: #059669; font-size: 14px; }
        .price-value { font-size: 24px; font-weight: 700; color: #059669; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 25px 0; }
        .cta-section { text-align: center; padding: 20px 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 25px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; }
        .footer a { color: #60a5fa; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Your vacation is almost ready</p>
        </div>
        <div class="content">
          <p class="greeting">Hello <strong>${travellerName}</strong>,</p>
          <p>Great news! The property owner has confirmed your booking request. Please complete your payment to secure your reservation.</p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="detail-label">Booking ID</span>
              <span class="detail-value">${bookingId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Property ID</span>
              <span class="detail-value">${propertyId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-in</span>
              <span class="detail-value">${startDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out</span>
              <span class="detail-value">${endDate}</span>
            </div>
            <div class="price-row">
              <div class="price-label">Total Amount</div>
              <div class="price-value">₹${price}</div>
            </div>
          </div>
          
          <div class="cta-section">
            <a href="${paymentLink}" class="cta-button">Complete Payment →</a>
            <p style="color: #64748b; font-size: 14px;">This link will expire in 24 hours</p>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br><strong>The Holidays Era Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Holidays Era. All rights reserved.</p>
          <p>Need help? <a href="mailto:support@holidaysera.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Owner Booking Request Template
export const OwnerBookingTemplate = (
  ownerName: string,
  bookingId: string,
  startDate: string,
  endDate: string,
  price: string
): string => {
  const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://holidaysera.com'}/profile?tab=bookings`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
        .alert-box { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
        .booking-details { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #64748b; font-size: 14px; }
        .detail-value { font-weight: 600; color: #1e293b; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; }
        .cta-section { text-align: center; padding: 20px 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 25px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 New Booking Request!</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${ownerName}</strong>,</p>
          
          <div class="alert-box">
            <strong>⏰ Action Required:</strong> Please review and respond to this booking request as soon as possible.
          </div>
          
          <p>You have received a new booking request for your property. Here are the details:</p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="detail-label">Booking ID</span>
              <span class="detail-value">${bookingId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-in Date</span>
              <span class="detail-value">${startDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out Date</span>
              <span class="detail-value">${endDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Booking Amount</span>
              <span class="detail-value">₹${price}</span>
            </div>
          </div>
          
          <div class="cta-section">
            <a href="${dashboardLink}" class="cta-button">View in Dashboard →</a>
          </div>
          
          <p>Best regards,<br><strong>The Holidays Era Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Holidays Era. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Traveller Booking Request Sent Template
export const TravellerBookingTemplate = (
  startDate: string,
  endDate: string,
  price: string,
  travellerName: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
        .status-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; }
        .booking-details { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #64748b; font-size: 14px; }
        .detail-value { font-weight: 600; color: #1e293b; }
        .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin: 20px 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 25px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Booking Request Sent</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${travellerName}</strong>,</p>
          <p>Your booking request has been successfully submitted! <span class="status-badge">Pending Confirmation</span></p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="detail-label">Check-in</span>
              <span class="detail-value">${startDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out</span>
              <span class="detail-value">${endDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Estimated Total</span>
              <span class="detail-value">₹${price}</span>
            </div>
          </div>
          
          <div class="info-box">
            <strong>ℹ️ What happens next?</strong>
            <p style="margin: 10px 0 0 0;">The property owner will review your request and respond within 24-48 hours. Once confirmed, you'll receive a payment link to complete your booking.</p>
          </div>
          
          <p>Best regards,<br><strong>The Holidays Era Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Holidays Era. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Booking Cancellation Template for Traveller
export const sendBookingCancellationEmailToTravellerTemplate = (
  bookingId: string,
  travellerName: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
        .booking-id { background: #fef2f2; color: #dc2626; padding: 15px; border-radius: 8px; text-align: center; font-weight: 600; margin: 20px 0; }
        .info-box { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .cta-section { text-align: center; padding: 20px 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 25px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Booking Cancelled</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${travellerName}</strong>,</p>
          <p>We're sorry to inform you that your booking has been cancelled.</p>
          
          <div class="booking-id">
            Booking ID: ${bookingId}
          </div>
          
          <div class="info-box">
            <p><strong>What happens now?</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>If you made any payment, a refund will be processed within 5-7 business days.</li>
              <li>You can explore other properties and make a new booking.</li>
              <li>If you have questions, please contact our support team.</li>
            </ul>
          </div>
          
          <div class="cta-section">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://holidaysera.com'}/properties" class="cta-button">Browse Properties →</a>
          </div>
          
          <p>We hope to serve you again soon.</p>
          <p>Best regards,<br><strong>The Holidays Era Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Holidays Era. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Details Exchange Template (sent to both owner and traveller)
export const DetailsExchangeTemplate = (
  owner: { name: string; email: string; phone?: string },
  traveller: { name: string; email: string; phone?: string },
  bookingId: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
        .contact-cards { display: flex; gap: 20px; margin: 25px 0; }
        .contact-card { flex: 1; background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #6366f1; }
        .card-title { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 10px; }
        .card-name { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
        .card-detail { margin: 5px 0; font-size: 14px; }
        .card-detail a { color: #6366f1; text-decoration: none; }
        .important-box { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin: 20px 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 25px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Contact Details Exchange</h1>
          <p>Booking ID: ${bookingId}</p>
        </div>
        <div class="content">
          <p>The booking has been confirmed and payment is complete. Here are the contact details for your upcoming stay:</p>
          
          <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
            <tr>
              <td style="width: 48%; vertical-align: top;">
                <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; border-left: 4px solid #10b981;">
                  <div style="font-size: 12px; text-transform: uppercase; color: #059669; font-weight: 600; margin-bottom: 10px;">🏠 Property Owner</div>
                  <div style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 15px;">${owner.name}</div>
                  <div style="margin: 8px 0; font-size: 14px;">📧 <a href="mailto:${owner.email}" style="color: #059669; text-decoration: none;">${owner.email}</a></div>
                  ${owner.phone ? `<div style="margin: 8px 0; font-size: 14px;">📱 <a href="tel:${owner.phone}" style="color: #059669; text-decoration: none;">${owner.phone}</a></div>` : ''}
                </div>
              </td>
              <td style="width: 4%;"></td>
              <td style="width: 48%; vertical-align: top;">
                <div style="background: #eff6ff; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6;">
                  <div style="font-size: 12px; text-transform: uppercase; color: #3b82f6; font-weight: 600; margin-bottom: 10px;">✈️ Traveller</div>
                  <div style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 15px;">${traveller.name}</div>
                  <div style="margin: 8px 0; font-size: 14px;">📧 <a href="mailto:${traveller.email}" style="color: #3b82f6; text-decoration: none;">${traveller.email}</a></div>
                  ${traveller.phone ? `<div style="margin: 8px 0; font-size: 14px;">📱 <a href="tel:${traveller.phone}" style="color: #3b82f6; text-decoration: none;">${traveller.phone}</a></div>` : ''}
                </div>
              </td>
            </tr>
          </table>
          
          <div class="important-box">
            <strong>⚠️ Important:</strong>
            <p style="margin: 10px 0 0 0;">Please coordinate check-in details directly. We recommend contacting each other at least 24 hours before the check-in date.</p>
          </div>
          
          <p>Thank you for choosing Holidays Era!</p>
          <p>Best regards,<br><strong>The Holidays Era Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Holidays Era. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
