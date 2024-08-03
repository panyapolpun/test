const express = require('express');
const app = express()
const port = 3000

const mongoose = require('./db.mongo.js')

const accountSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    username: String,
    password: String,
    PoNo: String,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

const orderSchema = new mongoose.Schema({
    name: String,
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
})

const itemSchema = new mongoose.Schema({
    name: String,
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
})

const Account = mongoose.model('Account', accountSchema);
const Order = mongoose.model('Order', orderSchema);
const Item = mongoose.model('Item', itemSchema);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/get', async (req, res) => {
    const account = await Account.findOne({username: "SuperAdmin"})
    .populate({
        path: 'orders',
        populate: {
            path: 'items'
        }
    }).exec()

    res.json({account: account})
})

app.post('/create', async (req, res) => {
    
    const account = new Account({
        fname: "pun",
        lname: "test",
        username: "SuperAdmin",
        password: "1234",
        PoNo : "2024010022",
    })
    await account.save();

    const order1 = new Order({
        name: "order1",
        accountId: account._id
    })
    await order1.save()

    const order2 = new Order({
    name: "order2",
    accountId: account._id
    })
    await order2.save()

    account.orders.push(order1)
    account.orders.push(order2)
    await account.save()

    const item1 = new Item({
        name: "item1",
        orderId: order1._id
    })
    await item1.save()

    const item2 = new Item({
        name: "item2",
        orderId: order1._id
    })
    await item2.save()

    order1.items.push(item1)
    order1.items.push(item2)
    await order1.save()

    res.json({
        status: "account 1 create sucess"
    })
})

app.put('/update', async (req, res) => {

    const accountupdated = await Account.findOneAndUpdate({
        username: "SuperAdmin"
    }, {
        fname: "Pun"
    })

    return res.json({
        status: "account update sucess"
    })
})

app.delete('/delete', async (req, res) => {

    await Account.findOneAndDelete({
        username: "SuperAdmin"
    })

    return res.json({
        status: "account 1 delete"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})