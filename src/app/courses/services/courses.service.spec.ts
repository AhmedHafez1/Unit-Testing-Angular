import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
  HttpStatusCode,
} from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { CoursesService } from "./courses.service";

describe("CoursesService", () => {
  let service: CoursesService;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoursesService],
      imports: [HttpClientModule, HttpClientTestingModule],
    });

    service = TestBed.inject(CoursesService);
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should get all courses from server", () => {
    const spy = spyOn(http, "get").and.returnValue(
      of({ payload: Object.values(COURSES) })
    );

    service.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned");
      expect(courses.length).toBe(12);
    });

    expect(spy).toHaveBeenCalledWith("/api/courses");
  });

  it("should get a course by id", () => {
    let id = 12;
    const course = COURSES[id];
    const spy = spyOn(http, "get").and.returnValue(of(course));

    service.findCourseById(id).subscribe((course) => {
      expect(course).toBeTruthy("No course returned");
      expect(course.category).toBe("BEGINNER");
    });

    expect(spy).toHaveBeenCalledWith("/api/courses/" + id);
  });

  it("should save a course to server", () => {
    let id = 2;
    const course = COURSES[id];
    const changes: Partial<Course> = {
      titles: {
        description: "Angular Core",
      },
      lessonsCount: 5,
      category: "INTERMEDIATE",
      seqNo: 101,
    };

    const spy = spyOn(http, "put").and.returnValue(
      of({ ...course, ...changes })
    );

    service.saveCourse(id, changes).subscribe((course) => {
      expect(course).toBeTruthy("No course returned");
      expect(course).toEqual({ ...course, ...changes });
      expect(course.seqNo).toBe(101);
    });

    expect(spy).toHaveBeenCalledWith("/api/courses/" + id, changes);
  });

  it("should give an error if the save failed", () => {
    let id = 2;
    const changes: Partial<Course> = {
      titles: {
        description: "Angular Core",
      },
      lessonsCount: 5,
      category: "INTERMEDIATE",
      seqNo: 101,
    };

    const spy = spyOn(http, "put").and.returnValue(
      throwError(
        new HttpErrorResponse({
          status: HttpStatusCode.InternalServerError,
          statusText: "Internal Server Error",
        })
      )
    );
    service.saveCourse(id, changes).subscribe({
      next: () => fail("The save should be failed"),
      error: (error: HttpErrorResponse) => {
        console.log(error);
        expect(error.status).toBe(500);
      },
    });

    expect(spy).toHaveBeenCalledWith("/api/courses/" + id, changes);
  });

  it("should find a list of lessons for a specific course", () => {
    let id = 5;

    service.findLessons(id).subscribe((lessons) => {
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(
      (req) => req.url === "/api/lessons"
    );

    expect(req.request.params.get("courseId")).toBe(`${id}`);
    expect(req.request.params.get("filter")).toBe("");
    expect(req.request.params.get("sortOrder")).toBe("asc");
    expect(req.request.params.get("pageNumber")).toBe("0");
    expect(req.request.params.get("pageSize")).toBe("3");

    req.flush({ payload: findLessonsForCourse(id).slice(0, 3) });
  });
});
