import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskForge API',
      version: '1.0.0',
      description: 'A comprehensive task management API with JWT authentication, role-based access control, filtering, sorting, and pagination. Built with Express.js and MongoDB.',
      contact: {
        name: 'Shiv',
        url: 'https://github.com/sh1v-max/Taskforge',
      },
    },
    // Order matters: Swagger UI's "Try it out" uses the FIRST entry by
    // default. In production we list the live URL first, locally we
    // list localhost first.
    servers:
      process.env.NODE_ENV === 'production'
        ? [
            {
              url: 'https://taskforge-api-e2g9.onrender.com',
              description: 'Production server (Render)',
            },
          ]
        : [
            {
              url: 'http://localhost:5000',
              description: 'Development server',
            },
            {
              url: 'https://taskforge-api-e2g9.onrender.com',
              description: 'Production server (Render)',
            },
          ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePassword123!',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439012',
            },
            title: {
              type: 'string',
              example: 'Buy milk',
            },
            description: {
              type: 'string',
              example: 'Get milk from the grocery store',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in-progress', 'completed'],
              default: 'pending',
            },
            user: {
              type: 'string',
              description: 'ID of the task owner (user)',
              example: '507f1f77bcf86cd799439011',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Optional due date for the task',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
            token: {
              type: 'string',
              description: 'JWT token for authentication',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                role: {
                  type: 'string',
                },
              },
            },
          },
        },
        TasksResponse: {
          type: 'object',
          properties: {
            tasks: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Task',
              },
            },
            page: {
              type: 'integer',
              example: 1,
            },
            limit: {
              type: 'integer',
              example: 10,
            },
            total: {
              type: 'integer',
              example: 23,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
}

export default swaggerJsdoc(options)
