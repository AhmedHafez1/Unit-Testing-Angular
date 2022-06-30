import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { setupCourses } from "../common/setup-test-data";
import { CoursesModule } from "../courses.module";
import { CoursesCardListComponent } from "./courses-card-list.component";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let de: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesCardListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the course list", () => {
    component.courses = setupCourses();

    fixture.detectChanges();

    const cards = de.queryAll(By.css(".course-card"));

    expect(cards.length).toBe(12);
  });

  it("should display the first course", () => {
    component.courses = setupCourses();

    fixture.detectChanges();

    const firstCourse = component.courses[0];

    const card = de.query(By.css(".course-card"));
    const title: HTMLElement = card.query(
      By.css("mat-card-title")
    ).nativeElement;
    const img: HTMLImageElement = card.query(By.css("img")).nativeElement;

    expect(title.innerText).toBe(firstCourse.titles.description);
    expect(img.src).toBe(firstCourse.iconUrl);
  });
});
