import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleService } from '../../services/schedule';
import { ScheduleItem } from '../../models/schedule';
import { Lesson } from '../../models/lesson';

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
  currentWeek = '14th';
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
            // this.timeSlots.push(`${hour}:30`);
        }
    }
    
    setWeekDates() {
        const today = new Date();
        const monday = new Date(today);
        const day = today.getDay();
        const diff = day === 0 ? 6 : day - 1;
        monday.setDate(today.getDate() - diff);
        
        for (let i = 0; i < this.weekDays.length; i++) {
          const date = new Date(monday);
          date.setDate(monday.getDate() + i);
          this.weekDays[i].date = `${date.getDate()}.${date.getMonth() + 1}.`;
      }
    }
    
    loadSchedule() {
        this.scheduleMap.clear();
        this.scheduleService.getMySchedule().subscribe({
            next: (data) => {
                data.forEach(item => {
                    const lesson = item.lesson_details;
                    const normalizedStartTime = this.normalizeTime(lesson.start_time);
                    const key = `${lesson.day_of_week}_${normalizedStartTime}`;
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

    private normalizeTime(time: string): string {
        const parts = time.split(':');
        const hours = parts[0] ?? '0';
        const minutes = parts[1] ?? '00';
        return `${Number(hours)}:${minutes.padStart(2, '0')}`;
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


