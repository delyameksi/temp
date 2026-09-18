import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon API',
      version: '1.0.0',
      description: 'Documentation de mon API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
          },
          required: ['id', 'name', 'email'],
        },
        UserUpdate: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            hashedPassword: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  // Both are listed because the annotations live in the TypeScript sources
  // during development, while only the compiled JavaScript ships in the image.
  apis: ['./src/**/*.route.ts', './dist/**/*.route.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
