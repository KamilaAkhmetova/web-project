import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BuffetService } from '../../services/buffet.service';
import { Buffet } from '../../models/buffet.models';

@Component({
  selector: 'app-buffets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './buffets.component.html',
  styleUrls: ['./buffets.component.css']
})
export class BuffetsComponent implements OnInit {
  buffets: Buffet[] = [];
  filteredBuffets: Buffet[] = [];
  isLoading = true;
  errorMessage = '';

  // Filters
  searchName = '';
  searchAddress = '';
  statusFilter = 'all';

  constructor(private buffetService: BuffetService) {}

  ngOnInit(): void {
    this.loadBuffets();
  }

  loadBuffets(): void {
    this.isLoading = true;
    this.buffetService.getBuffets().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.buffets = response.data;
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load buffets. Please try again later.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  applyFilters(): void {
    this.filteredBuffets = this.buffets.filter(buffet => {
      // Filter by name
      if (this.searchName && !buffet.name.toLowerCase().includes(this.searchName.toLowerCase())) {
        return false;
      }
      // Filter by address
      if (this.searchAddress && !buffet.address.toLowerCase().includes(this.searchAddress.toLowerCase())) {
        return false;
      }
      // Filter by status
      if (this.statusFilter === 'open' && buffet.status !== 'Open') {
        return false;
      }
      if (this.statusFilter === 'closed' && buffet.status !== 'Closed' && buffet.status !== 'Temporarily closed') {
        return false;
      }
      return true;
    });
  }

  clearFilters(): void {
    this.searchName = '';
    this.searchAddress = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    if (status === 'Open') return 'status-open';
    if (status === 'Temporarily closed') return 'status-temp-closed';
    return 'status-closed';
  }
}