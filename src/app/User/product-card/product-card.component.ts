import { Component, OnInit, Input } from '@angular/core';
import { CartService } from "../../services/cart.service";
import { constants } from "../../constants";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  
  SERVER_URL:string;

  @Input() items : any;

  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.SERVER_URL=constants.SERVER_URL
    this.items.forEach((item:any) => {
      item['inCart'] = this.cartService.productInCart(item._id) > -1 ? true : false
    });
  }

  ngOnDestroy() {
 }

 addTocart(item:any){
   this.cartService.addProduct(item)
 }

}
