import React, { useContext } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { SocketContext } from '../SocketContext';

const theme = createTheme();

const videoStyles = {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
        width: '300px',
    },
};

const gridContainerStyles = {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
    },
};

const paperStyles = {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
};

const VideoPlayer = () => {

    // * SocketContex'den akratılan tüm değişkenleri içerir
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

    return (
        <Grid container sx={gridContainerStyles}>
            {/* Me kullanıcısının videosu
            xs ve md ekran büyüklüğüne göre sayfanın tamamını ya da yarısını kaplaması için kullanıldı
            eğer bir arama varsa me videosunun gösterilmesi sağlandı */}
            {stream && (
                <Paper sx={paperStyles}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
                        <video playsInline muted ref={myVideo} autoPlay sx={videoStyles} />
                    </Grid>
                </Paper>
            )}

            {/* User kullanıcısının videosu 
            eğer arama kabul edildiyse ve bitirilmemişse userVideo gösterildi*/}
            {callAccepted && !callEnded && (
                <Paper sx={paperStyles}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
                        <video playsInline ref={userVideo} autoPlay sx={videoStyles} />
                    </Grid>
                </Paper>
            )}
        </Grid>
    )
}

export default VideoPlayer