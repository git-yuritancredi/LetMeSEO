import {Badge, Box, Button, Divider, Grid, Typography} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import React from "react";
import electron from "electron";

export default class OgTags extends React.Component
{
    socialSet(){
        if(
            this.props.social.title &&
            this.props.social.image &&
            this.props.social.url &&
            this.props.social.description
        ){
            return true;
        }
        return false;
    }

    openUrl(url){
        electron.shell.openExternal(url);
    }

    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    { this.socialSet() ? <CheckCircleIcon color="primary" /> : <WarningIcon color="secondary" /> } Open Graph tags
                    { this.socialSet() ? <Badge badgeContent="+0.5" color="primary" /> : <Badge badgeContent="0" color="secondary" /> }
                </Typography>
                <Divider variant="fullWidth" />
                <Grid container alignItems="center">
                    <Grid xs={8} item>
                        <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                            Open Graph meta tags are snippets of code that control how URLs are displayed when shared on social media. <br />
                            They're part of Open Graph protocol and are also used by other social media sites, including LinkedIn and Twitter.
                        </Typography>
                    </Grid>
                    <Grid xs={4} className="text-right" item>
                        <Button color="primary" variant="outlined" onClick={() => { this.openUrl('https://ogp.me/') }}>More information</Button>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}