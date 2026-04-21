export interface Lesson {
    id: number;
    course: number;
    course_name: string;
    course_code: string;
    lesson_type: string;
    lesson_type_display: string;
    lecturer: string;
    room: string;
    day_of_week: number;
    day_display: string;
    start_time: string;
    end_time: string;
}

export interface ScheduleItem {
    id: number;
    lesson: number;
    lesson_details: Lesson;
}