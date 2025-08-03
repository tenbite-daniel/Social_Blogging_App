# 📝 Social Blogging App

A full-stack social blogging platform built with **React** and **Node.js**, featuring user authentication, post creation, commenting, likes, and a modern dark/light theme system.

## Team Members:
Edmond Oketch-ui/ux designer
Ian Karanja-GenAi
Karanja Kariuki-GenAi
Tenbite Daniel-FullStack
Ntoiti Fidelis-FullStack


##  Features

### Authentication & User Management
- **User Registration** with email and password validation
- **Secure Login** with JWT token-based authentication
- **Password Reset** functionality
- **localStorage-based** session management
- **Protected Routes** for authenticated users only

###  Blog Post Management
- **Create Posts** with title, content, summary, and images
- **View All Posts** with pagination support
- **Single Post View** with detailed post information
- **Author Information** display with avatars and user details
- **Post Editing & Deletion** (author-only permissions)

### Social Features
- **Commenting System** with real-time updates
- **Like/Unlike Posts** with heart animations
- **View Counter** with unique user tracking
- **User Profiles** with post history

###  User Interface
- **Modern Design** with Tailwind CSS
- **Dark/Light Theme** toggle with system preference detection
- **Responsive Layout** optimized for all devices
- **Smooth Animations** and transitions
- **Professional Typography** with serif fonts for readability

###  Additional Features
- **Image Upload Support** for blog posts
- **Tag System** for post categorization
- **Search Functionality** (ready for implementation)
- **CORS Configuration** for secure cross-origin requests

##  Tech Stack

### Frontend
- **React 19.1** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router Dom** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Context API** - State management (Auth & Theme)

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing and security
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

##  Project Structure

```
SOCIALBLOGAPP/
├── frontend/                   
│   ├── src/
│   │   ├── api/               
│   │   │   └── axiosInstance.js
│   │   ├── components/       
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SideNav.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/          
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── layouts/         
│   │   │   └── AuthenticatedLayout.jsx
│   │   ├── pages/           
│   │   │   ├── Homepage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── SingleBlogPost.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── About.jsx
│   │   │   ├── PasswordReset.jsx
│   │   │   └── BeforeSigningUp.jsx
│   │   ├── assets/            
│   │   └── App.jsx            
│   ├── public/                
│   └── package.json
│
├── backend/                    
│   ├── config/                
│   │   ├── db.js            
│   │   └── corsOptions.js    
│   ├── controllers/           
│   │   └── authController.js
│   ├── middleware/        
│   │   └── verifyToken.js
│   ├── models/              
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/               
│   │   ├── authRoutes.js
│   │   └── posts.js
│   ├── server.js             
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tenbite-daniel/Social_Blogging_App.git
   cd SOCIALBLOGAPP
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/socialblog
   ACCESS_TOKEN_SECRET=your_jwt_secret_key_here
   REFRESH_TOKEN_SECRET=your_refresh_jwt_secret_key_here
   ```

###  Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on: `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs on: `http://localhost:5173`

## Application Pages

### Public Pages
- **Landing Page** (`/`) - Welcome page for new visitors
- **About** (`/about`) - Information about the platform
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Password Reset** (`/password-reset`) - Account recovery

### Protected Pages (Authentication Required)
- **Homepage** (`/home`) - Main blog feed with all posts
- **Create Post** (`/create-post`) - Write and publish new blog posts
- **Single Post** (`/post/:id`) - Detailed view of individual posts
- **Profile** (`/profile`) - User profile and post management

##  Theme System

The application features a comprehensive dark/light theme system:

- **Theme Toggle** - Switch between light and dark modes
- **System Preference Detection** - Automatically detects user's system theme
- **Persistent Storage** - Remembers user's theme preference
- **Smooth Transitions** - Animated theme switching across all components

##  Authentication Flow

1. **Registration** - Users create accounts with email/password
2. **Email Validation** - Server-side email format validation
3. **Password Hashing** - bcrypt encryption for secure storage
4. **JWT Tokens** - Stateless authentication with access tokens
5. **Protected Routes** - Automatic redirection for unauthorized access
6. **Session Management** - localStorage-based token persistence

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  name: String,
  avatar: String,
  timestamps: true
}
```

### Post Model
```javascript
{
  title: String (required),
  summary: String (required),
  content: String (required),
  image: String,
  author: ObjectId (ref: User),
  tags: [String],
  likes: Number (default: 0),
  likedBy: [ObjectId] (ref: User),
  views: Number (default: 0),
  viewedBy: [ObjectId] (ref: User),
  comments: [CommentSchema],
  timestamps: true
}
```

### Comment Schema (Embedded)
```javascript
{
  content: String (required),
  author: ObjectId (ref: User),
  timestamps: true
}
```

##  API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /reset-password` - Password reset request

### Post Routes (`/api/posts`)
- `GET /` - Get all posts (with pagination)
- `GET /:id` - Get single post by ID
- `POST /` - Create new post (auth required)
- `PUT /:id` - Update post (auth required, author only)
- `DELETE /:id` - Delete post (auth required, author only)
- `POST /:id/like` - Toggle like on post (auth required)
- `POST /:id/comments` - Add comment to post (auth required)

## Development Features

- **Hot Reload** - Instant updates during development
- **ESLint Configuration** - Code quality and consistency
- **Responsive Design** - Mobile-first approach
- **Error Handling** - Comprehensive error messages and fallbacks
- **Loading States** - User-friendly loading indicators
- **Form Validation** - Client and server-side validation

##  Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting platform
```

### Backend Deployment
```bash
cd backend
# Set production environment variables
# Deploy to your preferred hosting platform (Heroku, Vercel, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b branchnamee`)
3. Commit your changes (`git commit -m " feature")
4. Push to the branch (`git push origin branchname`)
5. Open a Pull Request



## Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for the flexible database solution
- All open-source contributors who made this project possible

---


