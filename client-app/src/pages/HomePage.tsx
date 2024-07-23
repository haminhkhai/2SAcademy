import About from '../features/about/About';
import ArtistSegment from '../features/artist/ArtistSegment';
import BlogSegment from '../features/blog/BlogSegment';
import CourseSegment from '../features/course/CourseSegment';
import GallerySegment from '../features/gallery/GallerySegment';

export default function HomePage() {
	return (
		<>
			<About />
			<CourseSegment />
			<ArtistSegment />
			<GallerySegment />
			<BlogSegment />
		</>
	);
}
