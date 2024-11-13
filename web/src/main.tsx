import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { FrameGrid } from './components/FrameGrid.tsx';
import { FrameGallery } from './components/FrameGallery.tsx';
import { Provider } from 'react-redux';
import { store } from './utils/redux/store.ts';
import Check from './pages/Check.tsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<App />}>
        <Route path="/" element={<FrameGrid />} />
        <Route path="/neighbor/:id/:limit" element={<FrameGallery />} />
      </Route>
      <Route path="/check" element={<Check />} />
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
