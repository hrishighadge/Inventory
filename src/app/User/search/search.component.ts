import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ProductService } from "../../services/product.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public SearchTerm: String = "";
  products:any[] = [];

constructor(public productService:ProductService, public toastService: ToastService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.SearchTerm = params.get('query');
      this.productService.searchProduct(this.SearchTerm.toString()).subscribe((res:any)=>{
        this.products = res;
      })
      console.log(this.SearchTerm);
    });
  }

}
