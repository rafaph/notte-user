import { injectable, optional } from "inversify";

import { EventEmitter } from "@/domain/services/event-emitter";
import { Action, EventListener } from "@/domain/services/event-listener";
import { Newable } from "@/lib/ts";

@injectable()
export class EventManager implements EventEmitter, EventListener {
  public constructor(
    @optional()
    private readonly listeners: Map<
      Newable<object>,
      Action<object>[]
    > = new Map(),
  ) {}

  public async emit<T extends object>(event: T): Promise<void> {
    const eventType = event.constructor as Newable<T>;
    const actions: Action<T>[] = this.listeners.get(eventType) ?? [];
    const asyncActions = actions.map(async (action) => action(event));

    await Promise.all(asyncActions);
  }

  public on<T extends object>(eventType: Newable<T>, action: Action<T>): void {
    const currentActions: Action<T>[] = this.listeners.get(eventType) ?? [];
    const newActions: Action<T>[] = [...currentActions, action];

    this.listeners.set(eventType, newActions as Action<object>[]);
  }

  public off<T extends object>(eventType: Newable<T>, action: Action<T>): void {
    const actions: Action<T>[] = this.listeners.get(eventType) ?? [];
    const index = actions.indexOf(action);

    if (index > -1) {
      actions.splice(index, 1);
    }

    this.listeners.set(eventType, actions as Action<object>[]);
  }
}
