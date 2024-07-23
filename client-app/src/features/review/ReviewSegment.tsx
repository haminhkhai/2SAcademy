import { useEffect } from "react";
import useReviewStore from "../../hooks/reviewStore";
import SplideSlider from "../common/SplideSlider";

export default function ReviewSegment() {
	const reviewStore = useReviewStore();

	useEffect(()=>{
		if (reviewStore.reviews.length <= 1) {
			reviewStore.loadReviews();
		}
	},[])

	return (
		<section className='section-review'>
			<h2 className='heading-secondary u-margin-bottom-medium'>CHIA SẺ TỪ HỌC VIÊN</h2>
			<div className='review-wrapper'>
				
				<SplideSlider id='splide-review' className='splide__review' reviews={reviewStore.reviews}>
				</SplideSlider>

				{/* <div className='review-card'>
					<img src='img/artist/feliz2.png' alt='teacher' className='review-card__img' />
					<div className='review-card__content'>
						<h3 className='heading-tertiary'>Dj Mie</h3>
						<div className='review-card__rating'>
							<svg className='review-card__rating-star'>
								<use href='img/sprite.svg#icon-star' />
							</svg>
							<svg className='review-card__rating-star'>
								<use href='img/sprite.svg#icon-star' />
							</svg>
							<svg className='review-card__rating-star'>
								<use href='img/sprite.svg#icon-star' />
							</svg>
							<svg className='review-card__rating-star'>
								<use href='img/sprite.svg#icon-star' />
							</svg>
							<svg className='review-card__rating-star'>
								<use href='img/sprite.svg#icon-star' />
							</svg>
						</div>
						<p className='review-card__description'>
							Học DJ với 2s Academy. Các khoá học của chúng tôi đã được phát triển qua nhiều năm kinh
							nghiệm thực tế trong studio, trên sân khấu và trong lớp học. Tại 2s Academy, chúng tôi
							tin rằng bằng hành động, bạn học nhanh hơn, ghi nhớ kiến thức lâu hơn.
						</p>
					</div>
				</div> */}
			</div>
		</section>
	);
}
