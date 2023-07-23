import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  UnauthorizedException,
  Version,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";

import { LoginQuery } from "@/application/queries";
import { LoginResult } from "@/application/queries/results";
import { InvalidCredentialsError } from "@/domain/errors";
import { LoginRequest } from "@/infrastructure/http/requests";
import { LoginResponse } from "@/infrastructure/http/responses";

@Controller("user")
export class LoginController {
  private readonly logger = new Logger(LoginController.name);

  public constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Version("1")
  @Post("login")
  public async handle(@Body() request: LoginRequest): Promise<LoginResponse> {
    const query = request.toQuery();

    try {
      const queryResult = await this.queryBus.execute<LoginQuery, LoginResult>(
        query,
      );
      return LoginResponse.fromResult(queryResult);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException();
      }

      this.logger.error("Fail to login an user", error);

      throw new InternalServerErrorException(
        "Fail to login your user, please try again later.",
      );
    }
  }
}
