import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { LoginForm } from './pages/Login';
import Places from './pages/Places';
import { Destination } from './pages/Destination';
import { store } from './store';
import { Provider } from 'react-redux';
import { Register } from './pages/Register';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<Places />} />
      <Route path="/login" element={<LoginForm/>} />
      <Route path='/destination' element={<Destination />} />
      <Route path='/register' element={<Register />} />

    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <div className='theme-wrapper'>
    <RouterProvider router={router} />
    </div>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
