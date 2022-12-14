import { CreateUserController } from "@/infra/http/controllers/create-user-controller";
import { GetUserController } from "@/infra/http/controllers/get-user-controller";
import { StatusController } from "@/infra/http/controllers/status-controller";
import { Route } from "@/infra/http/interfaces/route";
import { CreateUserValidatorMiddleware } from "@/infra/http/middlewares/create-user-validator-middleware";
import { GetUserValidatorMiddleware } from "@/infra/http/middlewares/get-user-validator-middleware";

export const routes: Route[] = [
  {
    method: "GET",
    path: "/status",
    controller: StatusController,
  },
  {
    method: "POST",
    path: "/users",
    middlewares: [CreateUserValidatorMiddleware],
    controller: CreateUserController,
  },

  {
    method: "POST",
    path: "/users/verify",
    middlewares: [GetUserValidatorMiddleware],
    controller: GetUserController,
  },
];
