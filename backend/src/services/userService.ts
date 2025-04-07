
import { ApplicationUser, UserRole } from "../types/applicationUser";
import { User } from "../models/index";

interface UserAttributes {
    email: string;
    displayName: string;
    role: string;
    isApproved: boolean;
}

const toUserRole = (role: string): UserRole => {
    const userRoleMap: Record<string, UserRole> = {
        "super-admin": UserRole.SUPER_ADMIN,
        "admin": UserRole.ADMIN,
        "user": UserRole.USER,
    };
    return userRoleMap[role] || UserRole.USER;
}

export const findByEmail = async (email: string): Promise<ApplicationUser | null> => {
    const user =  await User.findOne({
        where: {
            email: email
        }
    }) as unknown as UserAttributes;

    return {
        email: user.email,
        displayName: user.displayName,
        role: toUserRole(user.role),
        isApproved: user.isApproved,
    }
}
