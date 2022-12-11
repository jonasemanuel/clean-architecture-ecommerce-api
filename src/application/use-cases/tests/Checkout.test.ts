import { Checkout } from "../Checkout";

const VALID_CPF = '542.301.670-32'

describe('[USECASE] Checkout', () => {
    describe('when user checkout', () => {
        it('should create a order with three products with correct total value', async () => {
            const checkout = new Checkout();
            const checkoutInput = {
                items: [
                    { productId: 1, quantity: 1 },
                    { productId: 3, quantity: 1 }
                ],
                cpf: VALID_CPF
            }

            await checkout.execute(checkoutInput);

            expect(checkout.totalValue).toBe(19.000)
        })

        it('should create an order with a valid coupon with correct value', async () => {
            const checkout = new Checkout();
            const checkoutInput = {
                items: [
                    { productId: 1, quantity: 2 },
                    { productId: 3, quantity: 1 }
                ],
                cpf: VALID_CPF,
                couponName: '10OFF'
            }

            await checkout.execute(checkoutInput)

            expect(checkout.totalValue).toBe(17.100)
        })

        it('should not create a order with a invalid cpf', async () => {
            const checkout = new Checkout();
            const checkoutInput = {
                items: [{ productId: 1, quantity: 1 }],
                cpf: '111.111.111-11'
            }

            await expect(checkout.execute(checkoutInput)).rejects.toThrow("CPF must be valid")
        })

        it('should not create an expired coupon', async () => {
            const checkout = new Checkout();
            const checkoutInput = {
                items: [
                    { productId: 1, quantity: 1 },
                    { productId: 3, quantity: 1 }
                ],
                cpf: VALID_CPF,
                couponName: 'EXPIRED'
            }

            await expect(checkout.execute(checkoutInput)).rejects.toThrow("Coupon Expired")
        })

        it('should not create an order with negative product quantity', async () => {
            const checkout = new Checkout();
            const checkoutInput = {
                items: [
                    { productId: 1, quantity: -2 },
                    { productId: 2, quantity: 1 }
                ],
                cpf: VALID_CPF,
                couponName: '10OFF'
            }

            await expect(checkout.execute(checkoutInput)).rejects.toThrow("Product quantity must be positive")
        })

        it('should not create an order with duplicated products', async () => {
            const checkout = new Checkout();
            const checkoutInput = {
                items: [
                    { productId: 1, quantity: 1 },
                    { productId: 1, quantity: 1 }
                ],
                cpf: VALID_CPF
            }

            await expect(checkout.execute(checkoutInput)).rejects.toThrow("Duplicated product")
        })

        it('should not create an order with any dimension product negative', async () => {
            const checkout = new Checkout();
            const checkoutInput = {
                items: [
                    { productId: 2, quantity: 1 },
                ],
                cpf: VALID_CPF
            }

            await expect(checkout.execute(checkoutInput)).rejects.toThrow("Product height must positive")
        })

        it('should calculate freight value correctly', async () => {
            const checkout = new Checkout();
            const checkoutInput = {
                items: [
                    { productId: 1, quantity: 2 },
                    { productId: 3, quantity: 1 }
                ],
                cpf: VALID_CPF,
                couponName: '10OFF'
            }

            await checkout.execute(checkoutInput)

            expect(checkout.totalValue).toBe(17.100)
        })
    })
})
