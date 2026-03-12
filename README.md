# Vault-X

Vault-X is a cybersecurity-focused password vault and breach awareness platform built with a microservices architecture. It combines secure credential storage, email breach lookup, Google sign-in, and an in-app AI security assistant in a single product experience.

## Highlights

- Google OAuth sign-in
- Password vault protected by a master key
- Encrypted password storage
- Email breach lookup
- AI assistant for Vault-X usage and security guidance
- Microservices architecture with dedicated gateway, auth, and vault services
- PostgreSQL with Prisma and Neon

## Architecture

This project is split into four parts:

- `frontend` - React + Vite client
- `gateway` - Express API gateway
- `auth-service` - user auth, profile data, breach tracking, AI assistant
- `vault-service` - master key handling and encrypted password storage

### Request Flow

`frontend -> gateway -> auth-service / vault-service`

The gateway verifies JWTs for protected routes and forwards requests to the appropriate backend service.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL on Neon
- ORM: Prisma
- Authentication: Google OAuth + JWT
- AI: Gemini API
- Deployment: Vercel (frontend) + Render-style backend hosting

## Features

### 1. Google Login

Users sign in with Google, and a JWT is issued by the auth service.

### 2. Breach Check

Users can check whether an email appears in known breach data. Breach data is stored against the user profile when relevant.

### 3. Secure Vault

The vault experience is protected by a master key:

- Master keys are hashed before storage
- Saved passwords are encrypted before being stored
- Passwords can be retrieved only after successful master key verification

### 4. AI Security Assistant

The profile page includes a Gemini-powered assistant that can:

- explain how to use Vault-X
- answer password safety questions
- explain breach response steps
- give app-specific security guidance

## Project Structure

```text
Vault-X/
|- auth-service/
|- frontend/
|- gateway/
|- vault-service/
```

## Security Notes

- Master keys are hashed before storage
- Vault passwords are encrypted, not stored in plaintext
- Protected routes require JWT validation at the gateway
- Secrets should never be committed to GitHub

## Why Vault-X?

Vault-X was built to combine password security, breach awareness, and practical cybersecurity guidance into one focused user experience.

It is also a strong demonstration project for:

- microservices architecture
- API gateway patterns
- Prisma with PostgreSQL
- secure credential handling
- third-party auth integration
- AI-assisted product features

## Author

Built and maintained by [Kavay](https://github.com/kavay27)