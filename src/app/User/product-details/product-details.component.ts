import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";
import { constants } from "../../constants";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  public ProductDetails : any;
  SERVER_URL:string;

  constructor(
    private activatedRoute: ActivatedRoute, 
    public productService:ProductService,
    private cartService:CartService
  ) { }

  ngOnInit(): void {
    this.SERVER_URL=constants.SERVER_URL
    this.activatedRoute.queryParams.subscribe(params => {
      let ProductId = params['id'];;
      if(ProductId){
        if(history.state.navigationId>1){
          this.ProductDetails = history.state;
          this.ProductDetails['inCart'] = this.cartService.productInCart(this.ProductDetails._id) > -1 ? true : false;
        }
        else{
            this.productService.getProduct(ProductId).subscribe((res:any)=>{
              this.ProductDetails = res[0];
              this.ProductDetails['inCart'] = this.cartService.productInCart(this.ProductDetails._id) > -1 ? true : false;
            })
          }
        }
    });
  }

  addTocart(item:any){
    this.cartService.addProduct(item);
   }
  
}
