import ReactDOM from 'react-dom/client';
import 'quill/dist/quill.snow.css';
import './app/layout/styles.css';
import '@splidejs/splide/css';
import 'yet-another-react-lightbox/styles.css';
import "yet-another-react-lightbox/plugins/captions.css";
import 'react-toastify/dist/ReactToastify.min.css';

import { RouterProvider } from 'react-router-dom';
import { router } from './Router/Routes.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>
  // <React.StrictMode>
   
  // </React.StrictMode>
)
