// * UYGULAMANIN SUNUCU TARAFI

// * Uygulama tanımlandı
const app = require("express")();

// * Uygulama server'a iletildi
const server = require("http").createServer(app);

// * Kökenler arası kaynak paylaşımı yapıldı.
// * Yani, bir internet tarayıcısı üzerinden farklı bir kökene (protokol, domain ve port) 
// * herhangi bir istek gönderirse cross-origin HTTP isteği oluşturmuş olacak 
const cors = require("cors");

// * Video paylaşımı yapılması için socket.io istendi 
const io = require("socket.io")(server, {
    cors: {
        // * Yıldız işareti tüm originlere olanak sağladı
        origin: "*",
        // * Videoyu almak ve göndermek için GET ve POST methodları kullanıldı
        methods: ["GET", "POST"]
    }
});

// * Cors kullanılmak üzere çağırıldı
app.use(cors());

// * Port tanımlaması yapıldı
// * localhost:5000 için de çalışması sağlandı
const PORT=process.env.PORT || 5000;

// * Uygulama çalıştırıldı ve ekrana uyarı verildi
app.get("/", (req, res) => {
    res.send('Server is running');
});

// * Socket ile gerçek zamanlı veri iletimini sağlandı
io.on('connection', (socket) =>{

    // * Bu iletim kimlikle gerçekleştirildi
    socket.emit('me', socket.id);

    // * Bağlantıyı sonlandırma işlemi yapıldı 
    socket.on('disconnect',()=>{
        socket.broadcast.emit("callended");
    });

    // * Aranan, arayan bilgileriyle bağlantı kurma, arama işlemi yapıldı
    socket.on("calluser", ({userToCall, signalData, from, name})=>{
        io.to(userToCall).emit("calluser", {signal: signalData, from, name})
    });

    //* Çağrıyı kabul etme işlevi yerine getirildi
    socket.on("answercall", (data)=>{
        io.to(data.to).emit("callaccepted", data.signal);
    })
});

// * Server'ın portu dinlemesi sağlandı ve console'a bu konuda bir bilgilendirm mesajı gönderildi
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
