/**
 * Created by jiawei on 2016/11/18.
 */
var fs = require('fs');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static(__dirname));


app.get('/',function (req,res) {
    res.sendFile('./index.html',{root:__dirname})
});
function setBooks(books,callback) {
    fs.writeFile('./book.json',JSON.stringify(books),callback)

}
function getBooks(callback) {
    fs.readFile('./book.json','utf8',function (err,data) {
        var books = [];
        if(err){
            callback(books);
        }else{
            if(data.startsWith('[')){
                books = JSON.parse(data);
            }
            callback(books);
        }
    })
}
app.post('/books',function (req,res) {
    var book = req.body;
    getBooks(function (data) {
        book.id = data.length?data[data.length-1].id+1:1;
        data.push(book);
        setBooks(data,function () {
            res.send(book);

        })
    });
});
app.get('/books',function (req,res) {
    getBooks(function (data) {
        res.send(data)
    })
});
app.get('/books/:id',function (req,res) {
    var id = req.params.id;
    getBooks(function (data) {
        var book = data.find(function (item) {
            return item.id = id;
        });
        res.send(book);
    })
});
app.delete('/books/:id',function (req,res) {
    var id = req.params.id;
    getBooks(function (data) {
        var books = data.filter(function (item) {
            return item.id !=id;
        });
        setBooks(books,function () {
            res.send({});
        })
    })
});
app.put('/books/:id',function (req,res) {
    var id = req.params.id;
    var book = req.body;

    getBooks(function (data) {
        var books = data.map(function (item) {
            if(item.id == id){
                return book;
            }else {
                return item
            }
        });
        setBooks(books,function () {
            res.send(book);
        })
    })
});

app.listen(28303,console.log('28303'));

