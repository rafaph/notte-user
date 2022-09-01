import { EventEmitter } from "@/domain/services/event-emitter";
import { Newable } from "@/lib/ts";

export class CheckerEventEmitter implements EventEmitter {
  public readonly events: object[] = [];

  public async emit<T extends object>(event: T): Promise<void> {
    this.events.push(event);
  }

  public ofType<T extends object>(eventType: Newable<T>): T[] {
    return this.events.filter((e) => e.constructor === eventType) as T[];
  }

  public singleOfType<T extends object>(type: Newable<T>): T {
    const items = this.ofType<T>(type);

    expect(items).to.have.lengthOf(1);

    return items[0];
  }
}
