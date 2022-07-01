import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Tests", () => {
  it("should change the value in set Timeout", fakeAsync(() => {
    let value = false;

    setTimeout(() => {
      value = true;
    }, 1000);
    tick(1000);
    expect(value).toBeTruthy();
  }));

  it("should change the value after a Promise resolve", fakeAsync(() => {
    let value = false;

    Promise.resolve()
      .then(() => true)
      .then((x) => (value = x));

    flushMicrotasks();

    expect(value).toBeTruthy();
  }));

  it("should change the counter value after a Promise resolve and a setTimout time passed", fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 5;

      setTimeout(() => {
        counter += 3;
      }, 1200);
    });

    expect(counter).toBe(0);

    flushMicrotasks();

    expect(counter).toBe(5);

    flush();

    expect(counter).toBe(8);
  }));

  it("should change the value after an Observable emit a delayed value", fakeAsync(() => {
    let value = false;

    const test$ = of(true).pipe(delay(1000));

    test$.subscribe((v) => (value = v));

    tick(1000);

    expect(value).toBeTruthy();
  }));
});
