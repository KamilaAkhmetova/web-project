import { Lesson } from './lesson';

export interface ScheduleItem {
    id: number;
    lesson: number;
    lesson_details: Lesson;
}