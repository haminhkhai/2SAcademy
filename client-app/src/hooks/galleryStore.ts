import { create } from 'zustand';
import { Gallery } from '../app/types/gallery';
import agent from '../app/api/agent';
import Utils from '../app/scripts/utils';

type State = {
	loadingInitial: boolean;
	loadingButton: boolean;
	loading: boolean;
	galleries: Gallery[];
	gallery: Gallery;
};

type Actions = {
	loadGalleries: () => Promise<Gallery[]>;
	loadGallery: (id: string) => Promise<void>;
	addGallery: (gallery: Gallery, photo: Blob) => Promise<void>;
	editGallery: (gallery: Gallery, photo?: Blob) => Promise<void>;
	resetGallery: () => void;
	deleteGalleries: (galleryIds: any[]) => Promise<void>;
};

const useGalleryStore = create<State & Actions>((set, get) => ({
	loadingInitial: false,
	loadingButton: false,
	loading: false,
	galleries: [],
	gallery: new Gallery(),
	loadGalleries: async () => {
		set({ loadingInitial: true });
		try {
			const galleries = await agent.Galleries.get();
			if (galleries.length > get().galleries.length) set({ galleries: galleries });

			return galleries;
		} catch (error) {
			throw error;
		} finally {
			set({ loadingInitial: false });
		}
	},
	loadGallery: async (id) => {
		set({ loading: true });
		try {
			const gallery = await agent.Galleries.detail(id);
			set({ gallery: gallery });
		} catch (error) {
			throw error;
		} finally {
			set({ loading: false });
		}
	},
	addGallery: async (gallery, photo) => {
		try {
			set({ loadingButton: true });
			const photoDto = await agent.Photos.uploadPhoto(photo);
			gallery.publicId = photoDto.public_id;
			gallery.url = photoDto.secure_url;
			await agent.Galleries.add(gallery);
			set((state) => ({ galleries: [...state.galleries, gallery] }));
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
	editGallery: async (gallery, photo) => {
		set({ loadingButton: true });
		try {
			if (photo) {
				//delete old photo at cloudinary
				await agent.Photos.deletePhoto(get().gallery.publicId);

				//upload new photo and modify gallery object to new photo
				const photoDto = await agent.Photos.uploadPhoto(photo);
				gallery.publicId = photoDto.public_id;
				gallery.url = photoDto.secure_url;
			}
			await agent.Galleries.edit(gallery);

			//To ensure that useEffect recognizes changes in an array,
			//you must create a new array reference when you modify its contents:
			//spread operator will create a new array so
			//react will regnize the difference between old and new objects
			set({ galleries: [...Utils.updateArrayItem(get().galleries, gallery)] });
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
	resetGallery: () => {
		set({ gallery: new Gallery() });
	},
	deleteGalleries: async (galleryIds) => {
		try {
			set({ loadingButton: true });

			for (let i = 0; i < galleryIds.length; i++) {
				await agent.Galleries.delete(galleryIds[i].id);
				await agent.Photos.deletePhoto(galleryIds[i].publicId);
				
				
			}
			//filter out objects that id property is in galleryIds
			//galleryIds.map(g => g.id) convert {id: "###", publicId: "asdasd"}[] to ["id"] format
			set({
				galleries: [
					...get().galleries.filter(
						(item) => !galleryIds.map((g) => g.id).includes(item.id)
					),
				],
			});
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
}));

export default useGalleryStore;
