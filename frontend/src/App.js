import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/assets/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from './components/ui/toaster';
import Aside from './components/assets/Aside';

function App() {
  return (
    <div className="App h-screen">
      
      <Aside />
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
