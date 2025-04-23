
import { ApplicationUser, UserRole } from "../types/applicationUser";
import { User } from "../models/index";
import { FindOptions, Attributes, Op } from "sequelize";

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

const getAplicationUsers = async (options: FindOptions<Attributes<User>>): Promise<ApplicationUser[]> => {
    try {
        const users = await User.findAll(options) as unknown as UserAttributes[];
        // Map the results to the desired format
        const mappedUsers = users.map((user) => ({
            email: user.email,
            displayName: user.displayName,
            role: user.role as UserRole,
            isApproved: user.isApproved,
        }));
        return mappedUsers; 
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Internal server error");
    }
}

export const getAllUsers = async (): Promise<ApplicationUser[]> => {
    return getAplicationUsers({
        where: {
            role: UserRole.USER,
        },
    });
}

export const getAllAdminsAndUsers = async (): Promise<ApplicationUser[]> => {
    return getAplicationUsers({
        where: {
            role: {
                [Op.ne]: UserRole.SUPER_ADMIN,
            }
        }
    });
}


export const updateUser = async (applicationUser: ApplicationUser): Promise<ApplicationUser> => {
  try {
    const userData = {
        role: applicationUser.role,
        isApproved: applicationUser.isApproved,
        displayName: applicationUser.displayName,
    };
    const [_rowsUpdated, updatedRows] = await User.update(userData, {
        where: {
            email: applicationUser.email
        },
        returning: true
    });
        return {
            email: updatedRows[0].email,
            displayName: updatedRows[0].displayName,
            role: updatedRows[0].role as UserRole,
            isApproved: updatedRows[0].isApproved,
        };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error("Internal server error");
  }
}

export const deleteUser = async (email: string): Promise<void> => {
    try {
        const deletedUser = await User.destroy({
            where: {
                email: email
            }
        });
        if (deletedUser === 0) {
            throw new Error("User not found with this email");
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error("Internal server error");
    }
}


