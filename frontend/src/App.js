import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/assets/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="App h-screen">
      <Navbar />
      <Outlet />
      {/* <ToastContainer /> */}
      <Toaster />
    </div>
  );
}

export default App;
