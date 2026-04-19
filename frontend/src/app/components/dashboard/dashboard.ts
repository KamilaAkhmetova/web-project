import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../services/news';
import { NewsModalComponent } from '../news-modal/news-modal';

// Временно уберём интерфейс, чтобы проверить работу
// import { News } from '../../models/news.interface';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, NewsModalComponent],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  // Свойства для шаблона
  isLoadingNews = true;
  newsList: any[] = [];  // временно any, потом заменим на News[]
  selectedNews: any = null;
  showModal = false;
  
  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.newsService.getNews().subscribe({
    next: (data: any) => {  
        console.log('Данные с бэкенда:', data);  
        console.log('Первая новость:', data[0]);          
        this.newsList = data.slice(0, 5);
        this.isLoadingNews = false;
    },
    error: (err: any) => {           
        console.error('Ошибка:', err);
        this.isLoadingNews = false;
    }
});
  }

  

  openNewsModal(news: any) {
    this.selectedNews = news;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedNews = null;
  }
}