import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../services/product.service";
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  products: any[]= [];
  limitedprods: any[]= [];
  viewall:boolean = true;

  constructor(
    public productService:ProductService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['show']=="all") this.viewall = true;
      else this.viewall = false
      this.productService.getProducts().subscribe((prods:any)=>{
        if(prods){
          prods.forEach((x:any) => {
            if(x.stock > 0){
              this.products.push(x)
            }
          });
          if(this.products.length <=25) this.limitedprods = this.products;
          else this.limitedprods = this.products.splice(0,25);
          
        }
      });
    });
  }

  get getProducts(){
    return !this.viewall ? this.limitedprods : this.products;
  }

}
