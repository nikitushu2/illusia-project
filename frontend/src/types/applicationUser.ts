//if you want to add or modify something in this file, please do it same in the backend/src/types/applicationUser.ts file


export enum UserRole {
    SUPER_ADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
}

export interface ApplicationUser {
    id: number;
    email: string;
    displayName: string;
    role: UserRole;
    isApproved: boolean;
    picture?: string;
}