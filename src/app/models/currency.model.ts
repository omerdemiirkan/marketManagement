export interface CurrencyRatesResponse {
  data: {
    rates: {
      [key: string]: string;
    };
  };
}
export interface ExchangeRates {
  usd: number;
  eur: number;
}
