# Deployment Guide

This guide covers deploying the Task Manager application to production.

## 🚀 Quick Deployment Steps

### 1. Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get your connection string

Example connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
```

### 2. Backend Deployment (Render)

1. **Create Account** on [Render](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select the `backend` directory as root

3. **Configure Build Settings**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=generate_a_secure_random_string_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=your_frontend_url_here
   ```

5. **Deploy** and copy your backend URL (e.g., `https://taskmanager-api.onrender.com`)

### 3. Frontend Deployment (Vercel)

1. **Create Account** on [Vercel](https://vercel.com)

2. **Import Project**
   - Connect your GitHub repository
   - Select the `frontend` directory as root

3. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy** and get your frontend URL

6. **Update Backend**: Go back to Render and update `CLIENT_URL` environment variable with your Vercel URL

### 4. Alternative: Backend on Railway

1. **Create Account** on [Railway](https://railway.app)

2. **New Project** → **Deploy from GitHub**

3. **Configure**:
   - Root directory: `backend`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

4. **Environment Variables**: Same as Render

5. **Generate Domain** in settings

### 5. Alternative: Frontend on Netlify

1. **Create Account** on [Netlify](https://netlify.com)

2. **New Site from Git**

3. **Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Environment Variables**: Same as Vercel

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string (use `openssl rand -hex 32`)
- [ ] Update CORS origins to your actual frontend URL
- [ ] Enable MongoDB authentication
- [ ] Whitelist only necessary IP addresses in MongoDB Atlas
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS (automatic on Vercel/Netlify/Render)
- [ ] Set secure cookie options in production
- [ ] Review and limit API rate limiting
- [ ] Enable logging and monitoring

## 🐳 Docker Deployment (Bonus)

### Using Docker Compose

1. **Create `docker-compose.yml` in root**:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: taskmanager-db
    restart: always
    ports:
      - '27017:27017'
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: taskmanager

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    container_name: taskmanager-backend
    restart: always
    ports:
      - '5000:5000'
    depends_on:
      - mongodb
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGODB_URI: mongodb://mongodb:27017/taskmanager
      JWT_SECRET: ${JWT_SECRET}
      CLIENT_URL: http://localhost:5173

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=http://localhost:5000/api
        - VITE_SOCKET_URL=http://localhost:5000
    container_name: taskmanager-frontend
    restart: always
    ports:
      - '5173:80'
    depends_on:
      - backend

volumes:
  mongodb_data:
```

2. **Create `backend/Dockerfile`**:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["npm", "start"]
```

3. **Create `frontend/Dockerfile`**:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_URL
ARG VITE_SOCKET_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

4. **Create `frontend/nginx.conf`**:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Run**:

```bash
# Create .env file with JWT_SECRET
echo "JWT_SECRET=$(openssl rand -hex 32)" > .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📊 Monitoring & Logging

### Recommended Tools

1. **Application Monitoring**:
   - [Sentry](https://sentry.io) - Error tracking
   - [LogRocket](https://logrocket.com) - Session replay

2. **Performance Monitoring**:
   - [New Relic](https://newrelic.com)
   - [Datadog](https://www.datadoghq.com)

3. **Uptime Monitoring**:
   - [UptimeRobot](https://uptimerobot.com)
   - [Pingdom](https://www.pingdom.com)

### Backend Logging

Add to `backend/src/app.ts`:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Render
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
        run: |
          curl -X POST "https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys" \
            -H "Authorization: Bearer $RENDER_API_KEY"
  
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

## 📝 Post-Deployment Checklist

- [ ] Test all authentication flows
- [ ] Verify real-time updates work
- [ ] Test task CRUD operations
- [ ] Check responsive design on mobile
- [ ] Verify error handling
- [ ] Test with multiple users
- [ ] Monitor application logs
- [ ] Set up alerts for errors
- [ ] Document the deployment URLs
- [ ] Submit to the evaluation form

## 🆘 Troubleshooting

### Common Issues

**CORS Errors**:
- Verify `CLIENT_URL` in backend environment variables
- Check CORS configuration in `backend/src/app.ts`

**Socket.io Not Connecting**:
- Ensure WebSocket support is enabled on host
- Check firewall rules
- Verify `VITE_SOCKET_URL` environment variable

**Database Connection Fails**:
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions

**Build Failures**:
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all environment variables are set

## 📧 Support

For deployment issues:
1. Check logs on your hosting platform
2. Verify all environment variables
3. Test API endpoints with Postman
4. Check MongoDB Atlas metrics

---

**Ready to Deploy?** Follow the steps above and your application will be live! 🚀
