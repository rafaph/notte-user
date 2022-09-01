import { injectable } from "inversify";

import { EmailAlreadyTakenEvent } from "@/application/events/email-already-taken-event";
import { UserCreatedEvent } from "@/application/events/user-created-event";
import { CreateUserUseCase } from "@/application/use-cases/create-user-use-case";
import { EventListener } from "@/domain/services/event-listener";
import { Controller } from "@/infra/http/interfaces/controller";
import { Request } from "@/infra/http/interfaces/request";
import { Response } from "@/infra/http/interfaces/response";
import { CreateUserRequestSchema } from "@/infra/http/request-schemas/create-user-request-schema";
import { v } from "@/lib/validator";

type Body = v.infer<typeof CreateUserRequestSchema>;

@injectable()
export class CreateUserController extends Controller {
  private response!: Response;

  public constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly eventListener: EventListener,
  ) {
    super();
  }

  private onEmailAlreadyTaken = () => {
    this.response = Response.unprocessableEntity({
      message: "User already exists",
    });
  };

  private onUserCreated = (event: UserCreatedEvent) => {
    this.response = Response.created(event.data);
  };

  public onStart(): void {
    this.eventListener.on(EmailAlreadyTakenEvent, this.onEmailAlreadyTaken);
    this.eventListener.on(UserCreatedEvent, this.onUserCreated);
  }

  public async handle({ body }: Request<Body>): Promise<Response> {
    await this.createUserUseCase.execute({
      email: body.email,
      password: body.password,
    });

    return this.response;
  }

  public onEnd(): void {
    this.eventListener.off(EmailAlreadyTakenEvent, this.onEmailAlreadyTaken);
    this.eventListener.off(UserCreatedEvent, this.onUserCreated);
  }
}
