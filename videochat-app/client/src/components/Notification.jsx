import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { SocketContext } from '../SocketContext';

const Notification = () => {
    const { answerCall, call, callAccepted} = useContext(SocketContext);

    if(!call) return <></>

    return (
        <>
            {/* Çağrı ulaşmışsa ve henüz kabul edilmediyse */}
            {call.isReceivedCall && !callAccepted && (
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <h1>{call.name} is calling:</h1>
                    <Button variant="contained" color="primary" onClick={answerCall}>
                        Answer
                    </Button>
                </div>
            )}
        </>
    )
}

export default Notification
