import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course';
import { CourseRegistration } from '../../services/course-registration';
import { Course } from '../../models/course';

@Component({
    selector: 'app-course-registration',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './course-registration.html',
    styleUrls: ['./course-registration.css']
})
export class CourseRegistrationComponent implements OnInit {
    courses: Course[] = [];
    selectedCourses: { [key: number]: boolean } = {};
    isLoading = true;
    isSubmitting = false;

    constructor(
        private courseService: CourseService,
        private registrationService: CourseRegistration,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadCourses();
    }

    loadCourses() {
        this.courseService.getCourses().subscribe({
            next: (data) => {
                this.courses = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading courses:', err);
                this.isLoading = false;
            }
        });
    }

    register() {
        const selectedLessonIds = this.courses
            .filter(course => this.selectedCourses[course.id])
            .map(course => course.id);

        if (selectedLessonIds.length === 0) {
            alert('Please select at least one course');
            return;
        }

        this.isSubmitting = true;
        this.registrationService.registerForLessons(selectedLessonIds).subscribe({
            next: () => {
                alert('Successfully registered!');
                this.router.navigate(['/schedules']);
            },
            error: (err) => {
                console.error('Registration failed:', err);
                alert('Registration failed. Please try again.');
                this.isSubmitting = false;
            }
        });
    }
}