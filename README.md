# Task Management Application

## Overview

This Task Management Application is a full-stack project that combines a React frontend with a Flask backend API. The application allows users to manage tasks and lists efficiently. Users can create, edit, and delete tasks and lists, as well as handle user authentication through a signup and login system.

## Features

- **User Authentication:** Users can sign up, log in, and log out securely.
- **List Management:** Create, edit, and delete lists to organize tasks.
- **Task Management:** Create, edit, and delete tasks associated with specific lists.
- **Drag-and-Drop Functionality:** Move tasks between different lists and transfer tasks from one sub-task to another using a user-friendly drag-and-drop interface.
- **Infinite Sub-Task Creation:** Users can create sub-tasks with no limit to their depth, allowing for flexible task organization.
- **Responsive Design:** The application is designed to be user-friendly across desktop and tablet devices.

#### Loom video Link: [Link](https://www.loom.com/share/bf115eb4c4d24db39a2e54ca7656ec68?sid=5ba0781b-4614-4049-a2fa-ff1458f99805)

## Technologies Used

### Frontend:

- React
- Styled-components
- React Router for navigation
- Axios for API requests

### Backend:

- Flask
- SQLAlchemy for database management
- JWT for secure authentication

## Getting Started

To get started with this Task Management Application, follow the instructions below to set up both the frontend and backend components on your local machine.

### Prerequisites

Make sure you have the following installed:

- Node.js (version 14 or higher)
- Python (version 3.6 or higher)
- pip (Python package installer)

## Setting Up the Project

### Clone the Repository:

```bash
git clone git@github.com:jonathan-4a/todo-list-app.git
cd todo-list-app
```

This repository contains two main directories: api and frontend.

### Setting Up the Backend

#### Navigate to the API Directory:

```bash
cd api
```

#### Create a Virtual Environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

#### Install the Required Python Packages:

```bash
pip install -r requirements.txt
```

#### Run the Flask Application:

```bash
flask --app app run --debug
```

The backend should now be running on [http://127.0.0.1:5000](http://127.0.0.1:5000).

**Note:** If you plan to deploy this application in a real-world scenario, consider disabling CORS on the backend to enhance security. This helps prevent unauthorized cross-origin requests.

### Setting Up the Frontend

#### Navigate to the Frontend Directory:

```bash
cd ../frontend
```

#### Install the Required Node Packages:

```bash
npm install
```

#### Start the Development Server:

```bash
npm start
```

The frontend should now be running on [http://localhost:3000](http://localhost:3000).

## Testing the Application

Once both servers are running, you can access the application in your web browser at [http://localhost:3000](http://localhost:3000).

## Project Structure

### Backend (Flask API)

- `__init__.py`: Initializes the Flask application and registers blueprints for authentication and task management.
- `models.py`: Defines data models for Task, List, and User, outlining the database structure.
- `auth.py`: Manages user authentication tasks, including signup, login, and token generation.
- `tasks.py`: Handles task-related operations, such as creating, editing, deleting, and retrieving tasks, including moving tasks between lists.

### Frontend (React Application)

- `public/`: Contains static assets, including the index.html file, which serves as the entry point for the React application.
- `src/`: Main source directory containing the application's code.
  - `components/`: Reusable UI components that make up the application's interface, such as forms, buttons, and sidebars.
  - `contexts/`: Contains context providers for managing global state, including user authentication and task management.
  - `hooks/`: Custom React hooks that encapsulate logic for fetching data and managing state, like `useAuth` for authentication and `useList` for task management.
  - `pages/`: Represents different views or pages of the application, including the dashboard, login, and signup pages.
- `App.js`: The root component that sets up routing and integrates the main layout and navigation.
- `index.js`: The entry point for the React application that renders the App component and initializes the application.
- `tests/`: Contains unit tests for various components and hooks to ensure the application behaves as expected.
