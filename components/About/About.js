import React from "react";
import electron from "electron";
import {i18n} from '../language';
import GitHubIcon from '@mui/icons-material/GitHub';
import {Grid, Avatar, Box, Typography, Chip} from "@mui/material";

export default class About extends React.Component {
    openGitHubPage() {
        electron.shell.openExternal('https://github.com/git-yuritancredi');
    }

    render() {
        return (
            <Box className="content-container full-height">
                <Grid container justifyContent="center" className="about-section full-height" alignItems="center">
                    <Grid item xs={6}>
                        <Grid className="abount-content">
                            <Avatar src="../assets/images/avatar.jpg"/>
                            <Typography variant="h5" align="center"
                                        color="textPrimary">{i18n.__("Follow my open source projects")}</Typography>
                            <Chip
                                icon={<GitHubIcon/>}
                                label="@git-yuritancredi"
                                variant="outlined"
                                color="primary"
                                onClick={this.openGitHubPage}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
