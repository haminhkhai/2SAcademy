import { CourseProgram } from './courseProgram';

export interface Course {
	id: string;
	name: string;
	price: number | undefined;
	description: string;
	lecture: number | undefined;
	level: string;
	thumbPublicId: string;
	thumbUrl: string;
	teacherId: string;
	teacherName: string;
	scheduleDate: string;
	scheduleTime: string;
	coursePrograms: CourseProgram[];
}

export class Course implements Course {
	id: string = '';
	name: string = '';
	price: number | undefined = undefined;
	description: string = '';
	lecture: number | undefined = undefined;
	level: string = '';
	thumbPublicId: string = '';
	thumbUrl: string = '';
	teacherId = '';
	teacherName = '';
	scheduleDate: string = '';
	scheduleTime: string = '';
	coursePrograms: CourseProgram[] = [];
	constructor(course?: Course) {
		if (course) {
			Object.assign(this, course);
		}
	}
}

export class CourseOptions {
	text = '';
	value = '';
	constructor(course?: Course, text?: string, value?: string) {
		if (course) {
			this.text = course.name;
			this.value = course.id;
		}
		if (text && value) {
			this.text = text;
			this.value = value;
		}
	}
}
