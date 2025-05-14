
import { Box, Typography, Stack, Pagination } from "@mui/material"; 
import { useEffect, useState } from "react";
import { useFetch, ApiRole } from "../hooks/useFetch";
import { AdminBookingDetail } from "./AdminBookingDetail";
import { Item } from "../services/itemService";
import { BookingWithDetails } from "../types/booking";




export const AdminBookingApproval = () => {
    const { data: bookings, get } = useFetch<BookingWithDetails[]>(ApiRole.ADMIN);
    const [page, setPage] = useState(1);
    const { data: items, get: getItems } = useFetch<Item[]>(ApiRole.PUBLIC);
    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        get("bookings");
        getItems("items");
    }, []);


    const numberOfPages = bookings ? Math.ceil(bookings.length / ITEMS_PER_PAGE) : 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedBooking = bookings ? bookings.slice(startIndex, endIndex) : [];


   
   
  return (

    <Box>
        <Typography variant="h4" textAlign={"center"} sx={{ marginBottom: 3}}>Booking Details</Typography>
        {paginatedBooking.map((booking) => (
            <AdminBookingDetail bookingDetails={booking} items={items || []} />
        ))}
        <Stack spacing={2} paddingTop={5} alignItems={'center'}>
            <Pagination count={numberOfPages} onChange={(_, value) => setPage(value)} variant="outlined" shape="rounded" />
        </Stack>
    </Box> 
  );
};

