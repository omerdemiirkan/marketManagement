import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MarketComponent} from './components/market/market.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MarketComponent, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'marketManagement';
}
