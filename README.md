# Illusia Project

Illusia is a full-stack web application designed for Illusia ry, a Finnish organization that creates immersive Live Action Role-Playing (LARP) experiences. The platform serves as a comprehensive booking and management system that allows users to browse, reserve, and manage LARP props, equipment, and set pieces for events like Odysseus and other adventures. 

The application features a user-friendly interface where customers can view available items, create bookings, and track their rental history, while administrators have access to a dedicated dashboard for managing inventory, approving bookings, and overseeing user accounts. The system supports bilingual functionality (English and Finnish) and includes features such as item categorization, availability tracking, email notifications, and role-based access control with support for regular users, admins, and super admins.

The project is built with modern web technologies, including React 19 with TypeScript on the frontend, using Material-UI and Ant Design for the user interface, and Vite as the build tool. The backend is powered by Node.js and Express with TypeScript, using Sequelize as the ORM to interact with a PostgreSQL database. Authentication is handled through Firebase, with JWT tokens for session management, and the application includes email functionality via Nodemailer for booking confirmations and notifications. The entire application is containerized with Docker and configured for both development and production environments, with deployment support for Heroku.


## Demonstration

Landing page:
<video src="https://github.com/user-attachments/assets/999c26aa-a93a-4943-92ff-1c58b63258a1" autoplay muted loop playsinline width="100%">
</video>


User features and booking:
<video src="https://github.com/user-attachments/assets/8685378b-5847-4e7a-aeb3-82e7916fc04a" autoplay muted loop playsinline width="100%">
</video>


Admin item CRUD:
<video src="https://github.com/user-attachments/assets/28fb317d-021a-47be-a770-0a6636a4b2c2" autoplay muted loop playsinline width="100%">
</video>
