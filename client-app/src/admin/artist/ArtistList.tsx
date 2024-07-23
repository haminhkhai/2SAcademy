import useArtistStore from '../../hooks/artistStore';
import { useEffect, useState } from 'react';
import LoadingFull from '../../features/common/LoadingFull';
import SimpleButton from '../../features/common/SimpleButton';
import { useModalStore } from '../../hooks/useModalStore';
import ArtistForm from './ArtistForm';
import { toast } from 'react-toastify';

export default function ArtistList() {
	const artistStore = useArtistStore();
	const modalStore = useModalStore();
	const [loadingTarget, setLoadingTarget] = useState('');

	const handleDelete = (id: string, thumbPublicId: string) => {
		setLoadingTarget(id);
		artistStore.deleteArtist(id, thumbPublicId).then(() => {
			toast.info('deleted');
		});
	};

	useEffect(() => {
		if (artistStore.artists.length <= 1) {
			artistStore.loadArtists();
		}
	}, []);

	if (artistStore.loadingInitial) return <LoadingFull />;
	return (
		<>
			<div className='admin__segment'>
				<div className='admin__segment-header'>
					<h3 className='admin__heading'>Artists</h3>
					<SimpleButton
						color='blue'
						text='ADD ARTIST'
						onClick={() => modalStore.openModal(<ArtistForm />, 'large')}
					/>
				</div>

				<div className='three-cols-row'>
					{artistStore.artists.map((artist) => (
						<div key={artist.id} className='card card--admin'>
							<div className='card__picture-wrapper'>
								<img src={artist.thumbUrl} />
							</div>
							<div className='card__detail'>
								<h2 className='card__heading heading-tertiary'>
									{artist.name}
								</h2>
								<p className='card__description'>{artist.description}</p>
							</div>
							<div className='card__footer'>
								<SimpleButton
									onClick={() =>
										modalStore.openModal(
											<ArtistForm artistId={artist.id} />,
											'large'
										)
									}
									text='Edit'
									color='blue'
								/>
								<SimpleButton
									// disabled={true}
									name={artist.id}
									onClick={() => handleDelete(artist.id, artist.thumbPublicId)}
									loading={
										artistStore.loadingButton && loadingTarget === artist.id
									}
									text='Delete'
									color='red'
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
