# Production Deployment Guide

## Overview

This guide covers deploying the CaterPro application to a production environment. We'll cover various deployment strategies, from simple cloud hosting to enterprise-grade infrastructure.

## Prerequisites

Before deploying to production, ensure you have:

- Completed development and testing phases
- Set up production database (MongoDB Atlas or self-hosted)
- Configured domain name and SSL certificates
- Prepared environment variables for production
- Set up monitoring and logging systems
- Configured backup and disaster recovery procedures

## Deployment Options

### Option 1: Cloud Platform Deployment (Recommended)

#### Heroku Deployment

Heroku provides an easy deployment solution for MERN applications with minimal configuration.

**Backend Deployment:**

1. **Prepare the Backend**
   ```bash
   cd backend
   
   # Create Procfile
   echo "web: node server.js" > Procfile
   
   # Ensure package.json has correct scripts
   npm run build  # if you have a build step
   ```

2. **Deploy to Heroku**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-connection-string
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set EMAIL_HOST=your-email-host
   heroku config:set EMAIL_USER=your-email-user
   heroku config:set EMAIL_PASS=your-email-password
   
   # Deploy
   git add .
   git commit -m "Deploy to production"
   git push heroku main
   ```

**Frontend Deployment:**

1. **Build the Frontend**
   ```bash
   cd frontend
   
   # Update API base URL for production
   # In src/services/api.js, set baseURL to your Heroku backend URL
   
   # Build for production
   npm run build
   ```



#### AWS Deployment

For more control and scalability, deploy to Amazon Web Services.

**Backend on AWS Elastic Beanstalk:**

1. **Prepare Application**
   ```bash
   cd backend
   
   # Create .ebextensions directory
   mkdir .ebextensions
   
   # Create Node.js configuration
   cat > .ebextensions/nodecommand.config << EOF
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       NodeCommand: "npm start"
   EOF
   
   # Zip the application
   zip -r caterpro-backend.zip . -x "node_modules/*" ".git/*"
   ```

2. **Deploy via AWS Console**
   - Go to AWS Elastic Beanstalk console
   - Create new application
   - Upload the zip file
   - Configure environment variables
   - Deploy the application

**Frontend on AWS S3 + CloudFront:**

1. **Build and Upload**
   ```bash
   cd frontend
   npm run build
   
   # Upload to S3 bucket
   aws s3 sync build/ s3://your-bucket-name --delete
   
   # Invalidate CloudFront cache
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

### Option 2: VPS Deployment

For full control over your infrastructure, deploy to a Virtual Private Server.

#### Server Setup (Ubuntu 20.04)

