export interface Product {
  id: string ;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  type: string;
  products: Product[];
}

export interface Market {
  id: number;
  name: string;
  departments: Department[];
}
