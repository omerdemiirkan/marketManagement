import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CurrencyRatesResponse} from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService  {
  private apiUrl = `https://api.coinbase.com/v2/exchange-rates?currency=TRY`;

  constructor(private http: HttpClient) {}
  getCurrencyRates(): Observable<CurrencyRatesResponse> {
    return this.http.get<CurrencyRatesResponse>(this.apiUrl);
  }
}
