import { Product } from './Product'
import { validate } from '../validators/CPF'

type OrderItem = {
    quantity: number,
    product: Product
}

export class Order {
    items: OrderItem[] = []
    totalValue: number = 0;
    cpf: string;
    // freight: number;

    constructor(cpf: string) {
        this.cpf = cpf;

        if(!validate(cpf)) throw Error('CPF must be valid')
    }

    addItem(orderItem: OrderItem): void {
        if (this.items.some(item => item.product.id === orderItem.product.id)) throw new Error("Duplicated product")
        if(orderItem.quantity < 0) throw new Error('Product quantity must be positive')

        this.items.push(orderItem)
    }

    calculateTotal(): number {
        this.totalValue = this.items.reduce((acc, { product: { price } }) => acc + price, 0);
        return this.totalValue;
    }
}