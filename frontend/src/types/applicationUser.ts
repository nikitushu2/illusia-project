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