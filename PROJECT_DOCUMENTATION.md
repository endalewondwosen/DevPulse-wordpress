# DevPulse WordPress Content Management System

## Overview

DevPulse is a WordPress-inspired content management system designed to showcase projects and code snippets in a portfolio format. It provides a centralized platform for managing multiple projects with different purposes, featuring authentication, search capabilities, and analytics.

## Tech Stack

### Frontend
- **React 19.0.0** - Modern React with TypeScript
- **TailwindCSS 4.1.14** - Utility-first CSS framework
- **Motion (Framer Motion)** - Animation library
- **Lucide React** - Icon library
- **Vite 6.2.0** - Build tool and development server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite (better-sqlite3)** - Database engine
- **JWT** - Authentication tokens
- **Docker** - Containerization

## Data Structure

### Database Schema

The system uses a WordPress-like structure with three main tables:

#### `posts` Table
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL, -- 'project' or 'snippet'
  status TEXT DEFAULT 'publish', -- 'publish' or 'private'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `post_meta` Table
```sql
CREATE TABLE post_meta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER,
  meta_key TEXT,
  meta_value TEXT,
  FOREIGN KEY(post_id) REFERENCES posts(id)
);
```

#### `api_logs` Table
```sql
CREATE TABLE api_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT,
  method TEXT,
  post_id INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Data Model

**Posts** can be of two types:
- **Projects**: Full portfolio projects with URLs, tech stack info
- **Snippets**: Code snippets with language metadata

**Metadata** stored in post_meta includes:
- `github_url` - Repository link
- `project_url` - Live demo link
- `tech_stack` - Technologies used
- `language` - Programming language (for snippets)

## Features

### Public Features
- **Portfolio Display**: Show projects and code snippets
- **Search Functionality**: Filter by title or content
- **Responsive Design**: Mobile-friendly interface
- **Public/Private Content**: Visibility control

### Admin Features
- **Authentication**: JWT-based login system
- **CRUD Operations**: Create, read, update, delete posts
- **Analytics Dashboard**: API usage statistics
- **Real-time Notifications**: Success/error feedback

### Technical Features
- **REST API**: WordPress-like endpoints
- **Database Persistence**: SQLite storage
- **Request Logging**: API endpoint tracking
- **Error Handling**: Comprehensive error management

## API Endpoints

### Authentication
- `POST /api/login` - User authentication

### Posts Management
- `GET /api/posts` - List posts (with type and search filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (authenticated)
- `PUT /api/posts/:id` - Update post (authenticated)
- `DELETE /api/posts/:id` - Delete post (authenticated)

### Analytics
- `GET /api/stats` - Usage statistics
- `GET /api/health` - Health check

## File Structure

```
DevPulse-wordpress/
├── src/
│   ├── App.tsx          # Main React component
│   ├── index.css        # Global styles
│   └── main.tsx         # React entry point
├── server.ts            # Express server and API routes
├── package.json         # Dependencies and scripts
├── Dockerfile           # Container configuration
├── .env.example         # Environment variables template
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build configuration
└── README.md           # Project documentation
```

## Environment Configuration

### Required Environment Variables
```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"  # For AI features
APP_URL="MY_APP_URL"                # Application URL
```

### Default Authentication
- **Username**: admin
- **Password**: password
- **JWT Secret**: devpulse-secret-key-123

## Deployment

### Docker Deployment
The application includes a Dockerfile for containerized deployment:

```dockerfile
FROM node:20-slim
WORKDIR /usr/src/app
# Installs dependencies and builds for production
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Checklist
- [ ] Change default admin credentials
- [ ] Update JWT secret key
- [ ] Configure production environment variables
- [ ] Set up database backup strategy
- [ ] Configure domain and SSL
- [ ] Monitor API usage and logs

## Database Seeding

The system includes sample data for demonstration:
- 2 sample projects with metadata
- 1 code snippet
- 1 private project (admin-only)

## Security Considerations

- JWT tokens expire after 24 hours
- Public/private content separation
- API request logging
- Input validation on all endpoints
- Error handling without sensitive data exposure

## Development

### Local Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## Future Enhancements

Potential improvements for production use:
- User role management
- File upload capabilities
- Advanced search with filters
- Export/import functionality
- Multi-language support
- Enhanced analytics
- Email notifications

---

*Generated on: March 6, 2026*
*Project Status: Production Ready*
