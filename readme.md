# Instacook, a meal recommendation app

# Developers
## Frontend Developers
- Matthew Lau
- Steven Nguyen
- Raymond Chung

## Backend Developers
- Joe Nguyen
- Yuancong Cheng (Ryan)

# Tech Stack
## Frontend
- React.js
- TypeScript
- Material UI

## Backend
- GraphQL
- Express.js
- Node.js
- MongoDB

# Prerequisites
- Node.js must be already installed.
- If not already installed, please visit https://github.com/nvm-sh/nvm for instructions

# Setup and Configuration
## Environment Setup Instructions (Ubuntu)
1. Download the project via `git clone` or by downloading the files as a .zip.
2. Open the backend folder in your terminal via `cd capstone-project-3900-f18b-poggers/backend`
3. Enter `npm install` to install backend dependencies
4. Run `npm start` to run the backend on port 6921.
5. Repeat steps 2-4 for the frontend folder (`capstone-project-3900-f18b-poggers/frontend`) to run the frontend.
6. After this, the application should have successfully opened in a browser window.

## Database Credential Configuration
- If you are planning to set up the project in your local development environment, you will need to change the database credentials located in `backend/nodemon.json`.
- To generate these credentials, we will need to create a MongoDB database:
1. Create and login to your MongoDB account at https://account.mongodb.com/account/login.
2. Click on the “Build a Database” button after signing in to create a new MongoDB database.
3. Select your desired database configuration and click “Create Cluster”.
4. Create a new user for your new database.
5. Select your desired connection settings.
6. After your new database has been created, click on the “Connect” button.
7. Select the “Connect your application” option.
8. Take note of the username, password and database name and replace the values in `nodemon.json` with these values, replacing `<password>` with your user’s password.

