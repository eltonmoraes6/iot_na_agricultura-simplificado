import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout';
import DailyAndPeriodAveragesPage from '../pages/DailyAndPeriodAveragesPage';
import DatabaseInfo from '../pages/DatabaseInfo.page';
import HomePage from '../pages/home.page';
import HumidityPage from '../pages/Humidity.page';
import MetricsPage from '../pages/Metrics.page';
import NotFound from '../pages/NotFound';
import SeasonPage from '../pages/Season.page';
import SettingsPage from '../pages/Settings.page';
import SoilPage from '../pages/Soil.page';
import TemperaturePage from '../pages/Temperature.page';
import WaterPage from '../pages/Water.page';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='database-info' element={<DatabaseInfo />} />
        <Route path='temperature' element={<TemperaturePage />} />
        <Route path='humidity' element={<HumidityPage />} />
        <Route path='season' element={<SeasonPage />} />
        <Route path='soil' element={<SoilPage />} />
        <Route path='water' element={<WaterPage />} />
        <Route path='settings' element={<SettingsPage />} />
        <Route path='metrics' element={<MetricsPage />} />
        <Route
          path='daily-and-period-averages'
          element={<DailyAndPeriodAveragesPage />}
        />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
