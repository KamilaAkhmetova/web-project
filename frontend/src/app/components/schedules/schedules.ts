import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedules.html',
  styleUrls: ['./schedules.css']
})
export class Schedules implements OnInit {
  // Свойства для шаблона
  currentWeek = '11th';
  semesterType = 'odd';
  
  // Дни недели
  weekDays = [
    { name: 'Monday', date: '20.4.', index: 1, fullName: 'Monday' },
    { name: 'Tuesday', date: '21.4.', index: 2, fullName: 'Tuesday' },
    { name: 'Wednesday', date: '22.4.', index: 3, fullName: 'Wednesday' },
    { name: 'Thursday', date: '23.4.', index: 4, fullName: 'Thursday' },
    { name: 'Friday', date: '24.4.', index: 5, fullName: 'Friday' }
  ];
  
  // Временные слоты
  timeSlots = [
    '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];
  
  // Тестовые данные расписания
  scheduleData: any[] = [];
  
  ngOnInit() {
    this.loadSchedule();
  }
  
  loadSchedule() {
    // TODO: загрузить расписание из API
    // Пока тестовые данные
    this.scheduleData = [
      { day: 1, time: '10:00', course: { name: 'Web Development', lesson_type: 'lecture', room: 'B/E105' } },
      { day: 1, time: '13:00', course: { name: 'Database Systems', lesson_type: 'practice', room: 'B/N203' } },
      { day: 2, time: '9:00', course: { name: 'Machine Learning', lesson_type: 'lecture', room: 'T12/S' } },
      { day: 3, time: '11:00', course: { name: 'Programming Languages', lesson_type: 'lecture', room: 'B/L314' } },
      { day: 4, time: '14:00', course: { name: 'Human Resources', lesson_type: 'seminar', room: 'Online' } },
      { day: 5, time: '8:00', course: { name: 'Software Engineering', lesson_type: 'lab', room: 'C228' } }
    ];
  }
  
  // Получить занятие по дню и времени
  getLesson(dayIndex: number, timeSlot: string): any {
    return this.scheduleData.find(lesson => 
      lesson.day === dayIndex && lesson.time === timeSlot
    );
  }
  
  // Открыть модальное окно с деталями занятия
  openLessonModal(lesson: any) {
    if (lesson) {
      console.log('Open lesson:', lesson);
      // TODO: открыть модальное окно
    }
  }
}