export interface Order {
    _id:string
    buyername:string
    phone:string
    email:string
    products_ordered: any
    shipping_address:any
    order_status:string
    total_amount:number
    payment_details:any
}