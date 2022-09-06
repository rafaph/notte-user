import { injectable } from "inversify";

import { UserFoundEvent } from "@/application/events/user-found-event";
import { UserNotFoundEvent } from "@/application/events/user-not-found-event";
import { GetUserUseCase } from "@/application/use-cases/get-user-use-case";
import { EventListener } from "@/domain/services/event-listener";
import { Controller } from "@/infra/http/interfaces/controller";
import { Request } from "@/infra/http/interfaces/request";
import { Response } from "@/infra/http/interfaces/response";
import { GetUserRequestSchema } from "@/infra/http/request-schemas/get-user-request-schema";
import { v } from "@/lib/validator";

type Body = v.infer<typeof GetUserRequestSchema>;

@injectable()
export class GetUserController extends Controller {
  private response!: Response;

  public constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly eventListener: EventListener,
  ) {
    super();
  }

  private onUserNotFound = () => {
    this.response = Response.notFound();
  };

  private onUserFound = (event: UserFoundEvent) => {
    this.response = Response.ok(event.data);
  };

  public onStart(): void {
    this.eventListener.on(UserNotFoundEvent, this.onUserNotFound);
    this.eventListener.on(UserFoundEvent, this.onUserFound);
  }

  public async handle({ body }: Request<Body>): Promise<Response> {
    await this.getUserUseCase.execute(body);

    return this.response;
  }

  public onEnd(): void {
    this.eventListener.off(UserNotFoundEvent, this.onUserNotFound);
    this.eventListener.off(UserFoundEvent, this.onUserFound);
  }
}
