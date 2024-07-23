export interface Customer {
	id: string;
	name: string;
	email: string;
	tel: string;
	description: string;
	regDate: Date | null;
	courseId: string;
	courseName: string;
}

export class Customer implements Customer {
	id = '';
	name = '';
	email = '';
	tel = '';
	description = '';
	courseId = '';
	courseName = '';
	regDate: Date | null = new Date();
	constructor(customer?: Customer) {
		if (customer) {
			Object.assign(this, customer);
		}
	}
}
