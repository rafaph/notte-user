import { Logger } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Option } from "oxide.ts";

import { VerifyTokenQuery } from "@/application/queries";
import { VerifyTokenResult } from "@/application/queries/results";
import { TokenService } from "@/application/services";
import { InvalidTokenError, TokenVerificationError } from "@/domain/errors";

@QueryHandler(VerifyTokenQuery)
export class VerifyTokenQueryHandler
  implements IQueryHandler<VerifyTokenQuery, VerifyTokenResult>
{
  private readonly logger = new Logger(VerifyTokenQueryHandler.name);

  public constructor(private readonly tokenService: TokenService) {}

  private async verifyToken(token: string): Promise<Option<string>> {
    try {
      return await this.tokenService.verify(token);
    } catch (error) {
      this.logger.error("Fail to verify token", error);

      throw new TokenVerificationError();
    }
  }

  public async execute(query: VerifyTokenQuery): Promise<VerifyTokenResult> {
    const { token } = query;

    const payloadOption = await this.verifyToken(token);

    if (payloadOption.isNone()) {
      throw new InvalidTokenError();
    }

    return {
      userId: payloadOption.unwrap(),
    };
  }
}
