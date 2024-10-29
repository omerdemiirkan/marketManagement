import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Department, Market, Product} from '../models/market.model';

// JSON veri seti
const marketData: Market[] = [
  {
    id: 1,
    name: 'Market 1',
    departments: [
      {
        id: 1,
        name: 'R1',
        type: 'Gıda',
        products: [
          { id: '1', name: 'Ekmek' },
          { id: '2', name: 'Süt' },
          { id: '3', name: 'Peynir' }
        ]
      },
      {
        id: 2,
        name: 'R2',
        type: 'Temizlik',
        products: [
          { id: '4', name: 'Deterjan' },
          { id: '5', name: 'Sabun' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Market 2',
    departments: [
      {
        id: 3,
        name: 'R1',
        type: 'Gıda',
        products: [
          { id: '6', name: 'Makarna' },
          { id: '7', name: 'Yoğurt' },
          { id: '8', name: 'Peynir' }
        ]
      },
      {
        id: 4,
        name: 'R2',
        type: 'Temizlik',
        products: [
          { id: '9', name: 'Yüzey Temizleyici' },
          { id: '10', name: 'Çamaşır Deterjanı' }
        ]
      },
      {
        id: 5,
        name: 'R3',
        type: 'Kırtasiye',
        products: [
          { id: '11', name: 'Defter' },
          { id: '12', name: 'Kalem' }
        ]
      }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private marketsSubject: BehaviorSubject<Market[]> = new BehaviorSubject(marketData);
  markets$: Observable<Market[]> = this.marketsSubject.asObservable();

  constructor() {}

  getMarkets(): Observable<Market[]> {
    return this.markets$;
  }

  get markets(): Market[] {
    return this.marketsSubject.getValue();
  }
  getDepartments(marketName: string): Department[] | undefined {
    const markets = this.marketsSubject.value;
    const market = markets.find(m => m.name === marketName);
    return market ? market.departments : undefined;
  }

  addDepartment(marketName: string, departmentType: string): Department | undefined {
    const markets = this.marketsSubject.value;
    const market = markets.find((m) => m.name === marketName);
    if (market) {
      const existingDepartment = market.departments.find(dep => dep.type === departmentType);
      if (existingDepartment) {
        alert('Bu markette aynı isimde bir reyon zaten mevcut.');
        return undefined;
      }

      const newDepartmentName = `R${market.departments.length + 1}`;
      const newDepartment: Department = {
        id: Math.max(...market.departments.map(dep => dep.id), 0) + 1,
        name: newDepartmentName,
        type: departmentType,
        products: [],
      };
      market.departments.push(newDepartment);
      this.marketsSubject.next(markets);
      return newDepartment;
    }
    return undefined;
  }

  addProduct(marketName: string, departmentId: number, productName: string): Product | undefined {
    const markets = this.marketsSubject.value;
    const market = markets.find(m => m.name === marketName);
    if (market) {
      const department = market.departments.find(dep => dep.id === departmentId);
      if (department) {
        const newProductId = (Math.max(...department.products.map(prod => parseInt(prod.id)), 0) + 1).toString();
        const newProduct: Product = { id: newProductId, name: productName };
        department.products.push(newProduct);
        this.marketsSubject.next(markets);
        return newProduct;
      }
    }
    return undefined;
  }

  deleteDepartment(marketName: string, departmentId: number): boolean {
    const markets = this.marketsSubject.value;
    const market = markets.find(m => m.name === marketName);
    if (market) {
      const initialLength = market.departments.length;
      market.departments = market.departments.filter(dep => dep.id !== departmentId);
      this.marketsSubject.next(markets);
      const isDeleted = initialLength > market.departments.length;
      return isDeleted;
    }
    return false;
  }
  updateProduct(marketName: string, newDepartmentId: number, productId: string, updatedName: string): boolean {
    const markets = this.marketsSubject.value;

    const currentMarket = markets.find(m => m.departments.some(dep => dep.products.some(prod => prod.id === productId)));
    if (currentMarket) {
      const currentDepartment = currentMarket.departments.find(dep => dep.products.some(prod => prod.id === productId));
      if (currentDepartment) {
        const productIndex = currentDepartment.products.findIndex(prod => prod.id === productId);
        if (productIndex !== -1) {
          const productToMove = currentDepartment.products[productIndex];
          currentDepartment.products.splice(productIndex, 1);
          const newMarket = markets.find(m => m.name === marketName);
          if (newMarket) {
            const newDepartment = newMarket.departments.find(dep => dep.id === newDepartmentId);
            if (newDepartment) {
              productToMove.name = updatedName;
              newDepartment.products.push(productToMove);
              this.marketsSubject.next(markets);
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  deleteProduct(marketName: string, departmentId: number, productId: string): boolean {
    const markets = this.marketsSubject.value;
    const market = markets.find(m => m.name === marketName);

    if (market) {
      const department = market.departments.find(dep => dep.id === departmentId);
      if (department) {
        const initialLength = department.products.length;
        department.products = department.products.filter(prod => prod.id !== productId);
        this.marketsSubject.next(markets);
        const isDeleted = initialLength > department.products.length;
        return isDeleted;
      }
    }
    return false;
  }

}
