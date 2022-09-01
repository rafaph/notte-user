import { Newable } from "@/lib/ts";

export type Action<T extends object> = (event: T) => Promise<void> | void;

export abstract class EventListener {
  public abstract on<T extends object>(
    eventType: Newable<T>,
    action: Action<T>,
  ): void;

  public abstract off<T extends object>(
    eventType: Newable<T>,
    action: Action<T>,
  ): void;
}
