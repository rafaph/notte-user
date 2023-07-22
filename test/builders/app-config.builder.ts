import { AppConfig } from "@/config";
import { appConfigFactory } from "@/factories";

type InterfaceOf<T> = {
  -readonly [P in keyof T]: T[P];
};

export class AppConfigBuilder {
  private readonly props: InterfaceOf<AppConfig>;

  public constructor() {
    this.props = appConfigFactory();
  }

  public build(): AppConfig {
    const config = new AppConfig();
    Object.assign(config, this.props);

    return config;
  }
}
