import { findById } from "./itemService";
import transporter from "../config/nodemailer";
import { BookingStatus } from "../types/booking";
require("dotenv").config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendStatusChangeEmail = async (
  user: { email: string; displayName: string },
  bookingId: number,
  newStatus: BookingStatus,
  startDate: Date,
  endDate: Date,
  items: any[]
): Promise<void> => {
  try {
    const subject = `Booking #${bookingId} Status Update`;
    const html = await generateStatusChangeEmailContent(
      bookingId,
      user.displayName,
      newStatus,
      startDate,
      endDate,
      items
    );

    await sendEmail({
      to: user.email,
      subject,
      html,
    });

    console.log(
      `Status change email sent to ${user.email} for booking #${bookingId}`
    );
  } catch (error) {
    console.error("Error sending status change email:", error);
    throw error;
  }
};

const generateStatusChangeEmailContent = async (
  bookingId: number,
  userName: string,
  status: BookingStatus,
  startDate: Date,
  endDate: Date,
  items: any[]
): Promise<string> => {
  let statusMessage = "";

  switch (status) {
    case BookingStatus.RESERVED:
      statusMessage = "Your booking has been confirmed and reserved.";
      break;
    case BookingStatus.CANCELLED:
      statusMessage = "Your booking has been cancelled.";
      break;
    default:
      statusMessage = `Your booking status has been updated to ${status}.`;
  }

  // Get item names for each booking item
  const itemsHtml = await Promise.all(
    items.map(async (item) => {
      const itemDetails = await findById(item.itemId);
      const itemName = itemDetails
        ? itemDetails.name
        : `Unknown (ID: ${item.itemId})`;
      return `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${itemName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      </tr>`;
    })
  );

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
          }
          .email-container {
            border: 1px solid #dddddd;
            border-radius: 5px;
            padding: 20px;
            background-color: #ffffff;
          }
          .email-header {
            background-color: #44195b;
            color: white;
            padding: 15px;
            border-radius: 5px 5px 0 0;
            margin: -20px -20px 20px -20px;
          }
          .email-header h2 {
            margin: 0;
            font-weight: 500;
          }
          .booking-info {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .booking-info p {
            margin: 5px 0;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .items-table th {
            background-color: #f2f2f2;
            padding: 10px;
            text-align: left;
            border-bottom: 2px solid #ddd;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #eeeeee;
            color: #777777;
            font-size: 14px;
          }
          .status-reserved {
            color: #28a745;
            font-weight: bold;
          }
          .status-cancelled {
            color: #dc3545;
            font-weight: bold;
          }
          .status-other {
            color: #0066cc;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h2>Booking Status Update</h2>
          </div>
          
          <p>Hello ${userName},</p>
          
          <p class="status-${status.toLowerCase()}">
            ${statusMessage}
          </p>
          
          <div class="booking-info">
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Booking Period:</strong> ${startDate.toLocaleDateString(
              "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            )} to ${endDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}</p>
          </div>
          
          <h3>Booking Items</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml.join("")}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Thank you for using our service!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log("Email sent:", response.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
