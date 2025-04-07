
import { ApplicationUser, UserRole } from "../types/applicationUser";
import { User } from "../models/index";

interface UserAttributes {
    email: string;
    displayName: string;
    role: string;
    isApproved: boolean;
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
        role: user.role as UserRole,
        isApproved: user.isApproved,
    }
}
