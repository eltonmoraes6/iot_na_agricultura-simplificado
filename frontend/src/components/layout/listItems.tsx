import BarChartIcon from '@mui/icons-material/BarChart';
// import InfoIcon from '@mui/icons-material/Info';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import StorageIcon from '@mui/icons-material/Storage';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import { Link } from 'react-router-dom';

export const mainListItems = (
  <div>
    <ListSubheader inset>Tempo Real</ListSubheader>
    <ListItem button component={Link} to='/'>
      <ListItemIcon>
        <ThermostatIcon />
      </ListItemIcon>
      <ListItemText primary='Informações' />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Sensor</ListSubheader>
    <ListItem button component={Link} to='/daily-and-period-averages'>
      <ListItemIcon>
        <InsertChartIcon />
      </ListItemIcon>
      <ListItemText primary='Média' />
    </ListItem>
    <ListItem button component={Link} to='/season-data-bar-chart'>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary='Estações do Ano' />
    </ListItem>
    <ListItem button component={Link} to='/info/advanced'>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary='Filtro de Dados' />
    </ListItem>
  </div>
);

export const tertiaryListItems = (
  <div>
    <ListSubheader inset>Banco de Dados</ListSubheader>
    <ListItem button component={Link} to='/database-info'>
      <ListItemIcon>
        <StorageIcon />
      </ListItemIcon>
      <ListItemText primary='Informações do Banco de Dados' />
    </ListItem>
  </div>
);
