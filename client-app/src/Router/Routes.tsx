import { RouteObject, createBrowserRouter } from 'react-router-dom';
import App from '../app/layout/App';
import HomePage from '../pages/HomePage';
import CoursePage from '../pages/CoursePage';
import GalleryDashboard from '../features/gallery/GalleryDetail';
import ArtistPage from '../pages/ArtistPage';
import BlogList from '../features/blog/BlogList';
import Login from '../admin/account/Login';
import RequireAuth from './RequireAuth';
import ArtistList from '../admin/artist/ArtistList';
import CustomerList from '../admin/customer/CustomerList';
import GalleryList from '../admin/gallery/GalleryList';
import CategoryBlogList from '../admin/blog/CategoryBlogList';
import CourseList from '../admin/course/CourseList';
import BlogDetail from '../features/blog/BlogDetail';
import CourseDetail from '../features/course/CourseDetail';

const routes: RouteObject[] = [
	{
		path: '/',
		element: <App />,
		children: [
			{
				element: <RequireAuth />,
				children: [
					{ path: '/admin/customer', element: <CustomerList /> },
					{ path: '/admin/gallery', element: <GalleryList /> },
					{ path: '/admin/artist', element: <ArtistList /> },
					{ path: '/admin/blog', element: <CategoryBlogList /> },
					{ path: '/admin/course', element: <CourseList /> },
				],
			},
			{ path: '/', element: <HomePage /> },
			{ path: '/login', element: <Login /> },
			{ path: '/course', element: <CoursePage /> },
			{ path: '/course/:courseId', element: <CourseDetail /> },
			{ path: '/gallery', element: <GalleryDashboard /> },
			{ path: '/artist', element: <ArtistPage /> },
			{ path: '/blog', element: <BlogList key='newest' /> },
			{ path: '/blog/:category', element: <BlogList key='category' /> },
			{ path: '/blog/:category/:blogId', element: <BlogDetail /> },
		],
	},
	// {
	//     path: '/admin',
	//     element: <Login/>,
	//     children: [
	//         {path: 'admin/customer', element: <Customer/>}
	//     ]
	// }
];

export const router = createBrowserRouter(routes);
