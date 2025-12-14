API Genesis
A web application for scraping websites and generating AI-powered API endpoints.



Description
API Genesis is a tool that allows users to scrape content from websites and automatically generate API endpoints using AI. The backend is built with Node.js and Express, while the frontend provides a simple interface for interaction.



Features
Web scraping functionality
AI-powered API generation
RESTful API endpoints
Static file serving for frontend
Technologies Used
Backend: Node.js, Express.js
Scraping: Cheerio
AI: Google Generative AI
Frontend: HTML, CSS, JavaScript
Installation
Clone the repository:
git clone https://github.com/DipanshuAmrate/College-Project.git
cd College-Project
Install dependencies:
cd server
npm install
Set up environment variables: Create a .env file in the server directory with your Google AI API key:
GOOGLE_AI_API_KEY=your_api_key_here
Start the server:
npm start
Open your browser and navigate to http://localhost:3000
Usage
Open the application in your browser.
Enter a URL to scrape.
The application will extract text content and generate API endpoints.
API Endpoints
POST /api/generate-apis: Generate APIs by scraping a provided URL.
Deployment
This application can be deployed to platforms like Render, Heroku, or Vercel.



Example: Deploying to Render
Sign up for a Render account at https://render.com
Connect your GitHub repository.
Create a new Web Service.
Set the build command to npm install.
Set the start command to npm start.
Deploy!
Contributing
Feel free to submit issues and pull requests.



License
This project is licensed under the MIT License.
