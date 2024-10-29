import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CurrencyService} from '../../services/currency.service';
import {ExchangeRates} from '../../models/currency.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent  implements OnInit{
  @Output() searchEvent  = new EventEmitter<string>();
  exchangeRates: ExchangeRates | null = null;
  private intervalId: any;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.updateCurrencyRates();
    this.intervalId = setInterval(() => this.updateCurrencyRates(), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  private updateCurrencyRates(): void {
    this.currencyService.getCurrencyRates().subscribe(
      (response) => {
        const usdRate = parseFloat(response.data.rates['USD']);
        const eurRate = parseFloat(response.data.rates['EUR']);
        const tlToUsd = (1 / usdRate).toFixed(2); // 1 TL = X USD
        const tlToEur = (1 / eurRate).toFixed(2); // 1 TL = Y EUR

        this.exchangeRates = {
          usd: parseFloat(tlToUsd),
          eur: parseFloat(tlToEur),
        };
      },
      (error) => {
        console.error('Döviz kurları alınırken hata oluştu:', error);
      }
    );
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.searchEvent.emit(inputElement.value);
    }
  }
}
