import * as React from 'react';
import {useContext, useEffect} from 'react';
import {isLoggedIn} from "../utils/auth";
import NotFoundErrorPage from "./NotFoundErrorPage";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch, useAppSelector} from "../store";
import {Card, Paper, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {FloatingErrors} from "../components/FloatingErrors";
import {ErrorContext} from "../components/providers/ErrorProvider";
import {fetchInquiries} from "../redux-tk/slices/bookingSlice";


export default function InquiriesPage() {
    const {accessToken} = useSelector((state: RootState) => state.auth);
    const errorContext = useContext(ErrorContext);
    const {inquiriesStatus, inquiries} = useAppSelector((state) => state.bookings);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (inquiriesStatus === "failed") {
            errorContext.addError({message: "Laden der Anfragen fehlgeschlagen."})
        }
        console.log("test inquiry", typeof inquiriesStatus)
        if (inquiriesStatus === undefined) {
            dispatch(fetchInquiries())
        }
    }, [dispatch, inquiriesStatus, inquiries]);

    function renderInquiriesPage() {
        return (
            <Paper>
                <Stack>
                    <Typography variant={"h2"}>Anfragen </Typography>

                    {
                        inquiries.map((inquiry) => {
                            return (
                                <Card key={inquiry.id}>
                                    Test
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