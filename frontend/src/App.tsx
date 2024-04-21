import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout';
import DailyAndPeriodAveragesPage from './pages/DailyAndPeriodAveragesPage';
import DatabaseInfo from './pages/DatabaseInfo';
import SeasonDataBarChart from './pages/SeasonDataBarChart';

import HomePage from './pages/home.page';

function App() {
  return (
    <>
      <CssBaseline />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />

          <Route
            path='daily-and-period-averages'
            element={<DailyAndPeriodAveragesPage />}
          />

          <Route
            path='season-data-bar-chart'
            element={<SeasonDataBarChart />}
          />

          <Route path='database-info' element={<DatabaseInfo />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
