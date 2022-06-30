import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
  let service: CalculatorService;
  let logger: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService, CalculatorService],
    });

    logger = TestBed.inject(LoggerService);
    service = TestBed.inject(CalculatorService);
  });

  it("should add two numbers", () => {
    const spy = spyOn(logger, "log");

    const result = service.add(2, 5);

    expect(result).toBe(7);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should subtract two numbers", () => {
    const spy = spyOn(logger, "log");

    const result = service.subtract(2, 5);

    expect(result).toBe(-3);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
