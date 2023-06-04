import React, { useContext, useState } from "react";
import { Button, TextField, Grid, Typography, Container, Paper } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@mui/icons-material';
import { SocketContext } from "../SocketContext";

const theme = createTheme();

const rootStyles = {
    display: 'flex',
    flexDirection: 'column',
};
const gridContainerStyles = {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
    },
};
const containerStyles = {
    width: '800px',
    margin: '10px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
        width: '80%',
    },
};
const marginStyles = {
    marginTop: 2,
};
const paddingStyles = {
    padding: 2,
};
const paperStyles = {
    padding: '1px 2px',
    border: '2px solid black',
};

const Options = ({ children }) => {
    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');

    return (
        // * Sayfanın isim, id, arama başlatma kısmı oluşturuldu
        <Container sx={containerStyles}>
            <Paper elevation={10} sx={paperStyles}>
                <form sx={rootStyles} noValidate autoComplete="off00">
                    <Grid container sx={gridContainerStyles}>
                        <Grid item xs={12} md={6} sx={paddingStyles}>
                            <Typography gutterBottom variant="h6">Account Info</Typography>
                            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)}
                                fullWidth />
                            {/* ID kopyalamak için bir buton oluşturuldu */}
                            <CopyToClipboard text={me} sx={marginStyles} >
                                <Button variant="contained" color="primary" fullWidth
                                    startIcon={<Assignment fontSize="large" />}>
                                    Copy Your ID
                                </Button>
                            </CopyToClipboard>
                        </Grid>
                        {/* Arama başlatma kısmı tanımlandı */}
                        <Grid item xs={12} md={6} sx={paddingStyles}>
                            <Typography gutterBottom variant="h6">Make a Call</Typography>
                            <TextField label="ID to Call" value={idToCall}
                                onChange={(e) => setIdToCall(e.target.value)}
                                fullWidth />
                            {/* Eğer çağrı kabul edildiyse ve arama bitmediyse aramayı bitirme butonu devreye girer */}
                            {/* Eğer aksi bir durum varsa  */}
                            {callAccepted && !callEnded ? (
                                <Button variant="contained" color="error" fullWidth
                                    startIcon={<PhoneDisabled fontSize="large" />} onClick={leaveCall}
                                    sx={marginStyles}>Hang Up</Button>
                            ) : (
                                // * onClick için callUser'ı direkt çağırmama sebebimiz fonksiyonun 
                                //* çalışması için tıklamayı beklemesi gerekmesi
                                <Button variant="contained" color="success" fullWidth
                                    startIcon={<Phone fontSize="large" />} onClick={() => callUser(idToCall)}
                                    sx={marginStyles}>Call</Button>
                            )}
                        </Grid>
                    </Grid>
                </form>
                {children}
            </Paper>
        </Container>
    )
}

export default Options