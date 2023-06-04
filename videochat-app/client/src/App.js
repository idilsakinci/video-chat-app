import React from 'react';

import { Typography, AppBar } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notification from './components/Notification';

const theme = createTheme();

// * Style özellikleri tanımlandı
const appBarStyles = {
  borderRadius: 15,
  margin: '30px 100px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  width: '600px',
  border: '2px solid black',

  [theme.breakpoints.down('xs')]: {
    width: '90%'
  }
};

const wrapperStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%'
};

const App = () => {

  return (
    <div style={wrapperStyles}>
      <AppBar sx={appBarStyles} position='static' color='inherit'>
        <Typography variant='h3' align='center'>
          Video Conferencing App
        </Typography>
      </AppBar>
      <VideoPlayer />
      <Options>
        <Notification />
      </Options>
    </div>
  )
}

export default App;