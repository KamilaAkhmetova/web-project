import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../services/news';

@Component({
  selector: 'app-news-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-modal.html',  
  styleUrls: ['./news-modal.css'] 
})
export class NewsModalComponent {
    @Input() news: any;
    // @Input() news: any = null;
    @Output() closed = new EventEmitter<void>();

    close() {
        this.closed.emit();
    }
}