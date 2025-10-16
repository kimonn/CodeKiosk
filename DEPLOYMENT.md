# Deployment Guide

This document provides instructions for deploying the Digital Signage System (CodeKiosk) to a production environment.

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- Git (for version control)
- Docker (optional, for containerized deployment)

## Windows Batch Scripts

For Windows users, we've provided convenient batch scripts to simplify the deployment process:

1. **install.bat**: Installs all dependencies
2. **quick-deploy.bat**: Installs dependencies, builds, and starts the application
3. **deploy.bat**: Full deployment script with menu options

These scripts can be found in the root directory and can be executed by double-clicking them.

## Deployment Options

### 1. Vercel (Recommended)

The easiest way to deploy this Next.js application is using Vercel, the creators of Next.js.

1. Push your code to a GitHub repository
2. Sign up for an account at [vercel.com](https://vercel.com)
3. Create a new project and import your repository
4. Vercel will automatically detect the Next.js framework and configure the deployment settings
5. Click "Deploy" and your application will be live

### 2. Manual Deployment

#### Building the Application

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd code-kiosk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

#### Running the Application

After building, you can start the production server:

```bash
npm start
```

By default, the application will run on port 3000. You can access it at `http://localhost:3000`.

#### Environment Variables

The application uses file-based storage by default and doesn't require any environment variables for basic functionality. However, for production deployments, you may want to consider:

- Setting up a proper database instead of file-based storage
- Configuring HTTPS for secure connections
- Setting up reverse proxy (nginx, Apache) for better performance

### 3. Docker Deployment (Recommended for Production)

You can containerize the application using Docker for easier deployment and better isolation:

#### Prerequisites
- Docker installed on your system
- Docker Compose (optional, but recommended)

#### Building and Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t codekiosk .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 codekiosk
   ```

#### Using Docker Compose (Recommended)

1. Use the provided docker-compose.yml file:
   ```bash
   docker-compose up -d
   ```

2. The application will be available at `http://localhost:3000`

#### Development with Docker

For development purposes, you can use the docker-compose.override.yml.example file:

1. Copy the example file:
   ```bash
   cp docker-compose.override.yml.example docker-compose.override.yml
   ```

2. Start the development environment:
   ```bash
   docker-compose up
   ```

This will mount your local source code directories into the container, allowing for live reloading during development.

#### Docker Volumes

The Docker configuration includes volumes for:
- `data/` - Application data storage
- `uploads/` - Uploaded images and videos
- `public/uploads/` - Publicly accessible uploaded files

These volumes ensure that your data persists even when containers are recreated.

## File Structure for Production

After building, the application creates the following important directories:

- `.next/` - Contains the compiled application
- `public/` - Static assets and uploaded files
- `data/` - JSON data storage (content.json)
- `uploads/` - Uploaded images and videos

Ensure these directories are preserved in your production environment.

## Data Management

The application uses a file-based storage system:

- `data/content.json` - Stores all content (main content, news, reminders, deadlines)
- `uploads/images/` - Uploaded image files
- `uploads/videos/` - Uploaded video files

For production deployments, consider:

1. Regular backups of the `data/` directory
2. Proper file permissions for the `uploads/` directory
3. Implementing a database solution for better scalability

## Security Considerations

1. Ensure proper file permissions on the server
2. Use HTTPS in production
3. Regularly update dependencies
4. Implement proper authentication for the admin panel if needed
5. Sanitize user inputs to prevent XSS attacks

## Monitoring and Maintenance

1. Monitor server logs for errors
2. Regularly check disk space usage (especially for uploaded files)
3. Update the application when new versions are released
4. Monitor application performance and adjust resources as needed

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port by setting the PORT environment variable:
   ```bash
   PORT=4000 npm start
   ```

2. **Build failures**: Ensure all dependencies are installed correctly:
   ```bash
   npm install
   npm run build
   ```

3. **File permission errors**: Ensure the application has write permissions to the `data/` and `uploads/` directories.

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review the application logs for error messages
3. Search for similar issues in the project's issue tracker
4. Contact the development team for support