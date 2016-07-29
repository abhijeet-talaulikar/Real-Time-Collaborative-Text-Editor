express = require('express');
app = express();
server = require('http').createServer(app);  
io = require('socket.io')(server);
bodyParser = require('body-parser');
cookieParser = require('cookie-parser');
fs = require('fs');
multer = require('multer');

var upload = multer({ dest: './current'});
app.use(bodyParser.urlencoded({ extended: false }));

currentFile = null;

workspaceView = __dirname + "\\workspace.html"; 

clients = 0;

//socket.io code
io.on('connection', function(client){
    client.broadcast.emit('join', (++clients).toString());
    client.on('disconnect', function(){
        client.broadcast.emit('leave', (--clients).toString());
    });
    client.on('edit', function(data) {
        client.broadcast.emit('edit', data);
        if(currentFile !== null) currentFile.text = data;
    });
    client.on('load', function(data) {
        client.broadcast.emit('load', data);
    });
    client.on('close', function(data) {
        client.broadcast.emit('close', data);
    });
});
//end socket.io code

app.get('/clients', function(req, res) {
    res.status(200).end(clients.toString());
});

app.get('/', function (req, res) {
    res.sendFile(workspaceView);
});

app.get('/:dir/:file', function(req, res) {
    res.sendFile(__dirname + req.originalUrl);
});

app.post('/uploadFile', upload.single('targetFile'), function(req, res) {
    var path = 'current/';
    if(req.file) {
        fs.rename(path + req.file.filename, path + req.file.originalname);
        var text = fs.readFileSync(path + req.file.originalname);
        currentFile = {
            name: req.file.originalname,
            size: req.file.size/1024,
            type: req.file.mimetype,
            text: text.toString()
        };
        res.status(200).json(currentFile);
    }
});

app.get('/getFileDetail', function(req, res) {
    if(currentFile !== null) res.json(currentFile);
    else res.end("none");
});

app.get('/getFile', function(req, res) {
    if(currentFile !== null) res.end(currentFile.text);
    res.end();
});

app.post('/saveFile', function(req, res) {
    var path = 'current/';
    fs.writeFileSync(path + currentFile.name, req.body.text, 'utf8');
    res.status(200).end();
});

app.get('/download', function(req, res) {
    var file = __dirname + "/current/" + currentFile.name;
    res.download(file, function(err) {});
});

app.delete('/closeFile', function(req, res) {
    var file = __dirname + "/current/" + currentFile.name;
    fs.unlinkSync(file);
    currentFile = null;
    res.status(200).end();
});

server.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App listening at http://%s:%s", host, port)
});