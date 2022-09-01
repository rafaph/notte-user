import { Config } from "@/config/config";

describe(Config.name, () => {
  it("should not throw if a valid config is created", () => {
    // given/when
    const makeConfig = () => new Config();
    // then
    expect(makeConfig).to.not.throw();
  });

  it("should throw if an invalid config is created", () => {
    // given
    const { DATABASE_URL } = process.env;
    delete process.env.DATABASE_URL;
    // when
    const makeConfig = () => new Config();
    // then
    expect(makeConfig).to.throw();
    process.env.DATABASE_URL = DATABASE_URL;
  });
});
