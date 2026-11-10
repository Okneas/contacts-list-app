import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const routesDir = path.resolve(__dirname, 'routes').replace(/\\/g, '/');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'Реестр контактов',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Local dev' }],
    tags: [{ name: 'Contacts', description: 'Работа с контактами' }],

    components: {
      schemas: {
        ContactStatus: {
          type: 'string',
          enum: ['active', 'inactive', 'lead'],
        },

        Contact: {
          type: 'object',
          required: ['id', 'fullName', 'company', 'email', 'status', 'createdAt', 'updatedAt'],
          properties: {
            id:        { type: 'integer', example: 1 },
            fullName:  { type: 'string', example: 'Иван Петров' },
            company:   { type: 'string', example: 'ACME' },
            email:     { type: 'string', nullable: true, format: 'email', example: 'ivan@acme.io' },
            status:    { $ref: '#/components/schemas/ContactStatus' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        ContactInput: {
          type: 'object',
          required: ['fullName', 'company', 'status'],
          properties: {
            fullName: { type: 'string', minLength: 1, maxLength: 255 },
            company:  { type: 'string', minLength: 1, maxLength: 255 },
            email:    { type: 'string', nullable: true, format: 'email', maxLength: 255 },
            status:   { $ref: '#/components/schemas/ContactStatus' },
          },
        },

        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code:    { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string' },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      path:    { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },

      PageMeta: {
        type: 'object',
        required: ['page', 'pageSize', 'total', 'totalPages'],
        properties: {
          page:       { type: 'integer', example: 1 },
          pageSize:   { type: 'integer', example: 20 },
          total:      { type: 'integer', example: 137 },
          totalPages: { type: 'integer', example: 7 },
        },
      },

      responses: {
        ValidationError: {
          description: 'Ошибка валидации',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Ошибка валидации',
                  details: [{ path: 'fullName', message: 'ФИО не может быть пустым' }],
                },
              },
            },
          },
        },

        NotFound: {
          description: 'Контакт не найден',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: { code: 'NOT_FOUND', message: 'Контакт не найден' },
              },
            },
          },
        },
      },
    },
  },

  apis: [`${routesDir}/*.ts`, `${routesDir}/*.js`],
};

export const swaggerSpec = swaggerJsdoc(options);