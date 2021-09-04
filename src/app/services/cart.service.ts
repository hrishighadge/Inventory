import { Injectable } from '@angular/core';
import { ToastService } from "./toast.service";
import { ProductService } from "./product.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    public toastService: ToastService,
    public productService: ProductService
    ) { }

  createCart(value:string){
    let d:Date = new Date();
    d.setTime(d.getTime() + 5 * 24 * 60 * 60 * 1000);
    let expires:string = `expires=${d.toUTCString()}`;
    document.cookie = `cart = ${value}; ${expires}`;
  }

  get cartExists(){
    return document.cookie.split(";").findIndex((x)=>x.includes("cart")) > -1
  }

  get getCart(){
    if(this.cartExists){
      let cart = document.cookie.split(";").find((x)=>x.includes("cart")).split("=")
      return cart[1].length ? cart[1] : "[]";
    }
    return "[]";
  }

  productInCart(productId:string){
      var products = JSON.parse(this.getCart);
      return products.findIndex((x:any)=> x.id ==productId);
  }

  addProduct(product:any){
    this.productService.getProduct(product._id).subscribe((res:any)=>{
      if(res[0].stock>=1){
        var products: any[] =  products = JSON.parse(this.getCart);
        let index = products.findIndex((x:any)=> x.id ==product._id)
        if(index == -1){
          products.push({
            id:product._id,
            quantity:1
          })
          this.createCart(JSON.stringify(products))
          this.showSuccess("Product is added in cart")
          product.inCart = true;
        }
      }
      else{
        this.showDanger("Product is sold out")
      }
    })
  }

  removeProduct(productId:string){
    var products = JSON.parse(this.getCart);
    let index = this.productInCart(productId)
    if(productId.length > 1) products.splice(index, index==0 ? 1 : index)
    else  products.pop()
    this.createCart(JSON.stringify(products))
    this.showDanger("Product is removed from cart")
  }

  updateQuantity(productId:string, quantity:number){
    var products = JSON.parse(this.getCart);
    let index = this.productInCart(productId)
    if(products[index].quantity > quantity){
      products[index]={
        id: productId,
        quantity: quantity
      }
      this.createCart(JSON.stringify(products))
      this.showSuccess("Product quantity updated")
      // return true;
    }
    else{
      this.productService.getProduct(productId).subscribe((res:any)=>{
        if(res[0].stock>=quantity){
          products[index]={
            id: productId,
            quantity: quantity
          }
          this.createCart(JSON.stringify(products))
          this.showSuccess("Product quantity updated")
          // return true;
        }
        else{
          this.showDanger("Product quantity exceeded")
          // return false;
        }
      })
    }
  }

  emptyCart(){
    this.createCart("")
    this.showDanger("Cart is deleted")
  }

  showSuccess(msg:string) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 1000 });
  }

  showDanger(msg:string) {
    this.toastService.show(msg, { classname: 'bg-danger text-light', delay: 1000 });
  }
}
