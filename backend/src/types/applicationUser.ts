//if you want to add or modify something in this file, please do it same in the frontend/src/types/applicationUser.ts file

export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
}

export interface ApplicationUser {
    email: string;
    displayName: string;
    role: UserRole;
    isApproved: boolean;
    picture?: string;
}