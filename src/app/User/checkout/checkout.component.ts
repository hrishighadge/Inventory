import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";
import { ToastService } from "../../services/toast.service";
import { OrderService } from "../../services/order.service";
import { Order } from "../../models/order";
import { OrderPlacedComponent } from '../order-placed/order-placed.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  closeResult = '';
  paymentmethodlabel = "";
  cart: any[] = [];
  products: any[] = [];
  order: FormGroup =this.formBuilder.group({});
  payment_details: FormGroup = this.formBuilder.group({});
  shipping_address: FormGroup = this.formBuilder.group({});
  products_ordered: any[] = [];
  orderDetails: Order;
  cannotPlace:boolean = false;

  constructor(
    public formBuilder: FormBuilder, 
    public productService:ProductService, 
    private cartService:CartService, 
    public toastService: ToastService, 
    private orderService:OrderService, 
    private router: Router,
    private modalService: NgbModal,
    public matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    /********************Fetch cart and product details**********************/
    this.cart = JSON.parse(this.cartService.getCart);
    if(this.cart.length==0) this.router.navigate(['/']);

    this.productService.getMultipleProducts(this.cart.map((x)=> x.id)).subscribe((resp:any)=>{
      this.cart.forEach((c:any) => {
        let prod = resp.find((x:any)=> c.id == x._id);
        if(prod){
            if(c.quantity>prod.stock){
              this.cannotPlace = true;
            }
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
          this.products_ordered.push({
            product_id: prod._id,
            quantity: c.quantity,
          })
        }
        else{
          this.cannotPlace = true;
          this.cartService.removeProduct(c.id)
        }
      });
    })
    
    /***************************Form******************************/
    this.shipping_address = this.formBuilder.group({
      address_line1: ['',Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ])],
      address_line2: [''],
      state: ['',Validators.required],
      city: ['',Validators.required],
      postal_code: ['',Validators.compose([
        Validators.required,
        Validators.pattern('^\\d{6}$')
      ])],
    });
    
    this.payment_details = this.formBuilder.group({
      transaction_id: ['',Validators.required],
      mode: ['paynow', Validators.required],
    });
    
    this.order = this.formBuilder.group({
      buyername: ['',Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200)
      ])],
      phone:['',Validators.compose([
        Validators.required,
        Validators.pattern('^\\d{8}$')
      ])],
      email:['',Validators.compose([
        Validators.required,
        Validators.email
      ])],
      shipping_address: this.shipping_address,
    })

  }

  get orderF() {
    return this.order.controls;
  }

  get shippingF() {
    return this.shipping_address.controls;
  }

  get paymentF() {
    return this.payment_details.controls;
  }

  placeOrdrer(){
    if(this.paymentmethodlabel != "viacod" && !this.payment_details.valid){
        this.showDanger("Please Enter Tramsaction ID.")
    }
    else{
      this.orderDetails = this.order.value;
      this.orderDetails.payment_details = this.payment_details.value
      this.orderDetails.total_amount = this.cartTotal
      this.orderDetails.products_ordered = this.products_ordered
      this.orderService.placeOrder(this.orderDetails).subscribe((res:any)=>{
        this.cartService.emptyCart()
        this.modalService.dismissAll()
        this.matDialog.open(OrderPlacedComponent,{
          width:'60%',
          minWidth:"400px", 
          data: res,
        })
      })
    }
  }

  open(content: any) {
    if(this.order.valid){
      // this.cart = JSON.parse(this.cartService.getCart);
      this.productService.getMultipleProducts(this.cart.map((x)=> x.id)).subscribe((resp:any)=>{
        this.cart.forEach((c:any) => {
          let prod = resp.find((x:any)=> c.id == x._id);
          if(prod){
            if(c.quantity>prod.stock){
              this.cannotPlace = true;
              this.products.find((x:any)=> x._id == c.id)['stock'] = prod.stock
            }
          }
          else{
            this.cartService.removeProduct(c.id)
            let index = this.products.findIndex((x)=> x == prod)
        
            if(this.products.length > 1) this.products.splice(index, index == 0 ? 1 : index)
            else this.products.pop()

            this.cannotPlace = this.cart.length == 1 ? true : false;
          }
        });
        if(!this.cannotPlace){
          this.modalService.open(content, {backdrop: 'static', ariaLabelledBy: 'modal-basic-title', windowClass: "checkout-payment-modal"}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        }
      });
    }
    else{
      this.showDanger("Please add all details correctly.");
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  get cartTotal(){
    return this.products.length ? this.products.map((x)=> x.total_price).reduce(this.myFunc) : 0;
  }

  myFunc(total:number, num:any) {
    return total + num;
  }
  showStandard(msg:string) {
    this.toastService.show(msg);
  }

  showSuccess(msg:string) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 1000 });
  }

  showDanger(msg:string) {
    this.toastService.show(msg, { classname: 'bg-danger text-light', delay: 1000 });
  }
  
}
