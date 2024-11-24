import * as React from 'react';
import {isLoggedIn} from "../utils/auth";
import NotFoundErrorPage from "./NotFoundErrorPage";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";


export default function InquiriesPage() {
    const {accessToken} = useSelector((state: RootState) => state.auth);

    function renderInquiriesPage() {
        return (
          <Paper>
              <Typography variant={"h2"}>Anfragen </Typography>
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