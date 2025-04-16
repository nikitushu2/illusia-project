
import { ApplicationUser, UserRole } from "../types/applicationUser";
import { User } from "../models/index";

interface UserAttributes {
    email: string;
    displayName: string;
    role: string;
    isApproved: boolean;
}

interface NewUser {
    email: string;
    displayName: string;
    role: UserRole;
}

export const findByEmail = async (email: string): Promise<ApplicationUser | null> => {
    const user =  await User.findOne({
        where: {
            email: email
        }
    }) as unknown as UserAttributes;
    if (!user) {
        return null;
    }

    return {
        email: user.email,
        displayName: user.displayName,
        role: user.role as UserRole,
        isApproved: user.isApproved,
    }
}

export const createUser = async (newUser: NewUser): Promise<ApplicationUser | null> => {
    try {
        const createdUser = await User.create({
            email: newUser.email,
            displayName: newUser.displayName,
            role: newUser.role || UserRole.USER,
            isApproved: false
        }) as unknown as ApplicationUser;
        
        return createdUser;
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
}
