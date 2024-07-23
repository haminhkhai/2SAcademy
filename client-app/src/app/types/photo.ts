export interface Photo {
	id: string;
	url: string;
	alt: string;
}

export class Photo implements Photo {
	id = '';
	url = '';
	message? = '';
	constructor(photo?: Photo) {
		if (photo) Object.assign(this, photo);
	}
}

export interface PhotoDto {
	public_id: string;
	url: string;
	secure_url: string;
}

export class PhotoDto implements PhotoDto {
	public_id: string = '';
	url: string = '';
	secure_url: string = '';
	constructor(photoDto?: PhotoDto) {
		if (photoDto) {
			Object.assign(this, photoDto);
		}
	}
}

export type PhotoSignature = {
	signature: string;
	timestamp: string;
};

export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
