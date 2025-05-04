import { useEffect, useState } from "react";
import { ApplicationUser } from "../../types/applicationUser";
import { Box, Tabs, Tab, Badge, Typography } from "@mui/material";
import UserTable from "./UserTable";
import { useAuth } from "../../context/AuthContext";
import { ApiRole, useFetch } from "../../hooks/useFetch";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
const CustomTabPanel = (props: TabPanelProps) =>{
    const { children, value, index } = props;
  
    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && <Box>{children}</Box>}
      </Box>
    );
  }

export const UserManagement = () => {

    const { data: applicationUser, apiError, get } = useFetch<ApplicationUser[]>(ApiRole.ADMIN);

    const [users, setUsers] = useState<ApplicationUser[]>([]);
    const [tabValue, setTabValue] = useState(0);
    const { isSuperAdmin } = useAuth();

    const handleTabChange = (newValue: number) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        get("/users");
    } , []);

    useEffect(() => {
        if (applicationUser) {
            setUsers(applicationUser);
        } else if (apiError) {
            console.error("Error fetching users:", apiError);
        }
    }, [applicationUser]);
       

    const updateUserApprovalState = (email: string, isApproved: boolean) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.email === email ? { ...user, isApproved: isApproved } : user
            )
        );
    }

    const deleteUserFromState = (email: string) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
    }

    const needApprovalUsers = users.filter((user) => !user.isApproved && user.role === "USER");
    const adminUsers = users.filter((user) => user.role === "ADMIN");
    const approvedUsers = users.filter((user) => user.isApproved && user.role === "USER");

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", textAlign: "center" }}>
        <h2>User Management</h2>
        <p>Manage user roles and approval status.</p>
        <Box sx={{ mt: 3 }}>  
            <Tabs
                value={tabValue}
                onChange={(_, value) => handleTabChange(value)}
                indicatorColor="primary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
            >
                {isSuperAdmin && <Tab 
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Badge color="primary" badgeContent={adminUsers.length}/>
                            <Typography variant="body2" sx={{ ml: 2 }}>Admin Management</Typography>
                        </Box>
                    } 
                    id="admin-need-approval-list" 
                    aria-controls="fill-admin-width-need-approval-list"
                />}
                <Tab 
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Badge color="primary" badgeContent={needApprovalUsers.length}/>
                            <Typography variant="body2" sx={{ ml: 2 }}>User Needs Approval</Typography>
                        </Box>  
                    }  
                    id="user-need-approval-list" 
                    aria-controls="fill-width-user-need-approval-list"
                />
                <Tab 
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Badge color="primary" badgeContent={approvedUsers.length}/>
                            <Typography variant="body2" sx={{ ml: 2 }}>Approved Users</Typography>
                        </Box>
                    } 
                    id="approved-users-list" 
                    aria-controls="fill-width-approved-users-list"
                />
            </Tabs>
            {isSuperAdmin && <CustomTabPanel value={tabValue} index={0}>
                <UserTable applicationUsers={adminUsers} updateUserApprovalState={updateUserApprovalState} showDeleteButton={true} deleteUserFromState={deleteUserFromState} /> 
            </CustomTabPanel>}
            <CustomTabPanel value={tabValue} index={isSuperAdmin ? 1 : 0}>
                <UserTable applicationUsers={needApprovalUsers} updateUserApprovalState={updateUserApprovalState} /> 
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={isSuperAdmin ? 2 : 1}>
                <UserTable applicationUsers={approvedUsers} showDeleteButton={true} updateUserApprovalState={updateUserApprovalState} deleteUserFromState={deleteUserFromState} /> 
            </CustomTabPanel>
        </Box>  
    </Box>
  );
};