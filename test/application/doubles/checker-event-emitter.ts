import { EventEmitter } from "@/domain/services/event-emitter";
import { Newable } from "@/lib/ts";

export class CheckerEventEmitter implements EventEmitter {
  public readonly events: object[] = [];

  public async emit<T extends object>(event: T): Promise<void> {
    this.events.push(event);
  }

  private assertAndGet<T extends object>(eventType: Newable<T>): T {
    const events = this.events.filter(
      (event) => event.constructor === eventType,
    ) as T[];

    expect(events).to.have.lengthOf(1);

    return events[0];
  }

  public assert<T extends object>(eventType: Newable<T>): void {
    this.assertAndGet(eventType);
  }

  public get<T extends object>(eventType: Newable<T>): T {
    return this.assertAndGet(eventType);
  }
}
