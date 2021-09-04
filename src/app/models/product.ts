export interface productDetails {
    _id:string;
    product_name: string;
    product_description: string;
    product_image: File;
    stock: number;
    part_number: string;
    unit_cost: string;
    selling_price: string;
    details : any;
    inputValue: string;
}