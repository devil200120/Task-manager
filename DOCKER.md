# Docker Instructions

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Quick Start with Docker

### 1. Build and Start All Services

```bash
# From the root directory
docker-compose up -d
```

This will:
- Build the frontend and backend containers
- Start MongoDB
- Connect all services
- Expose ports: 80 (frontend), 5000 (backend), 27017 (MongoDB)

### 2. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 3. Stop Services

```bash
docker-compose down
```

### 4. Stop and Remove Volumes

```bash
docker-compose down -v
```

## Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this
```

Or generate one:
```bash
echo "JWT_SECRET=$(openssl rand -hex 32)" > .env
```

## Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health
- **MongoDB**: mongodb://localhost:27017/taskmanager

## Development with Docker

### Rebuild after code changes:

```bash
docker-compose up -d --build
```

### Rebuild specific service:

```bash
docker-compose up -d --build backend
```

## Production Deployment with Docker

### 1. Update docker-compose.yml for production:

```yaml
environment:
  NODE_ENV: production
  MONGODB_URI: your-production-mongodb-uri
  JWT_SECRET: ${JWT_SECRET}
  CLIENT_URL: https://your-domain.com
```

### 2. Build and deploy:

```bash
docker-compose -f docker-compose.yml up -d
```

## Useful Commands

```bash
# View running containers
docker-compose ps

# Execute command in container
docker-compose exec backend npm test

# View container resource usage
docker stats

# Clean up unused images
docker system prune -a

# Access MongoDB shell
docker-compose exec mongodb mongosh taskmanager

# Backup MongoDB
docker-compose exec mongodb mongodump --out /data/backup

# Restore MongoDB
docker-compose exec mongodb mongorestore /data/backup
```

## Troubleshooting

### Port already in use:
```bash
# Change ports in docker-compose.yml
ports:
  - '8080:80'  # Frontend on port 8080
  - '5001:5000'  # Backend on port 5001
```

### Container won't start:
```bash
# Check logs
docker-compose logs service-name

# Restart service
docker-compose restart service-name
```

### Build fails:
```bash
# Clean build
docker-compose down
docker system prune -a
docker-compose up -d --build
```

## Health Checks

All services have health checks configured:
- Frontend: HTTP check on /health
- Backend: HTTP check on /api/health  
- MongoDB: mongosh ping command

View health status:
```bash
docker-compose ps
```
