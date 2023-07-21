import { Logger } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Option } from "oxide.ts";

import { LoginQuery } from "@/auth/application/queries";
import { LoginResult } from "@/auth/application/queries/results";
import { InvalidCredentialsError, LoginError } from "@/auth/domain/errors";
import { Credentials } from "@/auth/domain/model";
import { GetCredentialsRepository } from "@/auth/domain/repositories";
import { PasswordService, TokenService } from "@/shared/application/services";

@QueryHandler(LoginQuery)
export class LoginQueryHandler
  implements IQueryHandler<LoginQuery, LoginResult>
{
  private readonly logger = new Logger(LoginQueryHandler.name);

  public constructor(
    private readonly getCredentialsRepository: GetCredentialsRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  private handleError(message: string, error: Error): never {
    this.logger.error(message, error);

    throw new LoginError();
  }

  private async getCredentials(email: string): Promise<Option<Credentials>> {
    try {
      return await this.getCredentialsRepository.get(email);
    } catch (error) {
      this.handleError(
        "Fail to get credentials on get credentials repository",
        error as Error,
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
      this.handleError("Fail to verify hash and password", error as Error);
    }
  }

  private async createToken(id: string): Promise<string> {
    try {
      return await this.tokenService.sign(id);
    } catch (error) {
      this.handleError("Fail to sign id to token", error as Error);
    }
  }

  public async execute({ credentialsProps }: LoginQuery): Promise<LoginResult> {
    const { email, password } = credentialsProps;
    const credentialsOption = await this.getCredentials(email);

    if (!credentialsOption.isSome()) {
      throw new InvalidCredentialsError();
    }

    const credentials = credentialsOption.unwrap();
    const isPasswordCorrect = await this.verifyPassword(
      credentials.password,
      password,
    );

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError();
    }

    const token = await this.createToken(credentials.id);

    return { token };
  }
}
