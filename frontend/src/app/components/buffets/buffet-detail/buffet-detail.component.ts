import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BuffetService } from '../../../services/buffet.service';
import { BuffetDetail } from '../../../models/buffet.models';

@Component({
  selector: 'app-buffet-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buffet-detail.component.html',
  styleUrls: ['./buffet-detail.component.css']
})
export class BuffetDetailComponent implements OnInit {
  buffet: BuffetDetail | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private buffetService: BuffetService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadBuffetDetail(id);
    }
  }

  loadBuffetDetail(id: number): void {
    this.isLoading = true;
    this.buffetService.getBuffetDetail(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.buffet = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load buffet details.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }
}