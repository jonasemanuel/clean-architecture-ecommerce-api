export class Product {
    id: number;
    description: string;
    price: number;
    weight: number;
    width: number;
    height: number;

    constructor(id: number, description: string, price: number, weight: number, width: number, height: number) {

        if(height < 0) throw new Error("Product height must positive")
        if(weight < 0) throw new Error("Product weight must positive")
        if(width < 0) throw new Error("Product width must positive")

        this.id = id;
        this.description = description;
        this.price = price;
        this.weight = weight;
        this.height = height;
        this.width = width;
    }
}