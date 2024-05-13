import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout';
import DailyAndPeriodAveragesPage from '../pages/DailyAndPeriodAveragesPage';
import DatabaseInfo from '../pages/DatabaseInfo';
import NotFound from '../pages/NotFound';
import SeasonDataBarChart from '../pages/SeasonDataBarChart';
import HomePage from '../pages/home.page';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path='daily-and-period-averages'
          element={<DailyAndPeriodAveragesPage />}
        />
        <Route path='season-data-bar-chart' element={<SeasonDataBarChart />} />
        <Route path='database-info' element={<DatabaseInfo />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
