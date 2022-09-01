export interface UseCase<Input extends object = object> {
  execute(input: Input): Promise<void>;
}
