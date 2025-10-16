# Digital Signage System (CodeKiosk)

A modern digital signage display system built with Next.js 15, React 19, and TypeScript. This application provides a comprehensive solution for managing and displaying dynamic content including text, images, and videos on digital displays.

## Features

- **Dynamic Content Management**: Admin panel to manage main content, news, reminders, and deadlines
- **Multiple Content Types**: Support for text, image, and video content
- **Responsive Design**: Optimized for various display sizes
- **Real-time Updates**: Automatic content refresh every 30 seconds
- **Content Scheduling**: Set duration for content display and ordering
- **Priority System**: Deadlines with priority levels (low, medium, high)
- **Modern UI**: Clean, professional interface with smooth animations

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the display.

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

## Windows Batch Scripts

For Windows users, we've provided convenient batch scripts for easier installation and deployment:

- **[install.bat](file:///e%3A/DigitalSignage/qDS/codekiosk/install.bat)**: Installs all dependencies
- **[quick-deploy.bat](file:///e%3A/DigitalSignage/qDS/codekiosk/quick-deploy.bat)**: Installs dependencies, builds, and starts the application
- **[deploy.bat](file:///e%3A/DigitalSignage/qDS/codekiosk/deploy.bat)**: Full deployment script with menu options

Simply double-click any of these files to run them.

## Docker Deployment

You can also deploy this application using Docker:

1. Build the Docker image:
   ```bash
   docker build -t codekiosk .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 codekiosk
   ```

Or use Docker Compose:
```bash
docker-compose up -d
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

To deploy this application:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

The application can be deployed to any platform that supports Next.js, including:
- Vercel (recommended)
- Netlify
- AWS
- Google Cloud Platform
- Azure

## Environment Variables

The application uses file-based storage by default. For production deployments, consider implementing a database solution.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [React Documentation](https://reactjs.org/) - learn about React concepts
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript

## Project Structure

```
├── src/
│   ├── app/           # Next.js app router pages
│   │   ├── admin/     # Admin panel components and pages
│   │   ├── api/       # API routes for content management
│   │   └── ...        # Main display page
│   └── lib/           # Database and utility functions
├── public/            # Static assets and uploaded files
├── data/              # JSON data storage
└── uploads/           # Uploaded images and videos
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.