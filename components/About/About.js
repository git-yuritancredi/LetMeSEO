import React from "react";
import {Grid, Avatar, Box} from "@material-ui/core";

export default class About extends React.Component
{
    render() {
        return (
            <Box className="content-container full-height">
                <Grid container justify="center" className="about-section full-height" alignItems="center">
                    <Grid item xs={6}>
                        <Grid>
                            <Avatar />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}