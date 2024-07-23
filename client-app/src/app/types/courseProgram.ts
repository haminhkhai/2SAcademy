import { ProgramDetail } from "./programDetail";

export interface CourseProgram {
	id?: string;
	name: string;
	courseId: string;
    programDetails: ProgramDetail[]
}

export class CourseProgram implements CourseProgram {
	constructor(courseProgram?: CourseProgram) {
        if (courseProgram) {
            Object.assign(this, courseProgram);
        }
    }
}
