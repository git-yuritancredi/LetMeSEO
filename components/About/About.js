import React from "react";
import {Grid, Avatar, Box, Typography, Chip} from "@material-ui/core";
import GitHubIcon from '@material-ui/icons/GitHub';
import electron from "electron";

export default class About extends React.Component
{
    openGitHubPage(){
        electron.shell.openExternal('https://github.com/git-yuritancredi');
    }

    render() {
        return (
            <Box className="content-container full-height">
                <Grid container justify="center" className="about-section full-height" alignItems="center">
                    <Grid item xs={6}>
                        <Grid className="abount-content">
                            <Avatar src="assets/images/avatar.jpg" />
                            <Typography variant="h5" align="center" color="textPrimary">Follow my open source projects</Typography>
                            <Chip
                                icon={<GitHubIcon />}
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