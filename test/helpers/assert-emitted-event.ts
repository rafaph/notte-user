import { Newable } from "@/lib/ts";

import { CheckerEventEmitter } from "@test/doubles/checker-event-emitter";

export const assertEmittedEvent = (
  event: Newable<object>,
  publisher: CheckerEventEmitter,
) => {
  publisher.singleOfType(event);
};
