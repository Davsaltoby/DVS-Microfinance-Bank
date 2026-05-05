# FinTech DVS Microfinance Bank API

A Node.js + Express backend for a microfinance banking system with NIBSS identity and account services.

## Overview

This project implements a microfinance banking API that supports:

- BVN and NIN registration
- User registration and login
- Account creation via NIBSS
- Name enquiry and balance enquiry
- Fund transfer with validation and transaction persistence
- Transaction status checks
- Admin account list retrieval

The application connects to MongoDB for user, account, and transaction data, and integrates with NIBSS services for identity verification, account creation, balance checks, and transfers.

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- Axios
- JWT authentication
- bcrypt password hashing
- dotenv

## Setup

1. Clone the repository.
2. Run:

```bash
npm install
```

3. Create a `.env` file with the required values.
4. Start the server:

```bash
npm run dev
```

The default port is `3000` unless `PORT` is defined.

## Environment Variables

The application requires the following environment variables:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret used for signing JWT tokens
- `NIBSS_BASE_URL` - NIBSS service base URL
- `NIBSS_API_KEY` - NIBSS API key for token acquisition
- `NIBSS_API_SECRET` - NIBSS API secret for token acquisition

Example `.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/fintech-dvs
JWT_SECRET=your_jwt_secret
NIBSS_BASE_URL=https://nibss.example.com/
NIBSS_API_KEY=your_api_key
NIBSS_API_SECRET=your_api_secret
```

## Running the Server

```bash
npm run dev
```

The server starts in `server.js` and mounts route modules on the following base paths:

- `/api/admin`
- `/api/identity`
- `/api/auth`
- `/api/account`
- `/api/transfer`
- `/api/transaction`

## API Endpoints

### Identity Management

#### Create BVN

- `POST /api/identity/create-bvn`
- Middleware: `validateCreateBvn`
- Body:
  - `bvn` (string)
  - `firstName` (string)
  - `lastName` (string)
  - `dob` (string)
  - `phone` (string)
- Response:
  - `201` on success with created BVN data
  - `409` if BVN already exists

#### Create NIN

- `POST /api/identity/create-nin`
- Middleware: `validateCreateNin`
- Body:
  - `nin` (string)
  - `firstName` (string)
  - `lastName` (string)
  - `dob` (string)
- Response:
  - `201` on success with created NIN data
  - `409` if NIN already exists

### User Authentication

#### Register User

- `POST /api/auth/register`
- Middleware: `validateCreateUser`
- Body:
  - `email` (string)
  - `password` (string, min 6 chars)
  - `phone` (string)
  - `kycType` (`bvn` or `nin`)
  - `kycID` (BVN or NIN value)
- Behavior:
  - Validates BVN or NIN through NIBSS
  - Creates a NIBSS account via `/api/account/create`
  - Stores a hashed password and user record
  - Creates an account record in MongoDB
- Response:
  - `201` on success with account number and balance

#### Login User

- `POST /api/auth/login`
- Middleware: `validateUserLogin`
- Body:
  - `email` (string)
  - `password` (string)
- Response:
  - `200` with JWT token valid for 30 minutes

### Account Enquiry

#### Name Enquiry

- `GET /api/account/name-enquiry/:accountNumber`
- Public endpoint
- Response:
  - `200` with account owner details
  - `404` if account not found

#### Balance Enquiry

- `GET /api/account/balance/:accountNumber`
- Requires `Authorization: Bearer <token>`
- Response:
  - `200` with account balance
  - `401` if token is missing or invalid

### Funds Transfer

#### Transfer Funds

- `POST /api/transfer`
- Requires `Authorization: Bearer <token>`
- Middleware: `transferValidation`
- Body:
  - `to` (destination account number)
  - `amount` (string or number)
- Validation checks:
  - Authenticated user exists
  - Balance sufficiency
  - Recipient account exists via NIBSS name enquiry
  - User BVN / NIN is valid
- Behavior:
  - Initiates transfer through NIBSS `/api/transfer`
  - Updates sender and receiver account balances locally
  - Stores a `Transaction` record in MongoDB
- Response:
  - `200` with transfer transaction details

### Transaction Status

#### Get Transaction Status

- `GET /api/transaction/:transactionId`
- Requires `Authorization: Bearer <token>`
- Response:
  - `200` with transaction status data
  - `400` if `transactionId` is missing

### Admin Operations

#### Fetch All Accounts

- `GET /api/admin/fetch-user-accounts`
- Public endpoint in current implementation
- Uses NIBSS `/api/accounts` to retrieve all account records
- Response:
  - `200` with account list

## Data Models

### User

- `firstName`: string
- `lastName`: string
- `email`: string (unique)
- `password`: string (hashed)
- `dob`: Date
- `bvn`: string (optional, unique)
- `nin`: string (optional, unique)
- `phone`: string

### Account

- `userId`: ObjectId reference to `User`
- `accountNumber`: string (unique)
- `bankCode`: string
- `accountBalance`: number

### Transaction

- `senderId`: ObjectId reference to `User`
- `receiverId`: ObjectId reference to `User` or `null`
- `transactionId`: string (unique)
- `amount`: number
- `from`: string
- `to`: string
- `status`: `FAILED`, `PENDING`, or `SUCCESS`

## Middleware Summary

- `authentication` - Verifies JWT token from `Authorization` header
- `validateCreateBvn` - Ensures required BVN fields are present
- `validateCreateNin` - Ensures required NIN fields are present
- `validateCreateUser` - Validates registration payload and performs BVN/NIN validation with NIBSS
- `validateUserLogin` - Verifies login credentials and password match
- `transferValidation` - Confirms sender has enough balance, validates identity, and verifies destination account

## Service Integrations

### NIBSS Public Services

- `POST /api/insertBvn` - Create BVN records
- `POST /api/insertNin` - Create NIN records
- `POST /api/validateBvn` - Validate BVN
- `POST /api/validateNin` - Validate NIN

### NIBSS Authenticated Services

- `POST /api/account/create` - Create a new bank account
- `GET /api/accounts` - Fetch all accounts
- `GET /api/account/name-enquiry/:accountNumber` - Resolve account name
- `POST /api/transfer` - Process fund transfer
- `GET /api/account/balance/:accountNumber` - Get balance
- `GET /api/transaction/:transactionId` - Get transaction status

### Token Management

The app fetches a NIBSS token from:

- `POST ${process.env.NIBSS_BASE_URL}api/auth/token`

Tokens are cached for 55 minutes to reduce repeated authentication calls.

## Notes

- The project uses ES modules (`type: module` in `package.json`).
- MongoDB must be reachable using `MONGO_URI`.
- The authenticated transfer and balance enquiry endpoints rely on JWT tokens.
- The admin route is currently not protected by authentication.

## Scripts

- `npm run dev` - Start the server with `nodemon`

---

For questions or enhancements, inspect `server.js` as the application entry point and the route modules under `routes/` for additional behavior.