1. **Initial Server Configuration**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # Install Nginx
   sudo apt install nginx -y
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install Git
   sudo apt install git -y
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone [your-repository-url]
   cd caterpro
   
   # Install backend dependencies
   cd backend
   npm install --production
   
   # Install frontend dependencies and build
   cd ../frontend
   npm install
   npm run build
   
   # Copy build files to Nginx directory
   sudo cp -r build/* /var/www/html/
   ```

3. **Configure PM2**
   ```bash
   cd backend
   
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'caterpro-api',
       script: 'server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 5000
       }
     }]
   };
   EOF
   
   # Start application with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```bash
   # Create Nginx configuration
   sudo cat > /etc/nginx/sites-available/caterpro << EOF
   server {
       listen 80;
       server_name your-domain.com; # Replace with your actual domain
       
       # Frontend
       location / {
           root /var/www/html;
           index index.html index.htm;
           try_files \$uri \$uri/ /index.html;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade \$http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host \$host;
           proxy_set_header X-Real-IP \$remote_addr;
           proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto \$scheme;
           proxy_cache_bypass \$http_upgrade;
       }
   }
   EOF
   
   # Enable site
   sudo ln -s /etc/nginx/sites-available/caterpro /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 3: Docker Deployment

Containerize your application for consistent deployment across environments.

#### Docker Configuration

1. **Backend Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   
   # Install dependencies
   RUN npm ci --only=production
   
   # Copy source code
   COPY . .
   
   # Create non-root user
   RUN addgroup -g 1001 -S nodejs
   RUN adduser -S nodejs -u 1001
   
   # Change ownership
   RUN chown -R nodejs:nodejs /app
   USER nodejs
   
   EXPOSE 5000
   
   CMD ["node", "server.js"]
   ```

2. **Frontend Dockerfile**
   ```dockerfile
   # frontend/Dockerfile
   FROM node:18-alpine as build
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Docker Compose**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   
   services:
     mongodb:
       image: mongo:5.0
       restart: always
       environment:
         MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
         MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
       volumes:
         - mongodb_data:/data/db
       networks:
         - caterpro-network
   
     backend:
       build:
         context: ./backend
         dockerfile: Dockerfile
       restart: always
       environment:
         NODE_ENV: production
         MONGODB_URI: mongodb://mongodb:27017/caterpro
         JWT_SECRET: ${JWT_SECRET}
       depends_on:
         - mongodb
       networks:
         - caterpro-network
   
     frontend:
       build:
         context: ./frontend
         dockerfile: Dockerfile
       restart: always
       ports:
         - "80:80"
         - "443:443"
       depends_on:
         - backend
       networks:
         - caterpro-network
   
     nginx:
       image: nginx:alpine
       restart: always
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./ssl:/etc/nginx/ssl
       depends_on:
         - frontend
         - backend
       networks:
         - caterpro-network
   
   volumes:
     mongodb_data:
   
   networks:
     caterpro-network:
       driver: bridge
   ```

4. **Deploy with Docker**
   ```bash
   # Build and start services
   docker-compose -f docker-compose.prod.yml up -d
   
   # View logs
   docker-compose -f docker-compose.prod.yml logs -f
   
   # Scale backend service
   docker-compose -f docker-compose.prod.yml up -d --scale backend=3
   ```

## SSL/TLS Configuration

### Let's Encrypt (Free SSL)

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Obtain SSL Certificate**
   ```bash
   sudo sudo certbot --nginx -d your-domain.com # Replace with your domain

3. **Auto-renewal Setup**
   ```bash
   sudo crontab -e
   # Add this line:
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Custom SSL Certificate

1. **Upload Certificate Files**
   ```bash
   sudo mkdir -p /etc/nginx/ssl
   sudo cp your-domain.crt /etc/nginx/ssl/
   sudo cp your-domain.key /etc/nginx/ssl/
   sudo chmod 600 /etc/nginx/ssl/*
   ```

2. **Update Nginx Configuration**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name your-domain.com; # Replace with your actual domain
       
       ssl_certificate /etc/nginx/ssl/your-domain.crt;
       ssl_certificate_key /etc/nginx/ssl/your-domain.key;
       
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
       ssl_prefer_server_ciphers off;
       
       # Your existing location blocks...
   }
   
   server {
       listen 80;
       server_name your-domain.com; # Replace with your actual domain
       return 301 https://$server_name$request_uri;
   }
   ```

## Environment Variables

### Production Environment File

Create a comprehensive `.env` file for production:

```env
# Application
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/caterpro_prod
MONGODB_OPTIONS=retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-for-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-for-production
JWT_REFRESH_EXPIRE=30d

# Email Service
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=your-email@example.com # Replace with your sending email address

# File Upload
UPLOAD_PATH=/var/uploads
MAX_FILE_SIZE=10000000
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-for-production
CORS_ORIGIN=http://localhost:3000 # Replace with your actual frontend URL in production

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
RATE_LIMIT_AUTH_MAX=5

# External Services
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Monitoring
LOG_LEVEL=info
LOG_FILE=/var/log/caterpro/app.log
SENTRY_DSN=your-sentry-dsn

# Performance
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600

# Backup
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
S3_BACKUP_BUCKET=caterpro-backups
```

## Database Configuration

### MongoDB Atlas (Recommended)

1. **Create Atlas Cluster**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Configure network access (whitelist your server IPs)
   - Create database user with appropriate permissions

2. **Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/caterpro_prod?retryWrites=true&w=majority
   ```

3. **Security Configuration**
   - Enable authentication
   - Use strong passwords
   - Limit network access
   - Enable audit logging
   - Set up backup schedules

### Self-Hosted MongoDB

1. **Production Configuration**
   ```yaml
   # /etc/mongod.conf
   storage:
     dbPath: /var/lib/mongodb
     journal:
       enabled: true
   
   systemLog:
     destination: file
     logAppend: true
     path: /var/log/mongodb/mongod.log
   
   net:
     port: 27017
     bindIp: 127.0.0.1
   
   security:
     authorization: enabled
   
   replication:
     replSetName: "caterpro-rs"
   ```

2. **Create Admin User**
   ```javascript
   use admin
   db.createUser({
     user: "admin",
     pwd: "secure-password",
     roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
   })
   ```

## Monitoring and Logging

### Application Monitoring

1. **PM2 Monitoring**
   ```bash
   # Install PM2 monitoring
   pm2 install pm2-server-monit
   
   # View monitoring dashboard
   pm2 monit
   
   # Set up log rotation
   pm2 install pm2-logrotate
   ```

2. **System Monitoring with Prometheus**
   ```yaml
   # docker-compose.monitoring.yml
   version: '3.8'
   
   services:
     prometheus:
       image: prom/prometheus
       ports:
         - "9090:9090"
       volumes:
         - ./prometheus.yml:/etc/prometheus/prometheus.yml
   
     grafana:
       image: grafana/grafana
       ports:
         - "3001:3000"
       environment:
         - GF_SECURITY_ADMIN_PASSWORD=admin
   
     node-exporter:
       image: prom/node-exporter
       ports:
         - "9100:9100"
   ```

### Error Tracking

1. **Sentry Integration**
   ```javascript
   // backend/server.js
   const Sentry = require('@sentry/node');
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV
   });
   
   // Error handler middleware
   app.use(Sentry.Handlers.errorHandler());
   ```

2. **Custom Logging**
   ```javascript
   // backend/utils/logger.js
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: process.env.LOG_LEVEL || 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.errors({ stack: true }),
       winston.format.json()
     ),
     transports: [
       new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
       new winston.transports.File({ filename: 'logs/combined.log' }),
       new winston.transports.Console({
         format: winston.format.simple()
       })
     ]
   });
   
   module.exports = logger;
   ```

## Backup and Disaster Recovery

### Database Backup

1. **Automated MongoDB Backup**
   ```bash
   #!/bin/bash
   # backup-script.sh
   
   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_DIR="/var/backups/mongodb"
   DB_NAME="caterpro_prod"
   
   # Create backup directory
   mkdir -p $BACKUP_DIR
   
   # Create backup
   mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE
   
   # Compress backup
   tar -czf $BACKUP_DIR/$DATE.tar.gz -C $BACKUP_DIR $DATE
   rm -rf $BACKUP_DIR/$DATE
   
   # Upload to S3
   aws s3 cp $BACKUP_DIR/$DATE.tar.gz s3://caterpro-backups/mongodb/
   
   # Clean old backups (keep 30 days)
   find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
   ```

2. **Schedule Backup**
   ```bash
   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

### Application Backup

1. **Code Backup**
   ```bash
   #!/bin/bash
   # app-backup.sh
   
   DATE=$(date +%Y%m%d_%H%M%S)
   APP_DIR="/var/www/caterpro"
   BACKUP_DIR="/var/backups/application"
   
   # Create backup
   tar -czf $BACKUP_DIR/caterpro-$DATE.tar.gz -C $APP_DIR .
   
   # Upload to S3
   aws s3 cp $BACKUP_DIR/caterpro-$DATE.tar.gz s3://caterpro-backups/application/
   ```

## Performance Optimization

### Caching Strategy

1. **Redis Setup**
   ```bash
   # Install Redis
   sudo apt install redis-server -y
   
   # Configure Redis
   sudo nano /etc/redis/redis.conf
   # Set maxmemory and eviction policy
   ```

2. **Application Caching**
   ```javascript
   // backend/middleware/cache.js
   const redis = require('redis');
   const client = redis.createClient(process.env.REDIS_URL);
   
   const cache = (duration = 3600) => {
     return async (req, res, next) => {
       const key = req.originalUrl;
       const cached = await client.get(key);
       
       if (cached) {
         return res.json(JSON.parse(cached));
       }
       
       res.sendResponse = res.json;
       res.json = (body) => {
         client.setex(key, duration, JSON.stringify(body));
         res.sendResponse(body);
       };
       
       next();
     };
   };
   ```

### CDN Configuration

1. **CloudFlare Setup**
   - Add your domain to CloudFlare
   - Configure DNS settings
   - Enable caching rules
   - Set up page rules for optimization

2. **AWS CloudFront**
   ```json
   {
     "Origins": [
       {
         "DomainName": "your-domain.com",
         "Id": "caterpro-origin",
         "CustomOriginConfig": {
           "HTTPPort": 80,
           "HTTPSPort": 443,
           "OriginProtocolPolicy": "https-only"
         }
       }
     ],
     "DefaultCacheBehavior": {
       "TargetOriginId": "caterpro-origin",
       "ViewerProtocolPolicy": "redirect-to-https",
       "CachePolicyId": "managed-caching-optimized"
     }
   }
   ```

## Security Hardening

### Server Security

1. **Firewall Configuration**
   ```bash
   # Configure UFW
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **Fail2Ban Setup**
   ```bash
   # Install Fail2Ban
   sudo apt install fail2ban -y
   
   # Configure Fail2Ban
   sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
   sudo nano /etc/fail2ban/jail.local
   ```

### Application Security

1. **Security Headers**
   ```javascript
   // backend/middleware/security.js
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
   ```

2. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: 'Too many requests from this IP'
   });
   
   app.use('/api', limiter);
   ```

## Health Checks and Monitoring

### Application Health Checks

1. **Health Check Endpoint**
   ```javascript
   // backend/routes/health.js
   app.get('/health', async (req, res) => {
     const health = {
       status: 'OK',
       timestamp: new Date().toISOString(),
       uptime: process.uptime(),
       environment: process.env.NODE_ENV,
       version: process.env.npm_package_version
     };
     
     try {
       // Check database connection
       await mongoose.connection.db.admin().ping();
       health.database = 'Connected';
     } catch (error) {
       health.database = 'Disconnected';
       health.status = 'ERROR';
     }
     
     const statusCode = health.status === 'OK' ? 200 : 503;
     res.status(statusCode).json(health);
   });
   ```

2. **Uptime Monitoring**
   ```bash
   # Use external services like:
   # - UptimeRobot
   # - Pingdom
   # - StatusCake
   # - New Relic
   ```

## Deployment Checklist

### Pre-Deployment

- [ ] Code review completed
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Database migrations prepared
- [ ] Environment variables configured
- [ ] SSL certificates ready
- [ ] Backup procedures tested
- [ ] Monitoring tools configured
- [ ] Documentation updated

### Deployment Process

- [ ] Create deployment branch
- [ ] Build application for production
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Update DNS if needed
- [ ] Monitor application logs
- [ ] Notify team of deployment
- [ ] Update status page

### Post-Deployment

- [ ] Verify all functionality
- [ ] Check performance metrics
- [ ] Monitor error rates
- [ ] Validate backup systems
- [ ] Update documentation
- [ ] Schedule post-deployment review

## Troubleshooting

### Common Issues

1. **Application Won't Start**
   ```bash
   # Check logs
   pm2 logs caterpro-api
   
   # Check environment variables
   pm2 env 0
   
   # Restart application
   pm2 restart caterpro-api
   ```

2. **Database Connection Issues**
   ```bash
   # Test MongoDB connection
   mongo "mongodb+srv://cluster.mongodb.net/test" --username username
   
   # Check network connectivity
   telnet cluster.mongodb.net 27017
   ```

3. **High Memory Usage**
   ```bash
   # Check memory usage
   pm2 monit
   
   # Restart application
   pm2 restart caterpro-api
   
   # Check for memory leaks
   node --inspect server.js
   ```

### Emergency Procedures

1. **Rollback Deployment**
   ```bash
   # Git rollback
   git revert HEAD
   git push origin main
   
   # PM2 rollback
   pm2 reload ecosystem.config.js
   ```

2. **Database Recovery**
   ```bash
   # Restore from backup
   mongorestore --db caterpro_prod /path/to/backup
   ```

---

**Deployment Complete! 🚀**

Your CaterPro application is now running in production. Monitor the application closely for the first few hours and be prepared to address any issues that arise.



#### Vercel Deployment (Frontend)

Vercel provides a simple and efficient way to deploy React applications.

1.  **Prepare the Frontend**
    ```bash
    cd frontend
    
    # Update API base URL for production
    # In src/services/api.js, set baseURL to your backend API URL (e.g., your Heroku backend URL)
    
    # Build for production (Vercel automatically builds, but good practice)
    npm run build
    ```

2.  **Deploy to Vercel**
    -   **Install Vercel CLI (if not already installed):**
        ```bash
        npm install -g vercel
        ```
    -   **Login to Vercel:**
        ```bash
        vercel login
        ```
    -   **Deploy from the `frontend` directory:**
        ```bash
        cd frontend
        vercel --prod
        ```
    -   Follow the prompts. Vercel will detect it's a React application and deploy it. Ensure your environment variables (like `REACT_APP_API_URL`) are configured in your Vercel project settings.


