# SchoolConnect - School Management System

A modern school management system built with Next.js, featuring OTP-based email authentication and secure school data management.

## Features

### 🔐 Authentication System
- **OTP-based signup and login** - Secure email verification using 6-digit OTPs
- **JWT-based sessions** - Secure token-based authentication with HTTP-only cookies
- **Email verification** - Users must verify their email before accessing protected features
- **Automatic token refresh** - Seamless session management

### 🏫 School Management
- **Public school directory** - Anyone can view all schools
- **Protected school creation** - Only authenticated users can add schools
- **Rich school data** - Name, address, contact info, email, and images
- **User attribution** - Track who added each school

### 🎨 Modern UI/UX
- **Responsive design** - Works on all device sizes
- **Tailwind CSS styling** - Modern, clean interface
- **Loading states** - Smooth user experience with loading indicators
- **Toast notifications** - Real-time feedback for user actions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication**: JWT tokens, bcryptjs, OTP verification
- **Database**: PostgreSQL with connection pooling
- **Email**: Nodemailer for OTP delivery
- **Styling**: Tailwind CSS
- **File Upload**: Custom file handling with validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- SMTP email service (Gmail recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SchoolConnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/schoolconnect
   JWT_SECRET=your-super-secret-jwt-key-here
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   NODE_ENV=development
   ```

4. **Set up the database**
   
   The application will automatically create the required tables when you start it. The database schema includes:
   - `app_users` - User accounts with email verification
   - `otp_verifications` - Temporary OTP storage
   - `schools` - School data with user attribution

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication Flow

### Signup Process
1. User enters email address
2. System generates and sends 6-digit OTP
3. User verifies OTP to complete registration
4. JWT token is created and stored as HTTP-only cookie

### Login Process
1. User enters email address
2. System sends login OTP to verified email
3. User enters OTP to login
4. JWT token is refreshed and session established

### Security Features
- **OTP expiration** - Codes expire after 10 minutes
- **Email verification required** - Users must verify email to access protected features
- **JWT token validation** - All protected routes verify valid tokens
- **HTTP-only cookies** - Tokens stored securely, not accessible via JavaScript
- **Password hashing** - OTPs are hashed before database storage

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/verify-otp` - Verify email with OTP
- `POST /api/auth/login` - Send login OTP or verify login
- `POST /api/auth/logout` - Clear authentication session
- `GET /api/auth/me` - Get current user info

### Schools
- `GET /api/schools` - Get all schools (public)
- `POST /api/schools` - Create new school (authenticated only)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── schools/      # School management endpoints
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── verify-otp/       # OTP verification page
│   ├── schools/          # Schools directory page
│   └── add-school/       # Add school page (protected)
├── components/            # React components
│   └── Navigation.tsx    # Main navigation component
├── contexts/             # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── lib/                  # Utility functions
│   ├── auth.ts          # Server-side auth utilities
│   ├── authClient.ts    # Client-side auth functions
│   └── database.ts      # Database connection and setup
├── types/                # TypeScript type definitions
│   ├── auth.ts          # Authentication types
│   └── school.ts        # School data types
└── middleware.ts         # Route protection middleware
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `SMTP_HOST` | SMTP server hostname | Yes |
| `SMTP_PORT` | SMTP server port | Yes |
| `SMTP_USER` | SMTP username/email | Yes |
| `SMTP_PASS` | SMTP password/app password | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Email Configuration

For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate an app-specific password
3. Use the app password in `SMTP_PASS`

For development, OTPs will be logged to console if SMTP is not configured.

## Database Schema

The application uses three main tables:

### app_users
- `id` - Primary key
- `email` - Unique email address
- `is_verified` - Email verification status
- `created_at`, `updated_at` - Timestamps

### otp_verifications  
- `id` - Primary key
- `user_id` - Foreign key to users
- `otp_hash` - Hashed OTP code
- `expires_at` - Expiration timestamp

### schools
- `id` - Primary key
- `name`, `address`, `city`, `state` - School details
- `contact`, `email_id` - Contact information
- `image` - Optional school image
- `created_by` - Foreign key to user who added school
- `created_at`, `updated_at` - Timestamps

## Screenshots

<img width="800" height="500" alt="image" src="https://github.com/user-attachments/assets/7321239d-2126-4847-b8ca-84d3c17b0e0a" />

<img width="800" height="500" alt="image" src="https://github.com/user-attachments/assets/cad7a583-9d41-48fe-8e25-2d09b6929502" />

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

<img width="800" height="500" alt="image" src="https://github.com/user-attachments/assets/957e8318-43df-4c31-81a1-5eb5a21f4d30" />
