import { create } from 'zustand';
import { PhotoDto } from '../app/types/photo';
import agent from '../app/api/agent';

type State = {
	cropper: Cropper | null;
	files: any;
	progress: number;
};

type Actions = {
	setCropper: (cropper: Cropper | null) => void;
	setFiles: (file: any) => void;
	setProgress: (progress: number) => void;
	uploadPhoto: (file: Blob) => Promise<PhotoDto>;
};

const usePhotoStore = create<State & Actions>((set) => ({
	cropper: null,
	files: [],
	progress: 0,
	setCropper: (cropper) => {
		set({ cropper: cropper });
	},
	setFiles: (file) => {
		set({files: file});
	},
	setProgress: (progress) => {
		set({ progress: progress });
	},
	uploadPhoto: async (file) => {
        let photoDto = new PhotoDto();
		try {
			photoDto = await agent.Photos.uploadPhoto(file);
		} catch (error) {
			console.log(error);
		}
		return photoDto;
	},
}));

export default usePhotoStore;
