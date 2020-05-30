import {Box, Button, Divider, Grid, Typography} from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import React from "react";
import electron from "electron";

export default class Facebook extends React.Component
{
    openUrl(url){
        electron.shell.openExternal(url);
    }

    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    <FacebookIcon /> Facebook
                </Typography>
                <Divider variant="fullWidth" />
                <Box className="content-tag no-wrapping">
                    <Typography variant="body2" color="primary">
                        { !this.props.social.facebook.app_id ? "If you want to use Facebook Insights, you must add og:app_id tag." : "You can use Facebook Insights." }
                        <br/>
                        { !this.props.social.facebook.type ? "Facebook set default og:type tag to 'website', if the content of post is different, you must add this tag." : "You has set og:type tag." }
                        <br />
                        { !this.props.social.facebook.locale ? "Facebook set default og:locale tag to 'en_US', if the content of post is in different language, you must add this tag." : "You has set og:locale tag." }
                    </Typography>
                </Box>
                <Grid alignContent="center" container>
                    <Grid xs={6} item>
                        <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                            This Open Graph meta tags are only available with Facebook.
                        </Typography>
                    </Grid>
                    <Grid xs={6} className="text-right" item>
                        <Button color="primary" variant="outlined" onClick={() => { this.openUrl('https://developers.facebook.com/docs/sharing/webmasters') }}>More information</Button>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}