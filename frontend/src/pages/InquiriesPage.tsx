import * as React from 'react';
import {useContext, useEffect} from 'react';
import {isLoggedIn} from "../utils/auth";
import NotFoundErrorPage from "./NotFoundErrorPage";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch, useAppSelector} from "../store";
import {Card, CardContent, Paper, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {FloatingErrors} from "../components/FloatingErrors";
import {ErrorContext} from "../components/providers/ErrorProvider";
import {fetchInquiries} from "../redux-tk/slices/bookingSlice";
import {formatDateTime} from "../utils/generalUtils";


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

    function renderInquiriesPage() {
        return (
            <Paper>
                <Stack gap={2}>
                    <Typography variant={"h2"}>Anfragen</Typography>

                    {
                        inquiries.map((inquiry) => {
                            return (
                                <Card key={inquiry.id}>
                                    <CardContent>
                                        <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14}}>
                                            {`${formatDateTime(inquiry.booking_start)} - ${formatDateTime(inquiry.booking_end)}`}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )
                        })
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
    ) : <NotFoundErrorPage/>;
}