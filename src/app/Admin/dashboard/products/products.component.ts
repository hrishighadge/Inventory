import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// import { ModalComponent } from '../modal/modal.component';
import { ProductService } from '../../../services/product.service';
import { productDetails } from '../../../models/product';
import { ToastService } from '../../../services/toast.service';
import { ExcelService } from 'src/app/services/excel.service';
import { StockService } from 'src/app/services/stock.service';
import { Subject } from 'rxjs';
import { decode } from 'querystring';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  closeResult = '';
  prodquantity: number = 1;
  partnumber: String = '';
  selectall: Boolean = false;
  inoutmethod: String = 'inquantity';

  products: any[] = [];
  filterProducts: any[] = [];
  currDate: string;
  updateproduct: productDetails = {
    _id: null,
    product_name: null,
    product_description: null,
    product_image: null,
    stock: null,
    part_number: null,
    unit_cost: null,
    selling_price: null,
    details: null,
    inputValue: null,
  };
  isLoading: boolean = false;
  // data$ = new Subject<any>();
  search: string = '';

  constructor(
    private modalService: NgbModal,
    public productService: ProductService,
    public stockService: StockService,
    public excelService: ExcelService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getCurrDate();
    this.productService.getProducts().subscribe((prods: any) => {
      if (prods) {
        this.products = prods.map((p: any) => {
          p.checked = false;
          return p;
        });
        this.products = this.products.sort((a, b) =>
          a.register_date > b.register_date ? -1 : 1
        );
        this.filterProducts = this.products;
        // this.data$.next(prods);
      }
    });
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    this.partnumber = '';
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getCurrDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let date =
      today.getFullYear() +
      '-' +
      (mm < 10 ? '0' + mm : mm) +
      '-' +
      (dd < 10 ? '0' + dd : dd);
    this.currDate = date;
    console.log(this.currDate);
  }
  downloadReport(singleDay: number) {
    if (singleDay == 1) {
      this.showSuccess('Downloading....');
      const start_date = this.currDate;
      const end_date = this.currDate;
      this.stockService
        .getStocks({ start_date, end_date })
        .subscribe((data: any) => {
          console.log(data);
          this.excelService.exportAsExcelFile(data, start_date, end_date);
        });
    } else {
      const start_date = (<HTMLInputElement>(
        document.getElementById('start-date')
      )).value;
      const end_date = (<HTMLInputElement>document.getElementById('end-date'))
        .value;
      if (start_date && end_date) {
        this.showSuccess('Downloading...');
        this.stockService
          .getStocks({ start_date, end_date })
          .subscribe((data: any) => {
            console.log(data);
            this.excelService.exportAsExcelFile(data, start_date, end_date);
          });
      } else {
        this.showDanger('require input dates');
      }
    }
  }
  alterPart() {
    let productI = this.filterProducts.findIndex(
      (x: any) => x.part_number == this.partnumber
    );
    if (productI > -1) {
      if (this.prodquantity == -1 && this.filterProducts[productI].stock == 0) {
        this.showDanger('No more parts left');
      } else {
        this.filterProducts[productI].stock += this.prodquantity;
        this.updateproduct._id = this.filterProducts[productI]._id;
        this.updateproduct.stock = this.filterProducts[productI].stock;
        this.updateproduct.inputValue =
          this.prodquantity == -1
            ? (<HTMLInputElement>document.getElementById('remark')).value
            : '';
        // this.open('loading...')
        this.isLoading = true;
        this.productService
          .updateProduct(this.updateproduct)
          .subscribe((res: any) => {
            this.partnumber = '';
            if (this.prodquantity > -1) this.showSuccess('Part added');
            else this.showSuccess('Part removed');
            this.isLoading = false;
            // console.log(res);
          });
      }
    }
  }

  toggleAll() {
    this.filterProducts = this.filterProducts.map((p: any) => {
      p.checked = !this.selectall;
      return p;
    });
  }

  get isProductSelected() {
    return this.filterProducts.findIndex((x: any) => x.checked == true) > -1
      ? true
      : false;
  }

  selectProduct(prod: any) {
    prod.checked = !prod.checked;
  }

  inPart() {
    (<HTMLInputElement>document.getElementById('part-number')).focus();
    this.inoutmethod = 'inquantity';
    this.prodquantity = 1;
  }

  outPart() {
    (<HTMLInputElement>document.getElementById('part-number')).focus();
    this.inoutmethod = 'outquantity';
    this.prodquantity = -1;
  }

  showStandard(msg: string) {
    this.toastService.show(msg);
  }

  showSuccess(msg: string) {
    this.toastService.show(msg, {
      classname: 'bg-success text-light',
      delay: 1000,
    });
  }

  showDanger(msg: string) {
    this.toastService.show(msg, {
      classname: 'bg-danger text-light',
      delay: 1000,
    });
  }

  deleteSelectedProducts() {
    var toDelete = this.filterProducts
      .map((x: any) => (x.checked == true ? x : null))
      .filter((x) => x != null);
    this.productService
      .deleteMultipleProducts(toDelete.map((x: any) => x._id))
      .subscribe((res) => {
        // this.products = this.products
        //   .map((x: any) => (x.checked == false ? x : null))
        //   .filter((x) => x != null);

        this.filterProducts = this.filterProducts
          .map((x: any) => (x.checked == false ? x : null))
          .filter((x) => x != null);

        this.showSuccess('Products Deleted');
      });
  }

  deleteProduct(prod: any) {
    this.productService.deleteMultipleProducts([prod._id]).subscribe((res) => {
      // this.products.splice(
      //   this.products.findIndex((x: any) => x == prod),
      //   1
      // );

      this.filterProducts.splice(
        this.filterProducts.findIndex((x: any) => x == prod),
        1
      );

      this.showSuccess('Product Deleted');
    });
  }

  searchproduct() {
    if (this.search.length > 0)
      this.filterProducts = this.products.filter((x) =>
        x.part_number
          .toLocaleLowerCase()
          .includes(this.search.toLocaleLowerCase())
      );
    else this.filterProducts = this.products;
  }
}
