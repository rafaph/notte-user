import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";

import { VerifyTokenQuery } from "@/application/queries";
import { VerifyTokenResult } from "@/application/queries/results";
import { InvalidTokenError } from "@/domain/errors";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  public constructor(private readonly queryBus: QueryBus) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: {
        authorization?: string;
      };
      userId: string;
    }>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false;
    }

    const token = authHeader.substring(7);
    const query = new VerifyTokenQuery(token);

    try {
      const { userId } = await this.queryBus.execute<
        VerifyTokenQuery,
        VerifyTokenResult
      >(query);

      request.userId = userId;

      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        return false;
      }

      this.logger.error("Fail to verify token", error);

      throw new InternalServerErrorException(
        "Fail to verify token, please try again later.",
      );
    }
  }
}
