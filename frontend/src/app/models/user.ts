export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    phone: string | null;
    practice_group: string;
    is_teacher: boolean;
}