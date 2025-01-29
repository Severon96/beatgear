import * as React from 'react';
import {useContext, useEffect} from 'react';
import {isLoggedIn} from "../utils/auth";
import NotFoundErrorPage from "./NotFoundErrorPage";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch, useAppSelector} from "../store";
import {Paper, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {FloatingErrors} from "../components/FloatingErrors";
import {ErrorContext} from "../components/providers/ErrorProvider";
import {fetchInquiries} from "../redux-tk/slices/bookingSlice";
import {BookingCard} from "../components/BookingCard";
import Divider from "@mui/material/Divider";


export default function InquiriesPage() {
    const {accessToken} = useSelector((state: RootState) => state.auth);
    const errorContext = useContext(ErrorContext);
    const {inquiriesStatus, inquiries} = useAppSelector((state) => state.bookings);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (inquiriesStatus === "failed") {
            errorContext.addError({message: "Laden der Anfragen fehlgeschlagen."})
        }

        if (inquiriesStatus === undefined) {
            dispatch(fetchInquiries())
        }
    }, [dispatch, inquiriesStatus, inquiries]);

    function renderInquiriesList() {
        return inquiries.map((inquiry, index) => {
            return (
                <Stack key={inquiry.id}>
                    <BookingCard booking={inquiry}/>
                    {index !== inquiries.length - 1 && <Divider/>}
                </Stack>
            )
        });
    }

    function renderInquiriesPage() {
        const inquiryCount = inquiries ? inquiries.length : 0;
        return (
            <Paper>
                <Stack gap={4}>
                    <Typography
                        variant={"h2"}>{`Du hast aktuell ${inquiryCount} ${inquiryCount > 1 ? "Anfragen" : "Anfrage"}`}</Typography>
                    {
                        inquiries.length == 0 ? (
                            <Stack alignItems={"center"}>
                                <Typography variant={"body1"}>
                                    Keine Anfragen vorhanden.
                                </Typography>
                            </Stack>
                        ) : renderInquiriesList()
                    }
                    <FloatingErrors/>
                </Stack>
            </Paper>
        );
    }

    return isLoggedIn(accessToken) ? (
            <>
                {
                    renderInquiriesPage()
                }
            </>
        ) :
        <NotFoundErrorPage/>
        ;
}