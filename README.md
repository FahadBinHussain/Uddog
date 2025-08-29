# UdDog Fundraising Platform

A modern, full-stack fundraising platform built with Next.js 14, enabling users to create campaigns, accept donations, and manage their fundraising efforts.

## 🌟 Features

### Core Functionality
- **Campaign Management**: Create, edit, and manage fundraising campaigns
- **Secure Donations**: Stripe-powered payment processing with one-time and recurring donations
- **User Authentication**: Email/password login with role-based access control
- **Real-time Updates**: Live donation tracking and campaign updates via Supabase
- **Admin Dashboard**: Comprehensive admin panel for platform management

### Advanced Features
- **Campaign Verification**: Admin verification system for campaign authenticity
- **Analytics Dashboard**: Detailed campaign performance analytics
- **Comment System**: Interactive commenting on campaigns
- **Fraud Reporting**: Community-driven fraud detection and reporting
- **Impact Stories**: Campaign updates and success stories
- **Social Sharing**: Built-in sharing capabilities
- **Responsive Design**: Mobile-first, fully responsive interface

## 🚀 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI component library
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Primary database
- **NextAuth.js**: Authentication library

### Integrations
- **Stripe**: Payment processing
- **Supabase**: Real-time functionality
- **Cloudinary**: Image upload and management

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account
- (Optional) Supabase project for real-time features

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/uddog-fundraising-platform.git
cd uddog-fundraising-platform
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup
Copy the environment example file and configure your variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:

#### Required Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/uddog_fundraising"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-secret-key"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"
```

#### Optional Variables
```env
# Supabase (for real-time features)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"

# Email (for notifications)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-email-password"

# File Upload
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

### 4. Database Setup
Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma db push
```

Seed the database (optional):
```bash
npx prisma db seed
```

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
uddog-fundraising-platform/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── admin/           # Admin-only endpoints
│   │   ├── auth/            # Authentication routes
│   │   ├── campaigns/       # Campaign CRUD operations
│   │   ├── donations/       # Donation processing
│   │   ├── payments/        # Stripe integration
│   │   ├── reports/         # Fraud reporting
│   │   ├── stats/           # Platform statistics
│   │   ├── stories/         # Impact stories
│   │   └── users/           # User management
│   ├── admin/               # Admin dashboard
│   ├── auth/                # Authentication pages
│   ├── campaigns/           # Campaign pages
│   ├── dashboard/           # User dashboard
│   ├── settings/            # User settings
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   └── ui/                  # UI component library
├── contexts/                # React contexts
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── prisma/                  # Database schema and migrations
└── public/                  # Static assets
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

### Code Style
This project uses:
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Tailwind CSS**: Styling

## 📊 Database Schema

### Core Models
- **User**: User accounts and authentication
- **Campaign**: Fundraising campaigns
- **Donation**: Donation records
- **Comment**: Campaign comments
- **ImpactStory**: Campaign updates
- **Verification**: Campaign verification records
- **FraudReport**: Fraud reporting system

### Relationships
- Users can create multiple campaigns
- Campaigns receive multiple donations
- Users can make multiple donations
- Campaigns can have verification records
- Fraud reports are linked to campaigns

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub/GitLab
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure all required environment variables are set:
- `DATABASE_URL`: Production database connection
- `NEXTAUTH_SECRET`: Strong secret for production
- `STRIPE_SECRET_KEY`: Live Stripe secret key
- `NEXTAUTH_URL`: Your production domain

## 🔐 Security Features

- **Authentication**: Secure user authentication with NextAuth.js
- **Authorization**: Role-based access control (user, creator, admin)
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **CSRF Protection**: Built-in CSRF protection
- **SQL Injection Prevention**: Prisma ORM prevents SQL injection
- **Secure Headers**: Security headers configured

## 📱 API Documentation

### Authentication
Most endpoints require authentication. Include the session token in requests.

### Campaign Endpoints
```
GET    /api/campaigns           # List campaigns
POST   /api/campaigns           # Create campaign
GET    /api/campaigns/:id       # Get campaign details
PATCH  /api/campaigns/:id       # Update campaign
DELETE /api/campaigns/:id       # Delete campaign
```

### Donation Endpoints
```
GET  /api/donations             # List donations
POST /api/donations             # Create donation
```

### User Endpoints
```
GET    /api/users               # List users (admin only)
PATCH  /api/users               # Update user profile
DELETE /api/users               # Delete user account
```

### Admin Endpoints
```
GET  /api/admin/verify          # Get verification requests
POST /api/admin/verify          # Process verification
GET  /api/stats/platform        # Platform statistics
```

## 🎨 UI Components

This project uses **shadcn/ui** components built on top of **Radix UI** primitives:

- **Forms**: Input, Textarea, Select, Checkbox
- **Navigation**: Tabs, Dropdown Menu
- **Feedback**: Alert, Toast, Progress
- **Layout**: Card, Separator, Sheet
- **Data Display**: Badge, Button, Avatar

## 🔄 Real-time Features

Real-time functionality powered by Supabase:
- Live donation updates
- Campaign progress tracking
- Real-time notifications
- Activity feeds

## 🧪 Testing

### Running Tests
```bash
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Test Structure
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user journey testing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact support@uddog.com

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Vercel**: For hosting and deployment platform
- **Stripe**: For secure payment processing
- **Supabase**: For real-time database features
- **shadcn**: For beautiful UI components
- **Prisma**: For the excellent database ORM

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Core campaign functionality
- [x] User authentication
- [x] Payment processing
- [x] Admin dashboard
- [x] Basic analytics

### Phase 2 (Planned)
- [ ] Mobile application
- [ ] Advanced analytics
- [ ] Multi-currency support
- [ ] Email campaigns
- [ ] Integration with social media

### Phase 3 (Future)
- [ ] AI-powered fraud detection
- [ ] Blockchain integration
- [ ] Advanced reporting
- [ ] White-label solutions
- [ ] API marketplace

---

Built with ❤️ by the UdDog team