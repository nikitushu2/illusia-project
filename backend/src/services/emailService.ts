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
  newStatus: BookingStatus
): Promise<void> => {
  try {
    const subject = `Booking #${bookingId} Status Update`;
    const html = generateStatusChangeEmailContent(
      bookingId,
      user.displayName,
      newStatus
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

const generateStatusChangeEmailContent = (
  bookingId: number,
  userName: string,
  status: BookingStatus
): string => {
  let statusMessage = "";

  switch (status) {
    case BookingStatus.RESERVED:
      statusMessage = "Your booking has been confirmed and reserved.";
      break;
    default:
      statusMessage = `Your booking status has been updated to ${status}.`;
  }

  return `
    <html>
      <body>
        <h2>Booking Status Update</h2>
        <p>Hello ${userName},</p>
        <p>${statusMessage}</p>
        <p>Booking ID: ${bookingId}</p>
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
