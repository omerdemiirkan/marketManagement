import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketService } from '../../services/market.service';
import { FormsModule } from '@angular/forms';
import { Department } from '../../models/market.model';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DepartmentComponent {
  @Input() marketName: string = '';
  @Output() departmentAdded = new EventEmitter<Department>();
  departmentType: string = '';

  constructor(private marketService: MarketService) {}

  addDepartment(): void {
    if (this.marketName && this.departmentType) {
      const newDepartment = this.marketService.addDepartment(this.marketName, this.departmentType);
      if (newDepartment) {
        this.departmentAdded.emit(newDepartment);
        this.departmentType = '';
        this.closeModal();
      } else {
        alert('Reyon eklenemedi. Lütfen market adını kontrol edin.');
      }
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('addDepartmentModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
  getNextDepartmentName(): string {
    const departments = this.marketService.getDepartments(this.marketName);
    const nextId = departments ? departments.length + 1 : 1; // Eğer departments undefined ise 1 olarak ayarla
    return `R${nextId}`; // R1, R2, R3 şeklinde döndür
  }

}
