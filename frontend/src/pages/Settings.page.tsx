import { Box, Container, Grid, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import {
  useGetConfigSettingsQuery,
  useGetLogsSettingsMutation,
} from '../redux/api/settingsApi';

const SettingsPage = () => {
  const { data: configData } = useGetConfigSettingsQuery('');
  const [getLogsSettings, { data: logsSettingsData }] =
    useGetLogsSettingsMutation();

  useEffect(() => {
    getLogsSettings('combined');
  }, [getLogsSettings]);

  return (
    <>
      <Box
        sx={{
          height: 'auto',
          width: '100%',
          mb: 6,
        }}
      >
        <Container maxWidth='lg'>
          <PageTitle title='Configurações e Logs de erro' />

          {/* Configuration Settings */}
          <Box mb={4}>
            <Typography variant='h5' component='h2' gutterBottom>
              Dados de configuração da aplicação
            </Typography>
            {configData ? (
              <Grid container spacing={3}>
                {Object.keys(configData).map((key) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <TextField
                      fullWidth
                      label={key.replace(/_/g, ' ')} // Replace underscores with spaces for better readability
                      value={configData[key as keyof typeof configData] || ''}
                      disabled
                      variant='outlined'
                      InputProps={{
                        type: key === 'POSTGRES_PASSWORD' ? 'password' : 'text', // Hide password field
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>Loading config data...</Typography>
            )}
          </Box>

          {/* Logs Section */}
          <Box mb={4}>
            <Typography variant='h5' component='h2' gutterBottom>
              Logs de erro
            </Typography>
            {logsSettingsData ? (
              <TextField
                fullWidth
                multiline
                minRows={10}
                maxRows={10}
                value={JSON.stringify(logsSettingsData, null, 2)}
                variant='outlined'
                disabled
              />
            ) : (
              <Typography>Loading logs...</Typography>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default SettingsPage;
