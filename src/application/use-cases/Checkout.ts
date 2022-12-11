import mysql from 'mysql2';

import {Product} from "../../domain/entities/Product";
import { Coupon } from "../../domain/entities/Coupon";
import { Order } from "../../domain/entities/Order";

type CheckoutInput = {
    items: { quantity: number; productId: number; }[];
    cpf: string;
    couponName?: string;
}

type CheckoutOutput = {
    success: boolean;
    data: { totalValue: number; }
}

export class Checkout {
    coupon?: Coupon;
    totalValue: number = 0;

    async execute(input: CheckoutInput): Promise<CheckoutOutput> {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'branas_ecommerce'
        });

        const order: Order = new Order(input.cpf);

        for (const item of input.items) {
            const selectProductQuery = `SELECT * FROM products WHERE id = '${item.productId}'`;
            const [rows] = await connection.promise().query(selectProductQuery, { rowsAsArray: true }) as any
            const product = new Product(
                rows[0].id,
                rows[0].description,
                parseFloat(rows[0].price),
                parseFloat(rows[0].weight),
                parseFloat(rows[0].width),
                parseFloat(rows[0].height)
            );

            order.addItem({ product, quantity: item.quantity })
        }

        this.totalValue = order.calculateTotal()

        if(input.couponName) {
            const selectCouponQuery = `SELECT * FROM coupons WHERE name = '${input.couponName}'`
            const [rows] = await connection.promise().query(selectCouponQuery, { rowsAsArray: true }) as any

            this.coupon = new Coupon(rows[0].name, parseFloat(rows[0].value),  new Date(rows[0].expire_date))
            const couponValue = (this.totalValue * this.coupon.getValue())/100
            this.totalValue -= couponValue;
        }

        return {
            success: true,
            data: {
                totalValue: parseFloat(this.totalValue.toFixed(3))
            }
        }
    }
}