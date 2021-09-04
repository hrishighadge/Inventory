import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService } from '../../services/toast.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { constants } from '../../constants';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productDetails: FormGroup = this.formBuilder.group({});
  details: FormArray = this.formBuilder.array([]);
  image: File = null;
  EditProduct: any = {};
  EditProductId: string = null;
  title: string = 'Add New Product';
  isEdit: boolean = false;
  editImg: string = '';

  constructor(
    public formBuilder: FormBuilder,
    public productService: ProductService,
    private sanitizer: DomSanitizer,
    public toastService: ToastService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productDetails = this.formBuilder.group({
      product_name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
      product_description: [
        this.EditProduct.product_description,
        Validators.compose([Validators.maxLength(300)]),
      ],
      product_image: this.image,
      stock: [
        this.EditProduct.stock,
        Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
      ],
      part_number: [
        this.EditProduct.part_number,
        Validators.compose([Validators.required]),
      ],
      unit_cost: [
        this.EditProduct.unit_cost,
        Validators.compose([
          Validators.required,
          Validators.pattern('[.0-9]+'),
        ]),
      ],
      selling_price: [
        this.EditProduct.selling_price,
        Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
      ],
      details: this.details,
    });

    this.addDetails('', '');

    /*****************Edit Product***********************/
    this.activatedRoute.queryParams.subscribe((params) => {
      this.EditProductId = params['id'];
      if (this.EditProductId) {
        this.title = 'Edit Product';
        if (history.state.navigationId > 1) {
          this.EditProduct = history.state;
          this.setEditProduct();
        } else {
          this.productService
            .getProduct(this.EditProductId)
            .subscribe((res: any) => {
              this.EditProduct = res[0];
              this.setEditProduct();
            });
        }
      }
    });
  }

  setEditProduct() {
    console.log(this.EditProduct);
    this.details.removeAt(0);
    this.EditProduct.prod_details.forEach((det: any, index: number) => {
      this.addDetails(det.key, det.value);
    });
    this.isEdit = true;
    this.editImg = constants.SERVER_URL + this.EditProduct.product_image;
    this.f['product_name'].setValue(this.EditProduct.product_name);
    this.f['product_description'].setValue(
      this.EditProduct.product_description
    );
    this.f['stock'].setValue(this.EditProduct.stock);
    this.f['part_number'].setValue(this.EditProduct.part_number);
    this.f['unit_cost'].setValue(this.EditProduct.unit_cost);
    this.f['selling_price'].setValue(this.EditProduct.selling_price);
  }

  addDetails(key: string, value: string) {
    this.details = this.productDetails.get('details') as FormArray;
    this.details.push(
      this.formBuilder.group({
        key: key,
        value: value,
      })
    );
  }

  get sellingprice() {
    this.f['selling_price'].setValue(
      Math.round(this.productDetails.get('unit_cost').value * 1.4)
    );
    return this.productDetails.get('selling_price').value;
  }

  get f() {
    return this.productDetails.controls;
  }

  handleFileInput(target: any) {
    this.isEdit = false;
    this.f['product_image'].setValue(target.files.item(0));
    this.image = target.files.item(0);
  }

  get getURL() {
    return URL.createObjectURL(this.image);
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  saveProduct() {
    if (this.productDetails.valid) {
      if (this.EditProductId != null) {
        var prod = this.productDetails.value;
        prod._id = this.EditProduct._id;
        this.productService.updateProduct(prod).subscribe(
          (res) => {
            this.showSuccess('Product Successfully Saved');
            console.log(res);
            setTimeout(() => location.reload(), 2000);
          },
          (err) => {
            this.showDanger('something went wrong');
            console.log(err);
          }
        );
      } else {
        this.productService.addProduct(this.productDetails.value).subscribe(
          (res) => {
            this.showSuccess('Product Successfully Added');
            console.log(res);
            setTimeout(() => location.reload(), 2000);
          },
          (err) => {
            this.showDanger('something went wrong');
            console.log(err);
          }
        );
      }
    } else {
      this.showDanger('Please add all details correctly.');
      console.log('form err');
    }
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
}
