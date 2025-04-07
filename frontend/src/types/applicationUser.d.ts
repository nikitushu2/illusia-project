export enum UserRole {
    SUPER_ADMIN = "super-admin",
    ADMIN = "admin",
    USER = "user",
}

export interface ApplicationUser {
    email: string;
    displayName: string;
    role: UserRole;
    isApproved: boolean;
    picture?: string;
}