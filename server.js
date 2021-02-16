const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();


const published_key = 'pk_test_51ILPruAveULRC1nnoNWeuBb56K7ZGxtarSHSke8bzyJt6JvQZ6PqgHJ8ZWeoTmgqHFgLp5I0TT9CmWnDamCggtal008DMVV6Sa';
const secret_key = 'sk_test_51ILPruAveULRC1nnW0kkM81WCx2avYMoV0vnswQ7w5MTxQrNcU91iJGLSRB9JA1fEml7gHTr1EsBuES9DmUughyU005V4VouCX';
const stripe = require('stripe')(secret_key);

const PORT = process.env.PORT || 4400;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// View Engine Setup 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('Home', {
        key: published_key
    })
})

app.post('/payment', function (req, res) {

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Zubair Saif',
        address: {
            line1: 'Lahore Pakistan',
            postal_code: '54000',
            city: 'Lahore',
            state: 'Punjab',
            country: 'Pakistan',
        }
    })
        .then((customer) => {

            return stripe.charges.create({
                amount: 7000,    // Charing Rs 25 
                description: 'Web Development Product',
                currency: 'USD',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("Success") // If no error occurs 
        })
        .catch((err) => {
            res.send(err)    // If some error occurs 
        });
})

app.listen(PORT, function (error) {
    if (error) throw error
    console.log("Server created Successfully");
})