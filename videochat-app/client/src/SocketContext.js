// * Socket ile ilgili her şey burada toplandı
// * Burada yapılan her şey componentlerle paylaşıldı

import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

// * Sunucu bağlantısı yapıldı
const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {

    //* Akışı ayarlamak için tanımlama yapıldı
    const [stream, setStream] = useState(null);

    // * Videoyu id'ye göre başlatmak için tanımlama yapıldı
    const [me, setMe] = useState('');

    // * Arama yapılması için tanımlama yapıldı
    const [call, setCall] = useState(null);

    // * Aramayı cevaplama ve bitirme için  state tanımlandı
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    // * name tanımlaması yapıldı
    const [name, setName] = useState('');

    // * Arayanın görüntüsü
    const myVideo = useRef();

    // * Arananın görüntüsü
    const userVideo = useRef();

    // * Bağlantı
    const connectionRef = useRef();

    useEffect(() => {

        // * Uygulama başlar başlamaz kullanıcıdan mikrofon ve video izni istendi getUserMedia ile alındı
        // * Akış düzenlendi
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                // * Arama yapanın görüntüsü 
                //myVideo.current.srcObject = currentStream;
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                };
            });

        //* index.js içinde tanımlanan kullanıcıyı spesifikleştiren 'me' değeri -arayan için id 
        // * vasfında kullanıldı- çekildi
        socket.on('me', (id) => setMe(id));

        // * Arama yapmak için kimin aradığı, kimin aradığı, sinyal ile çağrının cevaplanıp 
        //* cevaplanmadığı kontrol edilerek bir arama oluşturuldu
        socket.on('calluser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal })
        });
    }, []);

    // * Video görüşmesi için gerekli olan işlemler tanımlandı

    const answerCall = () => {
        setCallAccepted(true);

        // * initiator false olarak tanımlandı çünkü arama yapılmıyor, arama kabul ediliyor
        const peer = new Peer({ initiator: false, trickle: false, stream });

        //* sinyali aldığında index.js içinden answercall çağırıldı
        peer.on('signal', (data) => {
            socket.emit('answercall', { signal: data, to: call.from });
        });

        // * Arananın, karşı tarafın videosu
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const callUser = (id) => {

        // * initiator true olarak tanımlandı çünkü arama yapılıyor
        const peer = new Peer({ initiator: true, trickle: false, stream });

        //* sinyali aldığında index.js içinden calluser çağırıldı
        peer.on('signal', (data) => {
            // * Arananın id'si, aramanın me tarafından yapıldığı 
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
        });

        // * Arananın, karşı tarafın videosu
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const leaveCall = () => {
        // * Bağlantı kesildi. Kullanıcıdan ses ve görüntü alma durduruldu
        setCallEnded(true);
        connectionRef.current.destroy();

        // * Sayfa yeniden yüklendi ve yeni id'ye geçildi
        window.location.reload();
    }

    // * Componentlere aktarılmak istenen her şey value içinde söylendi ve tüm bunlar children'la sarıldı
    return (
        <SocketContext.Provider value={{
            call, callAccepted, myVideo, userVideo, stream, name, setName, callEnded, me, callUser, leaveCall,
            answerCall
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export { ContextProvider, SocketContext };
