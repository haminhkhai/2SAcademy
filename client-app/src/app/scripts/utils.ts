import { Gallery } from '../types/gallery';


export default class Utils {
	static updateArrayItem = (array: any[], item: any) => {
		const index = array.findIndex((a) => a.id === item.id);
		if (index !== -1) array[index] = item;
		console.log(array);
		return array;
	};

	static breakpoints = [4320, 2160, 1080, 640, 384, 256, 128];

	static imageSlides = (images: Gallery[]) => {
		return images.map((photo) => {
			const width = photo.width * 4;
			const height = photo.height * 4;
			return {
				id: photo.id,
				publicId: photo.publicId,
				isSelected: false,
				description: photo.caption,
				src: photo.url,
				width,
				height,
				srcSet: this.breakpoints.reverse().map((breakpoint) => {
					const breakpointHeight = Math.round((height / width) * breakpoint);
					const srcSplit = photo.url.split('upload');
					return {
						src: srcSplit[0] + 'upload/' + `w_${breakpoint},h_${breakpointHeight}` + srcSplit[1],
						// src: photo.url + ' ' + breakpoint + 'w',
						width: breakpoint,
						height: breakpointHeight,
					};
				})
			};
		});
	};
}
