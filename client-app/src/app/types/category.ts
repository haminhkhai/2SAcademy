export interface Category {
    id: string;
    name: string;
}

export interface CategoryWithBlogCount {
    id: string;
    name: string;
    blogCount: number;
}

export class Category implements Category {
    id = "";
    name = "";
    constructor(category?: Category) {
        if (category) {
            Object.assign(this, category);
        }
    }
}

export class CategoryOptions {
    text = "";
    value = "";
    constructor(category?: Category, text?: string, value?: string) {
        if (category) {
            this.text = category.name;
            this.value = category.id;
        }

        if (text && value) {
            this.text = text;
            this.value = value;
        }
    }
}