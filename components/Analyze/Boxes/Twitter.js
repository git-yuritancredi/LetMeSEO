import React from "react";
import electron from "electron";
import {i18n} from "../../language";
import TwitterIcon from "@mui/icons-material/Twitter";
import {Box, Button, Divider, Grid, Typography} from "@mui/material";

export default class Twitter extends React.Component {
    openUrl(url) {
        electron.shell.openExternal(url);
    }

    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    <TwitterIcon/> {i18n.__("Twitter")}
                </Typography>
                <Divider variant="fullWidth"/>
                <Box className="content-tag no-wrapping">
                    <Typography variant="body2" color="primary">
                        {!this.props.social.twitter.creator ? i18n.__("In the twitter:creator tag you can place the username for the website used in the card footer.") : i18n.__("You has set twitter:creator.")}
                        <br/>
                        {!this.props.social.twitter.site ? i18n.__("In the twitter:creator tag you can place the username for the content creator / author.") : i18n.__("You has set twitter:creator tag.")}
                        <br/>
                        {!this.props.social.twitter.card ? i18n.__("In the twitter:cart tag you can specify the card type.") : i18n.__("You has set twitter:card tag.")}
                    </Typography>
                </Box>
                <Grid alignContent="center" container>
                    <Grid xs={6} item>
                        <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                            {i18n.__("This meta tags are only available with Twitter.")}
                        </Typography>
                    </Grid>
                    <Grid xs={6} className="text-right" item>
                        <Button color="primary" variant="outlined" onClick={() => {
                            this.openUrl('https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started')
                        }}>{i18n.__("More information")}</Button>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
