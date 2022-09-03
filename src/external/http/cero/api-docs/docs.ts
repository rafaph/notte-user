import httpStatus from "http-status";
import { OpenAPIV3 } from "openapi-types";

export const docs: OpenAPIV3.Document = {
  info: {
    title: "notte-user",
    version: "1.0.0",
  },
  openapi: "3.0.3",
  tags: [
    {
      name: "notte-user",
    },
  ],
  components: {
    requestBodies: {
      CreateUser: {
        description: "Create user request",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  example: "user@email.com",
                },
                password: {
                  type: "string",
                  example: "AStrongPasswordHere",
                },
                passwordConfirmation: {
                  type: "string",
                  example: "AStrongPasswordHere",
                  description: "Must match password",
                },
              },
              required: ["email", "password", "passwordConfirmation"],
            },
          },
        },
      },
    },
    responses: {
      CreateUser: {
        description: "Create user response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "1bcd7823-0d1c-4631-9bc2-bad4e49cc9eb",
                },
              },
              required: ["id"],
            },
          },
        },
      },
      Status: {
        description: "Get server status",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  example: "OK",
                },
              },
              required: ["status"],
            },
          },
        },
      },
      BadRequest: {
        description: "Bad request",
        content: {
          "application/json": {
            schema: {
              type: "object",
              additionalProperties: {
                type: "string",
              },
              example: {
                email: "Email is invalid",
                password: "Expected string, received number",
                passwordConfirmation:
                  "Password confirmation does not match password",
              },
            },
          },
        },
      },
      UnprocessableEntity: {
        description: "Unprocessable Entity",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "User already exists",
                },
              },
              required: ["message"],
            },
          },
        },
      },
    },
  },
  paths: {
    "/users": {
      post: {
        tags: ["notte-user"],
        operationId: "createUser",
        requestBody: {
          $ref: "#/components/requestBodies/CreateUser",
        },
        responses: {
          [httpStatus.CREATED]: {
            $ref: "#/components/responses/CreateUser",
          },
          [httpStatus.BAD_REQUEST]: {
            $ref: "#/components/responses/BadRequest",
          },
          [httpStatus.UNPROCESSABLE_ENTITY]: {
            $ref: "#/components/responses/UnprocessableEntity",
          },
        },
      },
    },
    "/status": {
      get: {
        tags: ["notte-user"],
        operationId: "getStatus",
        responses: {
          [httpStatus.OK]: {
            $ref: "#/components/responses/Status",
          },
        },
      },
    },
  },
};
