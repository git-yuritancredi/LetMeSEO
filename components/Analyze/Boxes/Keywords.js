import {Box, Divider, Typography} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import React from "react";

export default class Keywords extends React.Component
{
    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    <InfoIcon /> Keywords
                </Typography>
                <Divider variant="fullWidth" />
                {
                    this.props.keywords ? <Box className="content-tag"><Typography variant="body2" color="primary">{this.props.keywords}</Typography></Box> : ""
                }
                <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                    At one time, the keyword tag was vastly important to SEO. Nowadays, search engines such as Google scan content for quality and search intent. This means the keyword tag is no longer needed.
                </Typography>
            </Box>
        );
    }
}