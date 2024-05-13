import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import AppRoutes from './routes';

function App() {
  return (
    <>
      <CssBaseline />
      <ToastContainer />
      <AppRoutes />
    </>
  );
}

export default App;
