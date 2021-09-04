import { Observable } from 'rxjs';
import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { CartService } from "../services/cart.service";
import { NotificationService } from "../services/notification.service";
import { VERSION, HostListener } from "@angular/core";
import { ClickOutsideModule } from 'ng-click-outside';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isMenuCollapsed = true;
  public SearchTerm: String = '';
  isLoggedIn$: Observable<boolean>;
  public innerWidth: any;
  public newordercount: number = 0;
  notifications: any=[];
  showNotification: boolean;  

  constructor(
    private authService: AuthenticationService, 
    private cartService: CartService,
    private notificationService: NotificationService
    ) { }

  openNotification(state: boolean) {
    if(state){
        this.notificationService.markNotifications().subscribe()
    }
    this.showNotification = state;
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.innerWidth = window.innerWidth;
    this.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
        if(isLoggedIn) {
          this.geetNotifications()
          setInterval(()=>{
            this.geetNotifications()
          },300000);

        }
      })
  }

  geetNotifications(){
    this.notificationService.getNotifications().subscribe((not:any)=>{
      if(not.length > 0){
        this.notifications = not
        this.newordercount = this.notifications.length
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    // alert(this.innerWidth);
  }

  get cartCount() {
    return JSON.parse(this.cartService.getCart).length;
  }

  onLogout() {
    this.authService.logout();
  }
  
  formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

}
