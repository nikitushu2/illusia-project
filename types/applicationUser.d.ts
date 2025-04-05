export interface ApplicationUser {
    email: string;
    displayName: string;
    role: string;
    isApproved: boolean;
    picture?: string;
}