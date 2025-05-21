import { useEffect, useState } from "react";
import { useFetch, ApiRole } from "../hooks/useFetch";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, CircularProgress, Grid, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { BookingStatus, BookingWithDetails } from "../types/booking";
import { Item } from "../services/itemService";
import { useTranslation } from "react-i18next";


interface BookingDetailProps {
    bookingDetails: BookingWithDetails;
    items: Item[];
}

interface BookingItem {
    itemName: string;
    itemImage: string;
    bookedQuantity: number;
    startDate: Date;
    endDate: Date;
}

interface Status {
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning";
}

const StatusMessage = ({ status, handleClose }: { status: Status, handleClose: () => void }) => {
    return (
        <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={status.open} autoHideDuration={3000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={status.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {status.message}
            </Alert>
        </Snackbar>
    );
}

export const AdminBookingDetail = ({ bookingDetails, items }: BookingDetailProps) => {
    const { t } = useTranslation();
    const [booking, setBooking] = useState<BookingWithDetails>(bookingDetails);
    const [status, setStatus] = useState<Status>({
        open: false,
        message: "",
        severity: "success",
    })
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

    const {ok: approved, patch: approveBooking, apiError: bookingApprovalError, loading: bookingApprovalLoading} = useFetch(ApiRole.ADMIN);
    const {ok: rejected, patch: rejectBooking, apiError: bookingRejectionError, loading: bookingRejectionLoading} = useFetch(ApiRole.ADMIN);
    

    const bookingItems: BookingItem[] = booking.items.map((bookingItem) => {
        console.log("Booking user", booking);
        console.log("Items", items);
        const item = items.find((i) => i.id === bookingItem.itemId);
        return {
            itemName: item?.name || "",
            itemImage: item?.imageUrl || "",
            bookedQuantity: bookingItem?.quantity || 0,
            startDate: booking.startDate,
            endDate: booking.endDate,
        };
    });

    useEffect(() => {
        if (approved) {
            setBooking((prevBooking) => ({
                ...prevBooking,
                status: BookingStatus.RESERVED,
            }));
            setStatus({
                open: true,
                message: "Booking approved successfully",
                severity: "success",
            });
        } else if (bookingApprovalError) {
            setStatus({
                open: true,
                message: "Failed to approve booking",
                severity: "error",
            });
        };
    }, [approved, bookingApprovalError]);

    const handleApprove = async () => {
        await approveBooking(`bookings/approve/${booking.id}`, null);
    };

    useEffect(() => {
        if (rejected) {
            setBooking((prevBooking) => ({
                ...prevBooking,
                status: BookingStatus.CANCELLED,
            }));
            setStatus({
                open: true,
                message: "Booking rejected successfully",
                severity: "warning",
            });
        } else if (bookingRejectionError) {
            setStatus({
                open: true,
                message: "Failed to reject booking",
                severity: "error",
            });
        }
    }, [rejected, bookingRejectionError]);

    const handleReject = async () => {
        await rejectBooking(`bookings/reject/${booking.id}`, null)
    };

    const closeStatus = () => {
        setStatus({ ...status, open: false });
    }

    const getTotalBookingQuantity = (booking: BookingWithDetails) => {
        return booking.items.reduce((total, item) => total + item.quantity, 0);
    }
   
    const disableButton = [BookingStatus.RESERVED, BookingStatus.CANCELLED].includes(booking.status);
    
    return (
        <Accordion sx={{ mb: 2, border: 1, borderColor: theme.palette.primary.main }} key={booking.id}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    {isMobile ? (
                        <Box width="100%">
                            <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
                                <Typography variant="subtitle2"><b>
                                    {t("adminBookingDetail.user")}
                                    </b> {booking.user.displayName}</Typography>
                                <Typography variant="subtitle2"><b>
                                    {t("adminBookingDetail.totalQuantity")}
                                    </b> {getTotalBookingQuantity(booking)}</Typography>
                                <Typography variant="subtitle2"><b>
                                    {t("adminBookingDetail.status")}
                                    </b> {booking.status}</Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Grid container width={"100%"}>
                            <Grid size={4}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography variant="subtitle2"><b>
                                        {t("adminBookingDetail.user")}
                                        </b></Typography>
                                    <Typography variant="body2">{booking.user.displayName}</Typography>
                                </Box>
                            </Grid>
                            <Grid size={4}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography variant="subtitle2"><b>
                                        {t("adminBookingDetail.totalQuantity")}
                                        </b></Typography>
                                    <Typography variant="body2">{getTotalBookingQuantity(booking)}</Typography>
                                </Box>
                            </Grid>
                            <Grid size={4}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography variant="subtitle2"><b>
                                    {t("adminBookingDetail.status")}
                                        </b></Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            backgroundColor:
                                                booking.status === BookingStatus.RESERVED
                                                    ? "success.main"
                                                    : booking.status === BookingStatus.PENDING_APPROVAL
                                                    ? "warning.main"
                                                    : "transparent",
                                            color:
                                                booking.status === BookingStatus.RESERVED || booking.status === BookingStatus.PENDING_APPROVAL
                                                    ? "common.white"
                                                    : "inherit",
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            display: "inline-block",
                                            minWidth: 80,
                                            textAlign: "center",
                                        }}
                                    >
                                        {booking.status}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                    {isMobile ? (
            // Mobile: Stacked layout using Box and Typography
            <Box>
                {bookingItems.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            mb: 2,
                            p: 2,
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            backgroundColor: 'background.default',
                        }}
                    >
                        <Typography variant="subtitle2"><b>
                            {t("adminBookingDetail.itemName")}                           
                            </b> {item.itemName}</Typography>
                        <Typography variant="subtitle2"><b>
                            {t("adminBookingDetail.itemImage")}
                            </b>
                            <Box sx={{ my: 1 }}>
                                <img src={item.itemImage} alt={item.itemName} style={{ width: "50px", height: "50px" }} />
                            </Box>
                        </Typography>
                       
                        <Typography variant="body2"><b>
                            {t("adminBookingDetail.bookedQuantity")}
                            </b> {item.bookedQuantity}</Typography>
                        <Typography variant="body2"><b>
                            {t("adminBookingDetail.startDate")}
                            </b> {item.startDate ? new Date(item.startDate).toLocaleDateString() : ""}</Typography>
                        <Typography variant="body2"><b>
                            {t("adminBookingDetail.endDate")}
                            </b> {item.endDate ? new Date(item.endDate).toLocaleDateString() : ""}</Typography>
                    </Box>
                ))}
            </Box>
        ) : (
            // Desktop: Table layout
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>{t("adminBookingDetail.itemName")}</b></TableCell>
                            <TableCell><b>{t("adminBookingDetail.itemImage")}</b></TableCell>
                            <TableCell><b>{t("adminBookingDetail.bookedQuantity")}</b></TableCell>
                            <TableCell><b>{t("adminBookingDetail.startDate")}</b></TableCell>
                            <TableCell><b>{t("adminBookingDetail.endDate")}</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookingItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell>
                                    <img src={item.itemImage} alt={item.itemName} style={{ width: "60px", height: "40px" }} />
                                </TableCell>
                                <TableCell>{item.bookedQuantity}</TableCell>
                                <TableCell>{item.startDate ? new Date(item.startDate).toLocaleDateString() : ""}</TableCell>
                                <TableCell>{item.endDate ? new Date(item.endDate).toLocaleDateString() : ""}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )}
                        <Box display="flex" gap={2} marginTop={3} paddingX={2} justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleApprove()}
                                disabled={disableButton}
                            >
                                {bookingApprovalLoading ? <CircularProgress /> : t("adminBookingDetail.approveButton")}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleReject()}
                                disabled={disableButton}
                            >
                                {bookingRejectionLoading ? <CircularProgress /> : t("adminBookingDetail.rejectButton")}
                            </Button>
                        </Box>
                        <StatusMessage status={status} handleClose={closeStatus} />
                    </Box>
                </AccordionDetails>
            </Accordion>
    );
};