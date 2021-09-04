import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  closeResult = '';
  viewMode = 'neworders';
  orders: any[] = [];
  searchInput: string;
  searchedOrders: any[] = [];
  show: boolean = false;
  IDs: any[] = [];
  products: any[] = [];
  viewOrder: any = {};

  constructor(
    private modalService: NgbModal,
    private orderService: OrderService,
    private productService: ProductService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((resOrders: any) => {
      this.orders = resOrders;
      this.orders.map((order: any) =>
        order.products_ordered.map((product: any) =>
          !this.IDs.includes(product.product_id)
            ? this.IDs.push(product.product_id)
            : product.product_id
        )
      );
      this.productService
        .getMultipleProducts(this.IDs)
        .subscribe((prodRes: any) => {
          this.products = prodRes;
        });
    });
  }

  get newOrders() {
    return this.orders.filter(
      (x) => x.order_status == 'Pending' || x.order_status == 'Rejected'
    );
  }

  get approvedOrders() {
    return this.orders.filter(
      (x) => x.order_status != 'Pending' && x.order_status != 'Rejected'
    );
  }

  updateStatus(order: any, status: string) {
    this.orderService
      .updateOrder({
        id: order._id,
        status: status,
      })
      .subscribe((res) => {
        order.order_status = status;
        this.showSuccess('Order status updated');
      });
  }

  updateStatusEvent(order: any, target: any) {
    this.updateStatus(order, target.value);
  }

  getOrderDetails(searchQuery: string) {
    // console.log("function id = " + orderId)
    this.orderService.searchOrders(searchQuery).subscribe((res: any) => {
      if (res == 0) {
        this.showDanger('No Search Results');
        this.show = false;
      } else {
        this.searchedOrders = res;
        console.log(this.searchedOrders);
        this.show = true;

        this.searchedOrders.map((order: any) =>
          order.products_ordered.map((product: any) =>
            !this.IDs.includes(product.product_id)
              ? this.IDs.push(product.product_id)
              : product.product_id
          )
        );
        this.productService
          .getMultipleProducts(this.IDs)
          .subscribe((prodRes: any) => {
            this.products = prodRes;
          });
      }
    });
  }

  open(order: any, content: any) {
    this.viewOrder = order;
    this.viewOrder['products'] = this.products.filter((x) =>
      order.products_ordered.map((y: any) => y.product_id).includes(x._id)
    );
    this.viewOrder['products'].forEach((x: any) => {
      let prod = this.viewOrder.products_ordered.find(
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
      delay: 2000,
    });
  }

  showDanger(msg: string) {
    this.toastService.show(msg, {
      classname: 'bg-danger text-light',
      delay: 2000,
    });
  }
}
