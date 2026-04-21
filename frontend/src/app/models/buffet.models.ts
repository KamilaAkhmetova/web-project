export interface Buffet {
  id: number;
  name: string;
  address: string;
  is_temporarily_closed: boolean;
  status: string;
  image_url?: string;
}

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface Food {
  id: number;
  name: string;
  description: string;
  price_student: number;
  price_employee: number;
  price_guest: number;
  category: string;
  is_available: boolean;
}

export interface BuffetDetail {
  id: number;
  name: string;
  address: string;
  status: string;
  is_temporarily_closed: boolean;
  image_url: string | null;
  hours: OpeningHour[];
  foods: Food[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
}