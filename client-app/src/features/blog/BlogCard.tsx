import { Link } from 'react-router-dom';
import { Blog } from '../../app/types/blog';
import { format } from 'date-fns';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

type Props = {
	blog: Blog;
	isBlogDetail?: boolean;
};

export default function BlogCard({ blog, isBlogDetail }: Props) {
	const convertDeltaToHtml = (delta: any) => {
		// Create an instance of QuillDeltaToHtmlConverter
		const converter = new QuillDeltaToHtmlConverter(JSON.parse(delta).ops, {});

		// Convert to HTML
		const html = converter.convert();

		return html;
	};

	return (
		<div className='blog-card'>
			<div className='blog-card__thumb-wrapper'>
				<Link to={isBlogDetail ? '' : `/blog/${blog.category.name}/${blog.id}`}>
					<img src={blog.thumbUrl} alt={blog.title} className='blog-card__thumb' />
				</Link>
			</div>
			<div className='blog-card__detail'>
				<span className='blog-card__date'>
					<svg className='blog-card__date-icon'>
						<use href='/img/sprite.svg#icon-calendar' />
					</svg>
					{format(blog.createdDate, 'dd MMM yy')}
				</span>

				<h2 className='blog-card__heading'>{blog.title}</h2>

				<p className='blog-card__excerpt'>{blog.description}</p>
				{isBlogDetail && (
					<div
						style={{ padding: '0' }}
						className='ql-editor'
						dangerouslySetInnerHTML={{ __html: `${blog.content}` }}></div>
				)}
			</div>
			<div className='blog-card__meta'>
				{/* <span className='blog-card__author'>
											<svg>
												<use href='img/sprite.svg#icon-user' />
											</svg>
											Feliz
										</span> */}
				<div className='blog-card__read-time'>
					<svg>
						<use href='/img/sprite.svg#icon-clock' />
					</svg>
					5 min read
				</div>
			</div>
		</div>
	);
}
