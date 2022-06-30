import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import { CoursesService } from "../services/courses.service";
import { HttpClientModule } from "@angular/common/http";
import { setupCourses } from "../common/setup-test-data";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let de: DebugElement;
  let service: CoursesService;

  const beginnerCourses = setupCourses().filter(
    (c) => c.category === "BEGINNER"
  );

  const advancedCourses = setupCourses().filter(
    (c) => c.category === "ADVANCED"
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [CoursesService],
      imports: [HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CoursesService);
    de = fixture.debugElement;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    spyOn(service, "findAllCourses").and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = de.queryAll(By.css("mat-tab"));

    expect(tabs.length).toBe(1);
  });

  it("should display only advanced courses", () => {
    spyOn(service, "findAllCourses").and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = de.queryAll(By.css("mat-tab"));

    expect(tabs.length).toBe(1);
  });

  it("should display both tabs", () => {
    spyOn(service, "findAllCourses").and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = de.queryAll(By.css("mat-tab"));

    expect(tabs.length).toBe(2);
  });

  it("should display advanced courses when tab clicked", () => {
    pending();
  });
});
