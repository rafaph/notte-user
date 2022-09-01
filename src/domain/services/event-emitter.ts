export abstract class EventEmitter {
  public abstract emit<T extends object>(event: T): Promise<void>;
}
