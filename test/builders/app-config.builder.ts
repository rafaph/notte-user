import { AppConfig } from "@/config";
import { appConfigFactory } from "@/factories";

import { InterfaceOf } from "@test/helpers";

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
