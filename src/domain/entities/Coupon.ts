export class Coupon {
    name?: string;
    value: number = 0;
    expireDate: Date;

    constructor(name: string, value: number, expireDate: Date) {
        const today = new Date()
        if(expireDate < today) throw new Error('Coupon Expired');

        this.name = name
        this.value = value;
        this.expireDate = expireDate
    }

    getValue(): number {
        return this.value;
    }
}