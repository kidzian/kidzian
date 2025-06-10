import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Search, ChevronLeft, TrendingUp, Code, Smartphone, Globe, Database, Shield, Cpu, Heart, MessageCircle, Eye, Share2, BookOpen, Tag } from 'lucide-react';

const TechBlog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { name: 'All', icon: Globe, count: 24 },
    { name: 'Programming', icon: Code, count: 8 },
    { name: 'Web Development', icon: Globe, count: 6 },
    { name: 'Mobile Apps', icon: Smartphone, count: 4 },
    { name: 'Data Science', icon: Database, count: 3 },
    { name: 'Cybersecurity', icon: Shield, count: 2 },
    { name: 'AI & ML', icon: Cpu, count: 1 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Complete Guide to React Hooks: From Basics to Advanced Patterns",
      excerpt: "Master React Hooks with practical examples, best practices, and advanced patterns. Learn useState, useEffect, useContext, and custom hooks.",
      content: `React Hooks revolutionized how we write React components by allowing us to use state and lifecycle methods in functional components. In this comprehensive guide, we'll explore everything from basic hooks to advanced patterns.

## What are React Hooks?

React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and have become the standard way to write React components.

### Basic Hooks

**useState Hook**
The useState hook allows you to add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

**useEffect Hook**
The useEffect hook lets you perform side effects in function components:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### Advanced Patterns

**Custom Hooks**
Custom hooks allow you to extract component logic into reusable functions:

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}
\`\`\`

## Best Practices

1. **Always call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Use the ESLint plugin** - Install eslint-plugin-react-hooks to catch common mistakes
3. **Optimize with useMemo and useCallback** - Prevent unnecessary re-renders
4. **Keep effects focused** - Split unrelated logic into separate useEffect calls

## Conclusion

React Hooks provide a powerful and flexible way to manage state and side effects in React applications. By following best practices and understanding the underlying principles, you can write more maintainable and efficient React code.`,
      author: "Sarah Johnson",
      authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face&auto=format",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Programming",
      tags: ["React", "JavaScript", "Frontend", "Hooks"],
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop&auto=format",
      featured: true,
      views: 2847,
      likes: 156,
      comments: 23
    },
    {
      id: 2,
      title: "Building Responsive Web Applications with Tailwind CSS",
      excerpt: "Learn how to create beautiful, responsive web applications using Tailwind CSS utility classes and responsive design principles.",
      content: `Tailwind CSS has revolutionized how developers approach styling web applications. This utility-first CSS framework provides low-level utility classes that let you build custom designs without leaving your HTML.

## Why Tailwind CSS?

Tailwind CSS offers several advantages over traditional CSS frameworks:

- **Utility-first approach** - Build complex components from simple utility classes
- **Responsive design** - Built-in responsive modifiers for all utilities
- **Customizable** - Easily customize colors, spacing, typography, and more
- **Performance** - Only includes the CSS you actually use

### Getting Started

Install Tailwind CSS in your project:

\`\`\`bash
npm install -D tailwindcss
npx tailwindcss init
\`\`\`

Configure your template paths in \`tailwind.config.js\`:

\`\`\`javascript
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

### Responsive Design

Tailwind uses a mobile-first breakpoint system:

\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- This div is full width on mobile, half width on medium screens, and one-third width on large screens -->
</div>
\`\`\`

### Component Examples

**Card Component**
\`\`\`html
<div class="max-w-sm rounded overflow-hidden shadow-lg">
  <img class="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
    <p class="text-gray-700 text-base">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    </p>
  </div>
</div>
\`\`\`

**Navigation Bar**
\`\`\`html
<nav class="bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <img class="h-8 w-8" src="/logo.svg" alt="Logo">
        </div>
      </div>
    </div>
  </div>
</nav>
\`\`\`

## Best Practices

1. **Use semantic HTML** - Tailwind works best with proper HTML structure
2. **Extract components** - Create reusable components for repeated patterns
3. **Customize your design system** - Extend Tailwind's default theme
4. **Use PurgeCSS** - Remove unused styles in production

## Conclusion

Tailwind CSS provides a powerful and flexible approach to styling web applications. Its utility-first philosophy and responsive design capabilities make it an excellent choice for modern web development.`,
      author: "Mike Chen",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format",
      date: "2024-01-12",
      readTime: "6 min read",
      category: "Web Development",
      tags: ["CSS", "Tailwind", "Responsive Design", "Frontend"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&auto=format",
      featured: false,
      views: 1923,
      likes: 89,
      comments: 15
    },
    {
      id: 3,
      title: "Introduction to Machine Learning with Python",
      excerpt: "Get started with machine learning using Python. Learn about algorithms, data preprocessing, and building your first ML model.",
      content: `Machine Learning (ML) is transforming industries and creating new opportunities for developers. Python has become the go-to language for ML due to its simplicity and powerful libraries.

## What is Machine Learning?

Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.

### Types of Machine Learning

**Supervised Learning**
- Uses labeled training data
- Examples: Classification, Regression
- Algorithms: Linear Regression, Decision Trees, Random Forest

**Unsupervised Learning**
- Finds patterns in unlabeled data
- Examples: Clustering, Dimensionality Reduction
- Algorithms: K-Means, PCA, DBSCAN

**Reinforcement Learning**
- Learns through interaction with environment
- Examples: Game playing, Robotics
- Algorithms: Q-Learning, Policy Gradient

### Essential Python Libraries

**NumPy**
\`\`\`python
import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2], [3, 4]])

# Mathematical operations
result = np.mean(arr)
\`\`\`

**Pandas**
\`\`\`python
import pandas as pd

# Load data
df = pd.read_csv('data.csv')

# Data exploration
print(df.head())
print(df.describe())
\`\`\`

**Scikit-learn**
\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)
\`\`\`

### Building Your First Model

Here's a simple example of building a linear regression model:

\`\`\`python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Load and prepare data
data = pd.read_csv('house_prices.csv')
X = data[['size', 'bedrooms', 'age']]
y = data['price']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'Mean Squared Error: {mse}')
print(f'R² Score: {r2}')
\`\`\`

## Best Practices

1. **Data Quality** - Clean and preprocess your data thoroughly
2. **Feature Engineering** - Create meaningful features from raw data
3. **Model Validation** - Use cross-validation to assess model performance
4. **Avoid Overfitting** - Use regularization and validation techniques

## Next Steps

- Explore deep learning with TensorFlow or PyTorch
- Learn about feature engineering and selection
- Study advanced algorithms like ensemble methods
- Practice with real-world datasets from Kaggle

Machine learning is a vast field with endless possibilities. Start with simple projects and gradually work your way up to more complex problems.`,
      author: "Dr. Priya Patel",
      authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face&auto=format",
      date: "2024-01-10",
      readTime: "10 min read",
      category: "AI & ML",
      tags: ["Python", "Machine Learning", "Data Science", "AI"],
      image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=400&fit=crop&auto=format",
      featured: true,
      views: 3421,
      likes: 234,
      comments: 45
    },
    {
      id: 4,
      title: "Mobile App Development: Native vs Cross-Platform",
      excerpt: "Compare native and cross-platform mobile development approaches. Learn about React Native, Flutter, and native development pros and cons.",
      content: `Choosing the right approach for mobile app development is crucial for project success. This guide compares native and cross-platform development to help you make an informed decision.

## Native Development

Native development involves creating apps specifically for one platform using platform-specific languages and tools.

### iOS Native Development
- **Language**: Swift or Objective-C
- **IDE**: Xcode
- **Advantages**: Best performance, full access to platform features
- **Disadvantages**: Platform-specific, higher development cost

### Android Native Development
- **Language**: Kotlin or Java
- **IDE**: Android Studio
- **Advantages**: Optimal performance, complete platform integration
- **Disadvantages**: Separate codebase for each platform

## Cross-Platform Development

Cross-platform development allows you to write code once and deploy to multiple platforms.

### React Native
\`\`\`javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, React Native!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
\`\`\`

### Flutter
\`\`\`dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Hello Flutter'),
        ),
        body: Center(
          child: Text(
            'Hello, Flutter!',
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    );
  }
}
\`\`\`

## Comparison Matrix

| Factor | Native | React Native | Flutter |
|--------|--------|--------------|---------|
| Performance | Excellent | Good | Good |
| Development Speed | Slow | Fast | Fast |
| Code Reuse | 0% | 70-80% | 90%+ |
| Platform Features | Full Access | Good | Good |
| Learning Curve | Steep | Moderate | Moderate |

## When to Choose What?

**Choose Native When:**
- Performance is critical
- Heavy use of platform-specific features
- Long-term maintenance is planned
- Budget allows for separate teams

**Choose Cross-Platform When:**
- Faster time to market is needed
- Limited development resources
- Simple to moderate app complexity
- Consistent UI across platforms

## Development Tools and Setup

### React Native Setup
\`\`\`bash
# Install React Native CLI
npm install -g react-native-cli

# Create new project
npx react-native init MyApp

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
\`\`\`

### Flutter Setup
\`\`\`bash
# Install Flutter
git clone https://github.com/flutter/flutter.git

# Create new project
flutter create my_app

# Run the app
flutter run
\`\`\`

## Best Practices

1. **Plan Your Architecture** - Design a scalable app structure
2. **Follow Platform Guidelines** - Respect platform-specific design patterns
3. **Test on Real Devices** - Emulators don't always reflect real performance
4. **Optimize for Performance** - Profile and optimize critical paths
5. **Plan for Updates** - Consider maintenance and update strategies

## Conclusion

The choice between native and cross-platform development depends on your specific requirements, timeline, and resources. Consider factors like performance needs, development timeline, team expertise, and long-term maintenance when making your decision.`,
      author: "Alex Rodriguez",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format",
      date: "2024-01-08",
      readTime: "7 min read",
      category: "Mobile Apps",
      tags: ["Mobile Development", "React Native", "Flutter", "iOS", "Android"],
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop&auto=format",
      featured: false,
      views: 1654,
      likes: 78,
      comments: 12
    },
    {
      id: 5,
      title: "Cybersecurity Best Practices for Developers",
      excerpt: "Essential security practices every developer should know. Learn about common vulnerabilities and how to protect your applications.",
      content: `Security should be a top priority in software development. This guide covers essential cybersecurity practices that every developer should implement to protect applications and user data.

## Common Security Vulnerabilities

### OWASP Top 10

The Open Web Application Security Project (OWASP) maintains a list of the most critical web application security risks:

1. **Injection Attacks**
2. **Broken Authentication**
3. **Sensitive Data Exposure**
4. **XML External Entities (XXE)**
5. **Broken Access Control**
6. **Security Misconfiguration**
7. **Cross-Site Scripting (XSS)**
8. **Insecure Deserialization**
9. **Using Components with Known Vulnerabilities**
10. **Insufficient Logging & Monitoring**

### SQL Injection Prevention

**Vulnerable Code:**
\`\`\`javascript
// DON'T DO THIS
const query = \`SELECT * FROM users WHERE id = \${userId}\`;
db.query(query);
\`\`\`

**Secure Code:**
\`\`\`javascript
// Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
\`\`\`

### Cross-Site Scripting (XSS) Prevention

**Input Sanitization:**
\`\`\`javascript
const DOMPurify = require('dompurify');

// Sanitize user input
const cleanInput = DOMPurify.sanitize(userInput);
\`\`\`

**Content Security Policy:**
\`\`\`html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
\`\`\`

## Authentication and Authorization

### Secure Password Handling

\`\`\`javascript
const bcrypt = require('bcrypt');

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
\`\`\`

### JWT Implementation

\`\`\`javascript
const jwt = require('jsonwebtoken');

// Generate token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
    issuer: 'your-app-name'
  });
};

// Verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
\`\`\`

## Data Protection

### Encryption at Rest

\`\`\`javascript
const crypto = require('crypto');

const encrypt = (text, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decrypt = (encryptedData, key) => {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
\`\`\`

### HTTPS Implementation

\`\`\`javascript
const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

// Force HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(\`https://\${req.header('host')}\${req.url}\`);
  } else {
    next();
  }
});

// SSL certificate
const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443);
\`\`\`

## Security Headers

\`\`\`javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
\`\`\`

## Security Testing

### Automated Security Scanning

\`\`\`bash
# Install security audit tools
npm install -g audit-ci
npm install --save-dev eslint-plugin-security

# Run security audit
npm audit
audit-ci --moderate
\`\`\`

### Penetration Testing Checklist

1. **Input Validation Testing**
2. **Authentication Testing**
3. **Session Management Testing**
4. **Authorization Testing**
5. **Data Validation Testing**
6. **Error Handling Testing**
7. **Cryptography Testing**

## Best Practices Summary

1. **Validate All Input** - Never trust user input
2. **Use HTTPS Everywhere** - Encrypt data in transit
3. **Implement Proper Authentication** - Use strong password policies
4. **Keep Dependencies Updated** - Regularly update libraries
5. **Log Security Events** - Monitor for suspicious activity
6. **Follow Principle of Least Privilege** - Grant minimal necessary permissions
7. **Regular Security Audits** - Conduct periodic security reviews

## Conclusion

Security is not a one-time implementation but an ongoing process. Stay updated with the latest security threats and best practices. Regular security audits and keeping dependencies updated are crucial for maintaining a secure application.`,
      author: "Jennifer Kim",
      authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format",
      date: "2024-01-05",
      readTime: "12 min read",
      category: "Cybersecurity",
      tags: ["Security", "Web Development", "Authentication", "Encryption"],
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=400&fit=crop&auto=format",
      featured: false,
      views: 2156,
      likes: 145,
      comments: 28
    },
    {
      id: 6,
      title: "Getting Started with Node.js and Express.js",
      excerpt: "Build your first web server with Node.js and Express.js. Learn about routing, middleware, and building RESTful APIs.",
      content: `Node.js has revolutionized server-side JavaScript development. Combined with Express.js, it provides a powerful platform for building web applications and APIs.

## What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side, enabling full-stack JavaScript development.

### Key Features of Node.js

- **Event-driven architecture**
- **Non-blocking I/O operations**
- **Single-threaded with event loop**
- **NPM ecosystem**
- **Cross-platform compatibility**

## Setting Up Your Environment

### Installation

\`\`\`bash
# Install Node.js (includes npm)
# Download from nodejs.org or use a package manager

# Verify installation
node --version
npm --version

# Initialize a new project
mkdir my-express-app
cd my-express-app
npm init -y

# Install Express.js
npm install express
\`\`\`

## Building Your First Express Server

### Basic Server Setup

\`\`\`javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Hello, Express!' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

### Routing in Express

\`\`\`javascript
// GET route
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

// POST route
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  // Process user creation
  res.status(201).json({ 
    message: 'User created successfully',
    user: { name, email }
  });
});

// PUT route
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  // Process user update
  res.json({ 
    message: 'User updated successfully',
    user: { id, name, email }
  });
});

// DELETE route
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  // Process user deletion
  res.json({ message: 'User deleted successfully' });
});
\`\`\`

## Middleware in Express

Middleware functions execute during the request-response cycle and can modify request and response objects.

### Built-in Middleware

\`\`\`javascript
// Serve static files
app.use(express.static('public'));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
\`\`\`

### Custom Middleware

\`\`\`javascript
// Logging middleware
const logger = (req, res, next) => {
  console.log(\`\${new Date().toISOString()} - \${req.method} \${req.url}\`);
  next();
};

app.use(logger);

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Verify token logic here
  req.user = { id: 1, name: 'John Doe' }; // Mock user
  next();
};

// Protected route
app.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
\`\`\`

### Error Handling Middleware

\`\`\`javascript
// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
\`\`\`

## Building a RESTful API

### User Management API

\`\`\`javascript
const express = require('express');
const app = express();

// Mock database
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

app.use(express.json());

// GET all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// CREATE new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// UPDATE user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email } = req.body;
  
  if (name) user.name = name;
  if (email) user.email = email;
  
  res.json(user);
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});
\`\`\`

## Database Integration

### Using MongoDB with Mongoose

\`\`\`javascript
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
\`\`\`

## Best Practices

1. **Use Environment Variables** - Store configuration in environment variables
2. **Implement Proper Error Handling** - Use try-catch blocks and error middleware
3. **Validate Input Data** - Use libraries like Joi or express-validator
4. **Use CORS** - Configure Cross-Origin Resource Sharing properly
5. **Implement Rate Limiting** - Prevent abuse with rate limiting middleware
6. **Use Helmet** - Secure Express apps with various HTTP headers
7. **Log Requests** - Implement proper logging for debugging and monitoring

### Environment Configuration

\`\`\`javascript
// .env file
PORT=3000
DB_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key

// Using dotenv
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
\`\`\`

## Conclusion

Node.js and Express.js provide a powerful foundation for building web applications and APIs. Start with simple projects and gradually add complexity as you become more comfortable with the ecosystem. The key is to understand the asynchronous nature of Node.js and leverage Express.js middleware effectively.`,
      author: "David Wilson",
      authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face&auto=format",
      date: "2024-01-03",
      readTime: "9 min read",
      category: "Programming",
      tags: ["Node.js", "Express.js", "JavaScript", "Backend", "API"],
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop&auto=format",
      featured: false,
      views: 1789,
      likes: 92,
      comments: 18
    }
  ];

  useEffect(() => {
    let filtered = blogPosts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [selectedCategory, searchTerm, blogPosts]);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 5);
  const popularTags = ['React', 'JavaScript', 'Python', 'CSS', 'Node.js', 'AI', 'Mobile', 'Security'];

  if (selectedPost) {
    return <BlogPost post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-md border-b sticky top-0 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-teal-700 bg-clip-text text-transparent">
                Tech Blog
              </h1>
              <p className="text-gray-600 mt-2">Insights, tutorials, and trends in technology</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <LoadingState />
            ) : (
              <>
                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                  <motion.section 
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
                      Featured Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featuredPosts.map((post, index) => (
                        <FeaturedPostCard 
                          key={post.id} 
                          post={post} 
                          onClick={() => setSelectedPost(post)}
                          index={index}
                        />
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* All Posts */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <BookOpen className="w-6 h-6 mr-2 text-purple-600" />
                      All Articles
                    </h2>
                    <span className="text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                      {filteredPosts.length} articles
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    <AnimatePresence>
                      {filteredPosts.map((post, index) => (
                        <PostCard 
                          key={post.id} 
                          post={post} 
                          onClick={() => setSelectedPost(post)}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {filteredPosts.length === 0 && (
                    <motion.div 
                      className="text-center py-12 bg-white rounded-lg shadow-sm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                    </motion.div>
                  )}
                </motion.section>
              </>
            )}
          </div>

          {/* Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-purple-600" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(category => {
                    const Icon = category.icon;
                    return (
                      <motion.button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                          selectedCategory === category.name
                            ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          <Icon className={`w-5 h-5 mr-3 ${selectedCategory === category.name ? 'text-purple-600' : 'text-gray-500'}`} />
                          <span>{category.name}</span>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          selectedCategory === category.name 
                            ? 'bg-purple-200 text-purple-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {category.count}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {recentPosts.map(post => (
                    <motion.div 
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="flex cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(243, 244, 246, 1)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-purple-600" />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <motion.button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      #{tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Loading State Component
const LoadingState = () => (
  <div className="space-y-8">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-48 bg-gray-300 w-full"></div>
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="flex justify-between">
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-48 bg-gray-300 w-full"></div>
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="flex justify-between">
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="h-48 bg-gray-300 w-full"></div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Featured Post Card Component
const FeaturedPostCard = ({ post, onClick, index }) => (
  <motion.div 
    onClick={onClick}
    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 * index }}
    whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
  >
    <div className="relative overflow-hidden">
      <img
        src={post.image || "/placeholder.svg"}
        alt={post.title}
        className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
          Featured
        </span>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
          {post.category}
        </span>
        <span className="mx-2">•</span>
        <span>{post.readTime}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={post.authorImage || "/placeholder.svg"}
            alt={post.author}
            className="w-8 h-8 rounded-full mr-3 border-2 border-white shadow-sm"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{post.author}</p>
            <p className="text-xs text-gray-500">{post.date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {post.views}
          </span>
          <span className="flex items-center">
            <Heart className="w-4 h-4 mr-1" />
            {post.likes}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Regular Post Card Component
const PostCard = ({ post, onClick, index }) => (
  <motion.div 
    onClick={onClick}
    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 * index }}
    whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
  >
    <div className="md:flex">
      <div className="md:w-1/3 overflow-hidden">
        <img
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-48 md:h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="md:w-2/3 p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
            {post.category}
          </span>
          <span className="mx-2">•</span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={post.authorImage || "/placeholder.svg"}
              alt={post.author}
              className="w-8 h-8 rounded-full mr-3 border-2 border-white shadow-sm"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author}</p>
              <p className="text-xs text-gray-500">{post.date}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {post.views}
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {post.likes}
            </span>
            <span className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {post.comments}
            </span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Blog Post Detail Component
const BlogPost = ({ post, onBack }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="flex items-center text-purple-600 hover:text-purple-700 mb-6 group"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-5 h-5 mr-2 transition-transform group-hover:scale-125" />
          Back to Blog
        </motion.button>

        {/* Article Header */}
        <motion.article 
          className="bg-white rounded-lg shadow-sm overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className={`w-full h-64 md:h-96 bg-gray-200 ${!isImageLoaded ? 'animate-pulse' : ''}`}>
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex items-center text-sm text-white mb-4">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                  {post.category}
                </span>
                <span className="mx-3">•</span>
                <Calendar className="w-4 h-4 mr-1" />
                <span>{post.date}</span>
                <span className="mx-3">•</span>
                <Clock className="w-4 h-4 mr-1" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {post.title}
            </motion.h1>

            <motion.div 
              className="flex items-center justify-between mb-8 pb-8 border-b"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center">
                <img
                  src={post.authorImage || "/placeholder.svg"}
                  alt={post.author}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm"
                />
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">Published on {post.date}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    liked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{likeCount}</span>
                </motion.button>
                <motion.button 
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Article Content */}
            <motion.div 
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {post.content}
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div 
              className="mt-8 pt-8 border-t"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-purple-600" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <motion.span 
                    key={tag} 
                    className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Article Stats */}
            <motion.div 
              className="mt-8 pt-8 border-t flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {post.views} views
                </span>
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {likeCount} likes
                </span>
                <span className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.comments} comments
                </span>
              </div>
              <motion.button 
                className="text-purple-600 hover:text-purple-700 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Report an issue
              </motion.button>
            </motion.div>
          </div>
        </motion.article>
      </div>
    </motion.div>
  );
};

export default TechBlog;
