import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { WiCloudy, WiDaySunny, WiStrongWind } from 'react-icons/wi';
import { useGetWeatherQuery } from '../../redux/api/weatherApi';
import './Weather.css'; // Custom CSS for animations

interface Location {
  lat: string;
  lon: string;
}

const Weather: React.FC = () => {
  const [location, setLocation] = useState<Location>({
    lat: '-10.2111',
    lon: '-36.8403',
  });
  const [customLocation, setCustomLocation] = useState<Location>({
    lat: '-10.2111',
    lon: '-36.8403',
  });

  const {
    data: weather,
    error,
    refetch,
  } = useGetWeatherQuery(location, {
    skip: !location.lat || !location.lon,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude.toString(),
          lon: position.coords.longitude.toString(),
        });
      });
    }
  }, []);

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomLocation({
      ...customLocation,
      [name]: value,
    });
  };

  const handleCustomLocationSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocation(customLocation);
    refetch();
  };

  const renderWeatherIcon = (description: string) => {
    switch (description.toLowerCase()) {
      case 'clear sky':
        return <WiDaySunny className='weather-icon sunny' />;
      case 'broken clouds':
      case 'few clouds':
      case 'scattered clouds':
        return <WiCloudy className='weather-icon cloudy' />;
      case 'windy':
      case 'breeze':
        return <WiStrongWind className='weather-icon windy' />;
      default:
        return <WiCloudy className='weather-icon cloudy' />;
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        maxWidth: '600px',
        margin: 'auto',
        textAlign: 'initial',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c2e0f4',
      }}
    >
      <Typography
        variant='h4'
        sx={{
          color: '#1f1e1e',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 500,
          marginLeft: 1,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.25)',
            transformOrigin: 'center center', // Change transform origin to right side
          },
        }}
        gutterBottom
      >
        Previsão do Tempo
      </Typography>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {weather && (
          <Grid item sm={12} xs={8} md={6}>
            <Box className='weather-info'>
              <Box className='weather-header'>
                <Typography variant='h5' className='weather-city'>
                  {weather.name}
                </Typography>
                {renderWeatherIcon(weather.description)}
              </Box>
              <Box className='weather-details'>
                <Typography variant='body1'>
                  Temperatura: {weather.temp}°C
                </Typography>
                <Typography variant='body1'>
                  Sensação Térmica: {weather.feels_like}°C
                </Typography>
                <Typography variant='body1'>
                  Umidade: {weather.humidity}%
                </Typography>
                <Typography variant='body1'>
                  Pressão: {weather.pressure} hPa
                </Typography>
                <Typography variant='body1'>
                  Vento: {weather.wind_speed} m/s
                </Typography>
                <Typography variant='body1'>
                  Descrição: {weather.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
        {error && (
          <Typography color='error' variant='body1'>
            Error fetching weather data
          </Typography>
        )}
        <Grid item sm={12} xs={8} md={6}>
          <Box
            component='form'
            onSubmit={handleCustomLocationSubmit}
            sx={{ mt: 2 }}
          >
            <Typography variant='h6'>Digite as coordenadas</Typography>
            <TextField
              label='Latitude'
              name='lat'
              value={customLocation.lat}
              onChange={handleLocationChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label='Longitude'
              name='lon'
              value={customLocation.lon}
              onChange={handleLocationChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant='contained' type='submit' fullWidth>
              Buscar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Weather;
