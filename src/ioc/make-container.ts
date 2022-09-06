import { Container } from "inversify";
import { Pool } from "pg";

import { CreateUserUseCase } from "@/application/use-cases/create-user-use-case";
import { GetUserUseCase } from "@/application/use-cases/get-user-use-case";
import { Config } from "@/config/config";
import { CreateUserRepository } from "@/domain/repositories/create-user-repository";
import { GetUserByEmailRepository } from "@/domain/repositories/get-user-by-email-repository";
import { EventEmitter } from "@/domain/services/event-emitter";
import { EventListener } from "@/domain/services/event-listener";
import { PasswordHasherService } from "@/domain/services/password-hasher-service";
import { PasswordVerifierService } from "@/domain/services/password-verifier-service";
import { CeroServer } from "@/external/http/cero/cero-server";
import { CreateUserController } from "@/infra/http/controllers/create-user-controller";
import { GetUserController } from "@/infra/http/controllers/get-user-controller";
import { StatusController } from "@/infra/http/controllers/status-controller";
import { Server } from "@/infra/http/interfaces/server";
import { CreateUserValidatorMiddleware } from "@/infra/http/middlewares/create-user-validator-middleware";
import { GetUserValidatorMiddleware } from "@/infra/http/middlewares/get-user-validator-middleware";
import { PgCreateUserRepository } from "@/infra/repositories/pg/pg-create-user-repository";
import { PgGetUserByEmailRepository } from "@/infra/repositories/pg/pg-get-user-by-email-repository";
import { Argon2PasswordService } from "@/infra/services/argon2-password-service";
import { EventManager } from "@/infra/services/event-manager";

export const makeContainer = (): Container => {
  const container = new Container();
  // config
  container.bind<Config>(Config).toSelf().inSingletonScope();
  const config = container.get<Config>(Config);
  // database connection
  container.bind<Pool>(Pool).toConstantValue(
    new Pool({
      connectionString: config.db.url,
      min: config.db.pool.min,
      max: config.db.pool.max,
    }),
  );
  // repositories
  container
    .bind<GetUserByEmailRepository>(GetUserByEmailRepository)
    .to(PgGetUserByEmailRepository)
    .inSingletonScope();
  container
    .bind<CreateUserRepository>(CreateUserRepository)
    .to(PgCreateUserRepository)
    .inSingletonScope();
  // services
  container
    .bind<Argon2PasswordService>(Argon2PasswordService)
    .to(Argon2PasswordService)
    .inSingletonScope();
  container
    .bind<PasswordHasherService>(PasswordHasherService)
    .toConstantValue(container.get(Argon2PasswordService));
  container
    .bind<PasswordVerifierService>(PasswordVerifierService)
    .toConstantValue(container.get(Argon2PasswordService));
  container
    .bind<EventManager>(EventManager)
    .to(EventManager)
    .inSingletonScope();
  container
    .bind<EventEmitter>(EventEmitter)
    .toConstantValue(container.get(EventManager));
  container
    .bind<EventListener>(EventListener)
    .toConstantValue(container.get(EventManager));
  // use cases
  container
    .bind<CreateUserUseCase>(CreateUserUseCase)
    .toSelf()
    .inSingletonScope();
  container.bind<GetUserUseCase>(GetUserUseCase).toSelf().inSingletonScope();
  // middlewares
  container
    .bind<CreateUserValidatorMiddleware>(CreateUserValidatorMiddleware)
    .toSelf()
    .inSingletonScope();
  container
    .bind<GetUserValidatorMiddleware>(GetUserValidatorMiddleware)
    .toSelf()
    .inSingletonScope();
  // controllers
  container
    .bind<StatusController>(StatusController)
    .toSelf()
    .inSingletonScope();
  container
    .bind<CreateUserController>(CreateUserController)
    .toSelf()
    .inSingletonScope();
  container
    .bind<GetUserController>(GetUserController)
    .toSelf()
    .inSingletonScope();
  // external
  container.bind<Server>(Server).to(CeroServer).inSingletonScope();
  // container
  container.bind<Container>(Container).toConstantValue(container);
  return container;
};
