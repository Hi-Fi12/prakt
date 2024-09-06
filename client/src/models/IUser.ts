export interface IUser {
    id: number;
    email: string;
    password: string; // Если требуется
    isActivated: boolean;
    activationLink?: string; // Опционально, если не всегда присутствует
    isAdmin: boolean;
    first_name?: string; // Опционально
    last_name?: string; // Опционально
    date_of_birth?: string; // Опционально, используйте string для формата 'YYYY-MM-DD'
    gender?: 'Male' | 'Female' | 'Other'; // Опционально
    phone_number?: string; // Опционально
    address?: string; // Опционально
}
