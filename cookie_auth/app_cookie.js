const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser('2eifhbdfkja94'));

const products = {
    1:{title: 'The history of web 1'},
    2:{title: 'The next web'},
};

app.get('/count', (req, res) => {
    let count = 0;
    if (req.signedCookies.count) {
        count = parseInt(req.signedCookies.count);
    } else {
        count = 0;
    };
    count = count + 1;
    res.cookie('count', count, {signed:true});
    res.send('count : ' + count);
});

app.get('/products', (req, res) => {
    let output = '';
    for(let name in products){
        output += 
        `<li>
            <a href="/cart/${name}">${products[name].title}</a>
        </li>`;
    }
    res.send(`
    <h1>Products</h1>
    <ul>${output}</ul>
    <a href="/cart">Cart</a>`)
});

app.get('/cart/:id', (req, res) => {
    var id = req.params.id;
    if(req.signedCookies.cart) {
        var cart = req.signedCookies.cart;
    } else {
        var cart = {};
    };
    if(!cart[id]){
        cart[id] = 0;
    };
    cart[id] = parseInt(cart[id]) + 1;
    res.cookie('cart', cart, {signed:true});
    // console.log(cart);
    res.redirect('/cart');
});

app.get('/cart', (req, res) => {
    var cart = req.signedCookies.cart;
    if(!cart) {
        res.send('Empty!')
    } else {
        var output = '';
        for(var id in cart){
            var text = `<li>${products[id].title} ---- (수량: ${cart[id]})</li>`;
            output = output + text;
        };
    }
    res.send(`<h1>Cart</h1><ul>${output}</ul><a href="/products">All Productst</a>`)
});

app.listen(3003, () => {
    console.log("Connected to 3003 port!")
});