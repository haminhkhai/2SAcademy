import { create } from 'zustand';
import { Course } from '../app/types/course';
import agent from '../app/api/agent';
import Utils from '../app/scripts/utils';
import usePhotoStore from './photoStore';

type State = {
	loading: boolean;
	loadingInitial: boolean;
	loadingButton: boolean;
	courses: Course[];
	course: Course;
};

type Actions = {
	loadCourses: () => Promise<void>;
	loadCourse: (id: string) => Promise<void>;
	setCourseId: (id: string) => void;
	setCourse: (course: Course) => void;
	addCourse: (course: Course, photo?: Blob) => Promise<void>;
	editCourse: (course: Course, photo?: Blob) => Promise<void>;
	deleteCourse: (id: string) => Promise<void>;
};

const useCourseStore = create<State & Actions>((set, get) => ({
	courses: [],
	course: new Course(),
	loading: false,
	loadingInitial: false,
	loadingButton: false,
	loadCourses: async () => {
		try {
			set({ loadingInitial: true });
			const courses = await agent.Courses.list();
			if (courses.length > get().courses.length) {
				set({ courses: courses });
			}
		} catch (error) {
			throw error;
		} finally {
			set({ loadingInitial: false });
		}
	},
	loadCourse: async (id) => {
		try {
			set({ loading: true });
			const course = await agent.Courses.detail(id);
			set({ course: course });
		} catch (error) {
			throw error;
		} finally {
			set({ loading: false });
		}
	},
	setCourseId: (id) => {
		set((state) => ({ course: { ...state.course, id: id } }));
	},
	setCourse: (course) => {
		set({ course: course });
	},
	addCourse: async (course, photo) => {
		try {
			set({ loadingButton: true });
			await agent.Courses.add(course);

			if (photo) {
				const photoDto = await agent.Photos.uploadPhoto(photo);
				course.thumbUrl = photoDto.secure_url;
				course.thumbPublicId = photoDto.public_id;
			}

			set(state => ({courses: [...state.courses, course]}));
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
	editCourse: async (course, photo) => {
		try {
			set({ loadingButton: true });

			if (photo) {
				const photoDto = await agent.Photos.uploadPhoto(photo);
				course.thumbUrl = photoDto.secure_url;
				course.thumbPublicId = photoDto.public_id;
			}

			await agent.Courses.edit(course);

			set((state) => ({ courses: [...Utils.updateArrayItem(state.courses, course)] }));
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
			usePhotoStore.getState().setProgress(0);
		}
	},
	deleteCourse: async (id) => {
		try {
			set({ loadingButton: true });
			await agent.Courses.delete(id);

			set((state) => ({ courses: [...state.courses.filter((c) => c.id !== id)] }));
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
}));

export default useCourseStore;
