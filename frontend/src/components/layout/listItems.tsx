// import InfoIcon from '@mui/icons-material/Info';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FunctionsIcon from '@mui/icons-material/Functions';
import GrassIcon from '@mui/icons-material/Grass';
import HomeIcon from '@mui/icons-material/Home';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import OpacityIcon from '@mui/icons-material/Opacity';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MyLogo from '../../assets/humidity.png';

import { Link } from 'react-router-dom';

export const mainListItems = (
  <div>
    <ListSubheader inset>Tempo Real</ListSubheader>
    <ListItem button component={Link} to='/'>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary='Informações' />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Sensores</ListSubheader>
    <ListItem button component={Link} to='/temperature'>
      <ListItemIcon>
        <ThermostatIcon style={{ color: 'red' }} />
      </ListItemIcon>
      <ListItemText primary='Temperaturas' />
    </ListItem>
    <ListItem button component={Link} to='/humidity'>
      <ListItemIcon>
        <img src={MyLogo} alt='My Image' style={{ width: 18, height: 18 }} />
      </ListItemIcon>
      <ListItemText primary='Umidade' />
    </ListItem>

    <ListItem button component={Link} to='/soil'>
      <ListItemIcon>
        <GrassIcon style={{ color: 'green' }} />
      </ListItemIcon>
      <ListItemText primary='Tipos de Solo' />
    </ListItem>

    <ListItem button component={Link} to='/water'>
      <ListItemIcon>
        <OpacityIcon style={{ color: 'blue' }} />
      </ListItemIcon>
      <ListItemText primary='Água' />
    </ListItem>

    <ListItem button component={Link} to='/season'>
      <ListItemIcon>
        <CalendarMonthIcon />
      </ListItemIcon>
      <ListItemText primary='Estações do Ano' />
    </ListItem>

    <ListItem button component={Link} to='/daily-and-period-averages'>
      <ListItemIcon>
        <InsertChartIcon />
      </ListItemIcon>
      <ListItemText primary='Média' />
    </ListItem>
  </div>
);

export const tertiaryListItems = (
  <div>
    <ListSubheader inset>Dados</ListSubheader>
    <ListItem button component={Link} to='/database-info'>
      <ListItemIcon>
        <StorageIcon />
      </ListItemIcon>
      <ListItemText primary='Informações do Banco de Dados' />
    </ListItem>

    <ListItem button component={Link} to='/metrics'>
      <ListItemIcon>
        <FunctionsIcon />
      </ListItemIcon>
      <ListItemText primary='Medidas' />
    </ListItem>
  </div>
);

export const quaternaryListItems = (
  <div>
    <ListSubheader inset>Configurações</ListSubheader>
    <ListItem button component={Link} to='/settings'>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary='Configurações' />
    </ListItem>
  </div>
);
