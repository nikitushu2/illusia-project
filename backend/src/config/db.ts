// import { Client } from 'pg';

// // Database connection using environment variables
// const client = new Client({
//   host: process.env.DB_HOST,   // 'db' should be the name of the service in docker-compose.yml
//   port: parseInt(process.env.DB_PORT || '5432'),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// client.connect()
//   .then(() => console.log('Connected to PostgreSQL database'))
//   .catch((err) => console.error('Connection error', err.stack));

// export default client;
