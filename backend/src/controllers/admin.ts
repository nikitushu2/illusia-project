import { Router, Response } from "express";
import { RequestWithSession } from "..//types/requestWithSession";
import { deleteUser, findByEmail, getAllAdminsAndUsers, getAllUsers, updateUser } from "../services/userService";
import { ApplicationUser, UserRole } from "../types/applicationUser";

const admin = Router();

// Admin specific endpoints go here
admin.get("/users", async (request: RequestWithSession, response: Response) => {
    try {
        const role = request.applicationUser?.role;
        let users: ApplicationUser[];
        if (role === UserRole.SUPER_ADMIN) {
            users = await getAllAdminsAndUsers();
        } else {
            users = await getAllUsers();
        }
        if (!users || users.length === 0) {
            response.status(404).json({ message: "No users found" });
            return;
        }
        response.status(200).json(users);
        return;
        
    } catch (error) {
        console.error("Error fetching users:", error);
        response.status(500).json({ message: "Internal server error" });
    }
});

admin.put("/users", async (request: RequestWithSession, response: Response) => {
    try {
        const callerRole = request.applicationUser?.role;
        const { email, role, isApproved, displayName } = request.body;
        
        if (!email || !role || !displayName || isApproved === undefined) {
            response.status(400).json({ message: "Mandatory fields not provided" });
            return;
        }

        const applicationUser = await findByEmail(email);
        if (!applicationUser) {
            response.status(404).json({ message: "User not found" });
            return;
        }
        if ( callerRole === UserRole.ADMIN && [UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(applicationUser.role)) {
            response.status(400).json({ message: "Bad request" });
            return;
        }
        applicationUser.isApproved = isApproved;
        applicationUser.role = role;
        applicationUser.displayName = displayName;
        // Update the user in the database

        const updatedUser = await updateUser(applicationUser);
        response.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        response.status(500).json({ message: "Internal server error" });
    }
});

admin.delete("/users", async (request: RequestWithSession, response: Response) => {
    try {
        const callerRole = request.applicationUser?.role;
        const { email } = request.body;
        if (!email) {
            response.status(400).json({ message: "Email is required" });
            return;
        }
        const applicationUser = await findByEmail(email);
        if (!applicationUser) {
            response.status(404).json({ message: "User not found" });
            return;
        }
        if (callerRole === UserRole.ADMIN && [UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(applicationUser.role)) {
            response.status(400).json({ message: "Bad request" });
            return;
        }
        await deleteUser(email);
        response.status(204).end();
    } catch (error) {
        console.error("Error deleting user:", error);
        response.status(500).json({ message: "Internal server error" });
    }
});


export { admin };