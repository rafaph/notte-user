import { Logger } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Option } from "oxide.ts";

import { LoginQuery } from "@/application/queries";
import { LoginResult } from "@/application/queries/results";
import { PasswordService, TokenService } from "@/application/services";
import { InvalidCredentialsError, LoginError } from "@/domain/errors";
import { User } from "@/domain/models";
import { FindUserByEmailRepository } from "@/domain/repositories";

@QueryHandler(LoginQuery)
export class LoginQueryHandler
  implements IQueryHandler<LoginQuery, LoginResult>
{
  private readonly logger = new Logger(LoginQueryHandler.name);

  public constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  private handleError(message: string, error: unknown): never {
    this.logger.error(message, error);

    throw new LoginError();
  }

  private async getUser(email: string): Promise<Option<User>> {
    try {
      return await this.findUserByEmailRepository.findByEmail(email);
    } catch (error) {
      this.handleError(
        "Fail to get credentials on get credentials repository",
        error,
      );
    }
  }

  private async verifyPassword(
    hash: string,
    password: string,
  ): Promise<boolean> {
    try {
      return await this.passwordService.verify(hash, password);
    } catch (error) {
      this.handleError("Fail to verify hash and password", error);
    }
  }

  private async createToken(id: string): Promise<string> {
    try {
      return await this.tokenService.sign(id);
    } catch (error) {
      this.handleError("Fail to sign id to token", error);
    }
  }

  public async execute({ email, password }: LoginQuery): Promise<LoginResult> {
    const userOption = await this.getUser(email);

    if (userOption.isNone()) {
      throw new InvalidCredentialsError();
    }

    const user = userOption.unwrap();
    const isPasswordCorrect = await this.verifyPassword(
      user.password,
      password,
    );

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError();
    }

    const token = await this.createToken(user.id);

    return { token };
  }
}
