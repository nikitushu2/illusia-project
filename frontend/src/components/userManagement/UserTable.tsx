import React, { useState } from 'react'
import { TableCell, TableContainer, TableHead, TableRow, Paper, TableBody, Checkbox, Table, Button, Box, useMediaQuery, Typography, Grid, Popover, Stack, Pagination } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { ApplicationUser } from '../../types/applicationUser';

interface UserRowView {
    email: React.ReactNode, 
    displayName: React.ReactNode, 
    isApproved: React.ReactNode
    delete?: React.ReactNode
}


interface UserTableProps {
    applicationUsers: ApplicationUser[];
    showDeleteButton?: boolean
    updateUserApprovalState: (email: string, isApproved: boolean) => void;
    deleteUserFromState?: (email: string) => void;
}

const BACKEND_BASE_PATH = import.meta.env.VITE_BACKEND_ORIGIN + '/api/private'

const UserTable = ({ applicationUsers, showDeleteButton, updateUserApprovalState: approveUser, deleteUserFromState: deleteUser }: UserTableProps) => {
    const [approveAnchorEl, setApproveAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [deleteAnchorEl, setDeleteAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [clickedUser, setClickedUser] = React.useState<ApplicationUser | null>(null);
    const [page, setPage] = useState(1); 
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
    const ITEMS_PER_PAGE = 8;

    const promptApproveClick = (event: React.MouseEvent<HTMLButtonElement>, user: ApplicationUser) => {
        setClickedUser(user);
        setApproveAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setApproveAnchorEl(null);
        setDeleteAnchorEl(null);
    };

    const handleApproveClick = async () => {
        try {
            const response = await fetch(`${BACKEND_BASE_PATH}/admin/users/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ 
                    email: clickedUser?.email, 
                    isApproved: !clickedUser?.isApproved, 
                    role: clickedUser?.role,
                    displayName: clickedUser?.displayName
                })
            });
            if (response.ok) {
                const updatedUser = await response.json() as ApplicationUser;
                approveUser(updatedUser.email, updatedUser.isApproved);
            }
        } catch (error) {
            // TODO: Shoow error message
            console.error('Error updating approval status:', error);
        } finally {
            handleClose();
        }
    }

    const promptDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, user: ApplicationUser) => {
        setClickedUser(user);
        setDeleteAnchorEl(event.currentTarget);
    };

    const handleDelete = async (email: string) => {
        try {
            const response = await fetch(`${BACKEND_BASE_PATH}/admin/users/`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                deleteUser!(email);
            }
        } catch (error) {
            // TODO: Shoow error message
            console.error('Error deleting user:', error);
        } finally {
            handleClose();
        }
    }

    // Pagination and sorting 

    const numberOfPages = Math.ceil(applicationUsers.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUsers = applicationUsers.slice(startIndex, endIndex);

    const users: UserRowView[] = paginatedUsers.map((user) => ({
        email: <Typography variant='body2'>{user.email}</Typography>,
        displayName: <Typography variant='body2'>{user.displayName}</Typography>,
        isApproved: (
            <>
                <Button aria-describedby={user.email} variant="contained" onClick={(event) => promptApproveClick(event, user)}>
                    {user.isApproved ? 'Remove Approval' : 'Approve'}
                </Button>
                <Popover
                    id={user.email}
                    open={clickedUser?.email === user.email && Boolean(approveAnchorEl)}
                    anchorEl={approveAnchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}
                >
                    <Box sx={{ padding: 2, textAlign: 'center' }}>
                        <Typography variant='body2' sx={{ fontWeight: '600' }}>Are you sure you want to {user.isApproved ? 'remove approval' : 'approve'}?</Typography>
                        <Typography variant='body2'>The user will be moved to other list</Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button variant="contained" onClick={() => handleApproveClick()}>
                                yes
                            </Button>
                            <Button variant="contained" onClick={handleClose}>
                                no
                            </Button>
                        </Box>
                    </Box>
                </Popover>
            </>
        ),
        delete: (
            <>
                <Button aria-describedby={user.email} variant="contained" onClick={(event) => promptDeleteClick(event, user)}>
                    Delete
                </Button>
                <Popover
                    id={user.email}
                    open={clickedUser?.email === user.email && Boolean(deleteAnchorEl)}
                    anchorEl={deleteAnchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}
                >
                    <Box sx={{ padding: 2, textAlign: 'center' }}>
                        <Typography variant='body2' sx={{ fontWeight: '600' }}>Are you sure you want to delete?</Typography>
                        <Typography variant='body2'>This delete action is irrevertible.</Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button variant="contained" onClick={() => handleDelete(user.email)}>
                                yes
                            </Button>
                            <Button variant="contained" onClick={handleClose}>
                                no
                            </Button>
                        </Box>
                    </Box>
                </Popover>
            </>
        )})
    );

    const columns = [
        { id: 'email', label: 'Email' },
        { id: 'displayName', label: 'Display Name' },
        { id: 'isApproved', label: 'Approve' }
    ]

    if(showDeleteButton) {
        columns.push({ id: 'delete', label: 'Delete User' });
    }

  return (
    <Box>
        <TableContainer component={Paper}>
            <Table aria-label="responsive table">
                <TableHead>
                <TableRow>
                    {!isMobile && columns.map((column) => (
                    <TableCell key={column.id} align='center'>
                        <Typography variant='subtitle1' sx={{ fontWeight: '600' }}>{column.label}</Typography>
                    </TableCell>
                    ))}
                </TableRow>
                </TableHead>
                <TableBody>
                {users.map((applicationUser, index) => (
                    <React.Fragment key={index}>
                    {isMobile ? (
                        <TableRow>
                            <TableCell>
                            {columns.map((column) => (
                                <Grid container rowSpacing={4} sx={{ alignItems: 'center' }} key={column.id}>
                                    <Grid size={5}>
                                        <Typography variant='subtitle2' sx={{ fontStyle: 'italic', fontWeight: '600'}}>{column.label}</Typography>
                                    </Grid>
                                    <Grid size={7}>
                                        {applicationUser[column.id as keyof UserRowView]}
                                    </Grid>
                                </Grid>
                                ))
                            }
                            </TableCell>
                        </TableRow>
                        )
                     : (
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id} align='center'>{applicationUser[column.id as keyof UserRowView]}</TableCell>
                        ))}
                        </TableRow>
                    )}
                    </React.Fragment>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Stack spacing={2} paddingTop={5} alignItems={'center'}>
            <Pagination count={numberOfPages} onChange={(_, value) => setPage(value)} variant="outlined" shape="rounded" />
        </Stack>
    </Box>
  )
}

export default UserTable