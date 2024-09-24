import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout';
import DailyAndPeriodAveragesPage from '../pages/DailyAndPeriodAveragesPage';
import DatabaseInfo from '../pages/DatabaseInfo.page';
import HomePage from '../pages/home.page';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='database-info' element={<DatabaseInfo />} />
        <Route path='*' element={<NotFound />} />
        <Route
          path='daily-and-period-averages'
          element={<DailyAndPeriodAveragesPage />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
