declare module "mocha.parallel" {
  import SuiteFunction = Mocha.SuiteFunction;

  interface ParallelFunction extends SuiteFunction {
    disable(): void;
    enable(): void;
    limit(n: number): void;
  }

  let parallel: ParallelFunction;

  export default parallel;
}
