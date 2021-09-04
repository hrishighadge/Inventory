import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";
import { constants } from "../../constants";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  products: any[] = [];
  SERVER_URL:string;

  constructor(public productService:ProductService, private cartService:CartService) { }

  ngOnInit(): void {
    this.cart = JSON.parse(this.cartService.getCart);
    this.SERVER_URL=constants.SERVER_URL
    this.productService.getMultipleProducts(this.cart.map((x)=> x.id)).subscribe((resp:any)=>{
      this.cart.forEach((c:any) => {
        let prod = resp.find((x:any)=> c.id == x._id);
        if(prod){
          this.products.push({
            _id : prod._id,
            product_name: prod.product_name,
            product_description: prod.product_description,
            product_image: prod.product_image,
            stock: prod.stock,
            part_number: prod.part_number,
            selling_price: prod.selling_price,
            total_price: prod.selling_price * c.quantity,
            quantity: c.quantity,
          })
        }
        else{
          this.cartService.removeProduct(c.id)
        }
      });
    })
  }

  updateQauantity(product:any, q:number){
    let quantity = product.quantity + q;
    if(quantity>0){
      this.cartService.updateQuantity(product._id, quantity)
      if(product.stock >= quantity || quantity < product.quantity){
        product.quantity = quantity;
        product.total_price = product.selling_price * product.quantity
      }
    }
    else{
      this.deleteFromCart(product);
    }
  }

  deleteFromCart(product: any){
    let index = this.products.findIndex((x)=> x == product)
    if(this.products.length > 1) this.products.splice(index, index == 0 ? 1 : index)
    else this.products.pop()

    this.cartService.removeProduct(product._id)
  }

  get cartTotal(){
    return this.products.length ? this.products.map((x)=> x.total_price).reduce(this.myFunc) : 0;
  }

  myFunc(total:number, num:any) {
    return total + num;
  }

}
