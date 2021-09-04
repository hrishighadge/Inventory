import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { constants } from '../../constants';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss'],
})
export class OrderTrackingComponent implements OnInit {
  closeResult = '';

  // Order Progress
  // 0% => Order Processed
  // 33% => Order Shipped
  // 66% => Order Enroute
  // 100% => Order Arrived
  public OrderStatus: { [status: string]: number } = {
    Pending: 0,
    Rejected: -1,
    Processed: 25,
    Shipped: 50,
    'En-route': 75,
    Delivered: 100,
  };
  OrderProgress: number = 0;
  OrderDetails: any = {};
  products: any[] = [];
  IDs: any[] = [];
  inputId: string;
  SERVER_URL: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private orderService: OrderService,
    public toastService: ToastService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.SERVER_URL = constants.SERVER_URL;
    this.activatedRoute.queryParams.subscribe((params) => {
      let orderId = params['id'];
      if (orderId) {
        // console.log(orderId)
        this.getOrderDetails(orderId);
      }
    });
  }

  getOrderDetails(orderId: string) {
    // console.log("function id = " + orderId)
    this.orderService.getOrder(orderId).subscribe((res: any) => {
      if (res == 0) {
        this.showDanger('Invalid Order ID');
      } else {
        this.OrderDetails = res;
        // console.log(this.OrderDetails);
        this.OrderProgress = this.OrderStatus[res.order_status];
        // console.log(this.OrderDetails.products_ordered)
        // console.log(this.OrderProgress)
        this.IDs = this.OrderDetails.products_ordered.map(
          (o: any) => o.product_id
        );
        this.productService
          .getMultipleProducts(this.IDs)
          .subscribe((prodRes: any) => {
            this.products = prodRes;
          });
      }
    });
  }

  open(content: any) {
    this.OrderDetails['products'] = this.products;
    this.OrderDetails['products'].forEach((x: any) => {
      let prod = this.OrderDetails.products_ordered.find(
        (y: any) => y.product_id == x._id
      );
      x['quantity'] = prod.quantity;
    });
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'view-order-modal',
      })
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
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  formatDate(date: string) {
    return new Date(date).toDateString();
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
}
