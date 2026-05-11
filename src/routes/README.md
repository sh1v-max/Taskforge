# Routes

This directory defines the API endpoints and maps them to their respective controllers.

## Files

### `auth.router.js`
Defines the authentication-related routes.
- **POST `/register`**: Validates input using `registerSchema` and calls the `register` controller.
- **POST `/login`**: Validates input using `loginSchema` and calls the `login` controller.
