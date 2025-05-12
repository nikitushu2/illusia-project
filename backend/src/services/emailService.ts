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
      return `<p>Item: ${itemName}, Quantity: ${item.quantity}</p>`;
    })
  );

  return `
    <html>
      <body>
        <h2>Booking Status Update</h2>
        <p>Hello ${userName},</p>
        <p>${statusMessage}</p>
        <p>Booking ID: ${bookingId}</p>
        <p>Booking date: From ${startDate
          .toString()
          .replace(/(\d{4})-(\d{2})-(\d{2})T.*/g, "$2-$3-$1")} To ${endDate
    .toString()
    .replace(/(\d{4})-(\d{2})-(\d{2})T.*/g, "$2-$3-$1")}</p>
        <p>Booking items:</p>
        ${itemsHtml.join("")}
        <p>Thank you for using our service!</p>
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
