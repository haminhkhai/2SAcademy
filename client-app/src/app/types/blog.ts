import { Category } from './category';

export interface Blog {
	id: string;
	title: string;
	description: string;
	createdDate: Date;
	category: Category;
	content: string;
	thumbPublicId: string;
	thumbUrl: string;
}

export class Blog implements Blog {
	id = '';
	title = '';
	description = '';
	createdDate = new Date();
	category = new Category();
	content = '';
	thumbPublicId = '';
	thumbUrl = '';

	constructor(blog?: Blog) {
		if (blog) {
			Object.assign(this, blog);
		}
	}
}
