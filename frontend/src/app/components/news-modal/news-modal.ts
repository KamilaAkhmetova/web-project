import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../services/news';

@Component({
  selector: 'app-news-modal',
  standalone: true,
  imports: [CommonModule],
  template: `./news-modal.html`,
  styles: [`./news-modal.css`]
})
export class NewsModalComponent {
    @Input() news: any = null;
    @Output() closed = new EventEmitter<void>();

    close() {
        this.closed.emit();
    }
}