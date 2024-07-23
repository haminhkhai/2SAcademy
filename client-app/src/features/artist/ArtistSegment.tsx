import SplideSlider from '../common/SplideSlider';
import useArtistStore from '../../hooks/artistStore';
import { useEffect } from 'react';
import { Photo } from '../../app/types/photo';

export default function ArtistSegment() {
	const artistStore = useArtistStore();

	useEffect(() => {
		if (artistStore.artists.length <= 1) {
			artistStore.loadArtists();
		}
	}, [artistStore.artists]);

	return (
		<section className='section-artist'>
			<div className='artist-segment'>
				<h1 className='artist-segment__title heading-secondary'>
					Learn From
					<br />
					Industry Experts
					<br />
					And 2S Academy
					<br />
					Artists
				</h1>
				<div className='artist-segment__img-wrapper'>
					<SplideSlider
						className='splide__artist'
						photos={artistStore.artists.map(
							(artist) =>
								new Photo({
									id: artist.thumbPublicId,
									url: artist.thumbUrl,
									alt: artist.name,
								})
						)}
						id={'splide-artist'}
					/>
				</div>
			</div>
		</section>
	);
}
