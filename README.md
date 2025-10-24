# Angular Authentication App

A simple Angular application demonstrating authentication, routing, and state management using Angular 20.3.0.

## Features

- **Login Page**: Form with email and password validation
- **Authentication**: Cookie-based authentication with JWT tokens
- **Dashboard**: Welcome page with user email display and navigation
- **List Page**: Displays items from API with loading and error states
- **State Management**: Uses Angular Component Store for list page state
- **Lazy Loading**: List module is lazy-loaded for better performance
- **Responsive Design**: Built with Angular Material components
- **Unit Tests**: Comprehensive test coverage for services

## Technical Stack

- **Angular**: 20.3.0 (Latest)
- **Angular Material**: UI components and theming
- **RxJS**: Reactive programming for API calls
- **ngx-cookie-service**: Cookie management for authentication
- **@ngrx/component-store**: State management for list page
- **Express.js**: Mock API server for development

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/           # Login component
│   │   └── dashboard/       # Dashboard component
│   ├── modules/
│   │   └── list/           # Lazy-loaded list module
│   │       ├── components/
│   │       │   └── list/   # List component
│   │       └── services/
│   │           └── list.store.ts  # Component Store
│   ├── services/
│   │   ├── auth.service.ts  # Authentication service
│   │   └── items.service.ts # Items API service
│   ├── guards/
│   │   └── auth.guard.ts   # Route protection
│   └── app.routes.ts       # Application routing
├── styles.scss             # Global styles with Material theme
└── main.ts                # Application bootstrap
```

## Setup Instructions

### Prerequisites

- Node.js : v24.4.1
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sivakumar-raju/Login-Task-With-Angular.git
   cd angular-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the mock API server**
   ```bash
   node mock-api-server.js
   ```
   The API server will run on `http://localhost:3001`

4. **Start the Angular development server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## API Endpoints

The application uses a mock API server with the following endpoints:

- **POST /api/login**
  - Request: `{ email: string, password: string }`
  - Response: `{ token: string, user: { email: string } }`

- **GET /api/items**
  - Response: `[{ id: number, name: string, description: string }]`

## Usage

1. **Login**: Enter any email and password (minimum 6 characters) to authenticate
2. **Dashboard**: View welcome message and navigate to the list page
3. **List Page**: View items fetched from the API with loading states
4. **Logout**: Click the logout button to clear authentication and return to login

## Architecture Highlights

### Authentication Flow
- Login form validates email format and password length
- Successful login stores JWT token and user data in cookies
- AuthGuard protects dashboard and list routes
- Logout clears cookies and redirects to login

### State Management
- List page uses Angular Component Store for reactive state management
- Loading, error, and success states are handled gracefully
- RxJS operators provide clean data flow

### Lazy Loading
- List module is lazy-loaded to improve initial bundle size
- Route-based code splitting for better performance

### Responsive Design
- Angular Material provides consistent, accessible UI components
- Mobile-first responsive design
- Modern Material Design principles

## Development Notes

- The mock API server simulates network delays for realistic testing
- All API calls include proper error handling
- Form validation provides immediate user feedback
- Loading spinners enhance user experience during API calls

## Future Enhancements

- Add user registration functionality
- Implement real backend integration
- Add item creation, editing, and deletion
- Include more comprehensive error handling
- Add internationalization support
- Implement offline capabilities with service workers

## License

This project is for demonstration purposes.
