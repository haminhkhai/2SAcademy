import { Review } from '../../app/types/review';

type Props = {
	review: Review;
};

export default function ReviewCard({ review }: Props) {
	return (
		<div className='review-card'>
			<img src={review.artist.thumbUrl} alt='teacher' className='review-card__img' />
			<div className='review-card__content'>
				<h3 className='heading-tertiary'>{review.artist.name}</h3>
				<div className='review-card__rating'>
					{Array.from({ length: review.rating }, (_,index) => (
						<svg key={"rating"+index} className='review-card__rating-star'>
							<use href='img/sprite.svg#icon-star' />
						</svg>
					))}
				</div>
				<p className='review-card__description'>
					{review.content}
				</p>
			</div>
		</div>
	);
}
