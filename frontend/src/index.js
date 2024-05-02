import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { LoginForm } from './pages/Login';
import Places from './pages/Places';
import Planner from './pages/Planner';
import { store } from './store';
import { Provider } from 'react-redux';
import { Register } from './pages/Register';
import SetupDestination from './pages/SetupDestination';
import Eateries from './pages/Eateries';
import Itinerary from './pages/Itinerary';
import PrivateRoutes from './components/assets/PrivateRoutes';
import ItineraryDetails from './pages/ItineraryDetails';
import Journey from './pages/Journey';
import ItineraryPublic from './pages/ItineraryPublic';
import MyProfile from './pages/MyProfile';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path="/login" element={<LoginForm/>} />
      <Route path='/register' element={<Register />} />
      <Route path='/itineraryPublic/:id' element={<ItineraryPublic />} />

      <Route path='' element={<PrivateRoutes />}>
        <Route index={true} path='/' element={<Journey />} />
        <Route index={true} path='/profile' element={<MyProfile />} />

        {/* <Route path='/journey' element={<Journey />} /> */}
        {/* <Route path='/planner' element={<Planner />} />
        <Route path='/places' element={<Places />} />
        <Route path='/eateries' element={<Eateries />} />
        <Route path='/itinerary' element={<Itinerary />} /> */}
      </Route>

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
