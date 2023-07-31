/* istanbul ignore file */

export class InvalidConfigurationError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "InvalidConfigurarError";
  }
}
