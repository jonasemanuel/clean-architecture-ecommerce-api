import express from 'express'
import {Checkout} from "./application/use-cases/Checkout";

const app = express();

app.use(express.json())

app.get('/orders', (request, response) => {

})

app.post('/checkout', async (request, response) => {
    const checkout = new Checkout();

    const output = await checkout.execute(request.body)

    response.json(output);
})

app.listen(3000, () => {
    console.log("UP")
})