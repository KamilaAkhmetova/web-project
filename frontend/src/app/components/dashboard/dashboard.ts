import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../services/news';
import { NewsModalComponent } from '../news-modal/news-modal';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, NewsModalComponent],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  isLoadingNews = true;
  newsList: any[] = [];
  allNewsList: any[] = [];      
  showLoadMore = false;
  selectedNews: any = null;
  showModal = false;
  
  constructor(
    private newsService: NewsService,
    private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews() {
  this.newsService.getNews().subscribe({
    next: (data: any) => {
      this.allNewsList = data;                 // 👈 сохраняем ВСЁ
      this.newsList = data.slice(0, 5);        // 👈 показываем 5

      this.showLoadMore = data.length > 5;     // 👈 показывать кнопку?

      this.isLoadingNews = false;
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.error('Ошибка:', err);
      this.isLoadingNews = false;
    }
  });
}
  loadAllNews() {
    this.newsList = this.allNewsList;      
    this.showLoadMore = false;   
    this.cdr.detectChanges();          
  }

  

  openNewsModal(news: any) {
    console.log('CLICK NEWS:', news);
    this.selectedNews = news;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedNews = null;
  }
}