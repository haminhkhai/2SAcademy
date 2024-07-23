import { create } from 'zustand';
import { Artist } from '../app/types/artist';
import agent from '../app/api/agent';
import Utils from '../app/scripts/utils';

type State = {
	loadingInitial: boolean;
	loadingButton: boolean;
	loading: boolean;
	artists: Artist[];
	artist: Artist;
};

type Actions = {
	loadArtists: () => Promise<void>;
	loadArtist: (id: string) => Promise<void>;
	addArtist: (artist: Artist, photo?: Blob) => Promise<void>;
	editArtist: (artist: Artist, photo?: Blob) => Promise<void>;
	deleteArtist: (id: string, thumbPublicId: string) => Promise<void>;
	resetArtist: () => void;
};

const useArtistStore = create<State & Actions>((set, get) => ({
	loading: false,
	loadingInitial: false,
	loadingButton: false,
	artists: [],
	artist: new Artist(),
	progress: 0,
	cropper: null,
	loadArtists: async () => {
		try {
			set({ loadingInitial: true });
			const artists = await agent.Artists.get();
			//only modify state if there are changes to prevent
			//useEffect from fire unexpectedly and cause infinite loop
			if (artists.length > get().artists.length) {
				set({ artists: artists });
			}
		} catch (error) {
			throw error;
		} finally {
			set({ loadingInitial: false });
		}
	},
	loadArtist: async (id) => {
		if (id) {
			set({ loading: true });
			try {
				const artist = await agent.Artists.detail(id);
				set({ artist: artist });
			} catch (error) {
				console.log(error);
			} finally {
				set({ loading: false });
			}
		} else {
			set({ artist: new Artist() });
		}
	},
	addArtist: async (artist, photo) => {
		try {
			set({ loadingButton: true });

			if (photo) {
				const photoDto = await agent.Photos.uploadPhoto(photo);
				artist.thumbUrl = photoDto.secure_url;
				artist.thumbPublicId = photoDto.public_id;
			}

			await agent.Artists.add(artist);
			set((state) => ({ artists: [...state.artists, artist] }));
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
	editArtist: async (artist, photo) => {
		set({ loadingButton: true });
		try {
			//if user change photo
			if (photo) {
				//delete old photo
				if (get().artist.thumbPublicId) {
					await agent.Photos.deletePhoto(get().artist.thumbPublicId);
				}

				//upload new photo and edit artist
				const photoDto = await agent.Photos.uploadPhoto(photo);
				artist.thumbUrl = photoDto.secure_url;
				artist.thumbPublicId = photoDto.public_id;
			}
			await agent.Artists.edit(artist);
			// const editedArists = get().artists;
			// editedArists[editedArists.indexOf(editedArists.find(a => a.id === artist.id)!)] = artist;
			set({ artists: Utils.updateArrayItem(get().artists, artist) });
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
	deleteArtist: async (id, thumbPublicId) => {
		try {
			set({ loadingButton: true });
			await agent.Artists.delete(id);
			await agent.Photos.deletePhoto(thumbPublicId);

			set(state => ({artists: [...state.artists.filter(a => a.id !== id)]}));
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			
			set({ loadingButton: false });
		}
	},
	resetArtist: () => {
		set({ artist: new Artist() });
	},
}));

export default useArtistStore;
