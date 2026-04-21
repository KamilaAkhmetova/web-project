import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleService } from '../../services/schedule';
import { ScheduleItem, Lesson } from '../../models/schedule';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedules.html',
  styleUrls: ['./schedules.css']
})
export class Schedules implements OnInit {
  
  weekDays = [
        { name: 'Mon', fullName: 'Monday', index: 1, date: '' },
        { name: 'Tue', fullName: 'Tuesday', index: 2, date: '' },
        { name: 'Wed', fullName: 'Wednesday', index: 3, date: '' },
        { name: 'Thu', fullName: 'Thursday', index: 4, date: '' },
        { name: 'Fri', fullName: 'Friday', index: 5, date: '' },
        { name: 'Sat', fullName: 'Saturday', index: 6, date: '' },
        { name: 'Sun', fullName: 'Sunday', index: 7, date: '' }
    ];

  timeSlots: string[] = [];
  
  scheduleMap: Map<string, Lesson> = new Map();
  isLoading = true;

  // не уверена
  currentWeek = '11th';
  // timeSlots = [
  //   '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', 
  //   '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  // ];
  
  // Тестовые данные расписания
  // scheduleData: any[] = [];
  
  constructor(private scheduleService: ScheduleService) {}
    
    ngOnInit() {
        this.generateTimeSlots();
        this.loadSchedule();
        this.setWeekDates();
    }
    
    generateTimeSlots() {
        for (let hour = 8; hour <= 20; hour++) {
            this.timeSlots.push(`${hour}:00`);
            this.timeSlots.push(`${hour}:30`);
        }
    }
    
    setWeekDates() {
        const today = new Date();
        const monday = new Date(today);
        const day = today.getDay();
        const diff = day === 0 ? 6 : day - 1;
        monday.setDate(today.getDate() - diff);
        
        for (let i = 0; i < 5; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            this.weekDays[i].date = `${date.getDate()}.${date.getMonth() + 1}.`;
        }
    }
    
    loadSchedule() {
        this.scheduleService.getMySchedule().subscribe({
            next: (data) => {
                data.forEach(item => {
                    const lesson = item.lesson_details;
                    const key = `${lesson.day_of_week}_${lesson.start_time}`;
                    this.scheduleMap.set(key, lesson);
                });
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Ошибка загрузки расписания:', err);
                this.isLoading = false;
            }
        });
    }
    
    getLesson(dayIndex: number, timeSlot: string): Lesson | null {
        const key = `${dayIndex}_${timeSlot}`;
        return this.scheduleMap.get(key) || null;
    }
    
    openLessonModal(lesson: Lesson | null) {
        if (lesson) {
            console.log('Lesson details:', lesson);
            // TODO: открыть модальное окно с деталями
        }
    }
}


//   ngOnInit() {
//     this.loadSchedule();
//   }
  
//   loadSchedule() {
//     // TODO: загрузить расписание из API
//     // Пока тестовые данные
//     this.scheduleData = [
//       { day: 1, time: '10:00', course: { name: 'Web Development', lesson_type: 'lecture', room: 'B/E105' } },
//       { day: 1, time: '13:00', course: { name: 'Database Systems', lesson_type: 'practice', room: 'B/N203' } },
//       { day: 2, time: '9:00', course: { name: 'Machine Learning', lesson_type: 'lecture', room: 'T12/S' } },
//       { day: 3, time: '11:00', course: { name: 'Programming Languages', lesson_type: 'lecture', room: 'B/L314' } },
//       { day: 4, time: '14:00', course: { name: 'Human Resources', lesson_type: 'seminar', room: 'Online' } },
//       { day: 5, time: '8:00', course: { name: 'Software Engineering', lesson_type: 'lab', room: 'C228' } }
//     ];
//   }
  
//   // Получить занятие по дню и времени
//   getLesson(dayIndex: number, timeSlot: string): any {
//     return this.scheduleData.find(lesson => 
//       lesson.day === dayIndex && lesson.time === timeSlot
//     );
//   }
  
//   // Открыть модальное окно с деталями занятия
//   openLessonModal(lesson: any) {
//     if (lesson) {
//       console.log('Open lesson:', lesson);
//       // TODO: открыть модальное окно
//     }
//   }
// }