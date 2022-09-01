import sinon from "sinon";

import { EventManager } from "@/infra/services/event-manager";

class EventMock {}

describe(EventManager.name, () => {
  it("should call the on action twice when an event is emitted two times", async () => {
    // given
    const manager = new EventManager();
    const action = sinon.stub();
    manager.on(EventMock, action);
    // when
    await manager.emit(new EventMock());
    await manager.emit(new EventMock());
    // then
    expect(action).to.have.callCount(2);
  });

  it("should not call an action when the action is off", async () => {
    // given
    const manager = new EventManager();
    const action = sinon.stub();
    manager.on(EventMock, action);
    // when
    manager.off(EventMock, action);
    await manager.emit(new EventMock());
    // then
    expect(action).to.not.be.called;
  });

  it("should not throw if no action is found on emit", async () => {
    // given
    const manager = new EventManager();
    // when
    const emit = manager.emit(new EventMock());
    // then
    await expect(emit).to.not.eventually.be.rejected;
  });

  it("should not throw if no action is found on off", () => {
    // given
    const manager = new EventManager();
    // when
    const off = () => manager.off(EventMock, sinon.stub());
    // then
    expect(off).to.not.throw();
  });
});
