import React from "react";
import {i18n} from "../../language";
import InfoIcon from "@mui/icons-material/Info";
import {Box, Divider, Typography} from "@mui/material";

export default class Keywords extends React.Component {
    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    <InfoIcon/> {i18n.__("Keywords")}
                </Typography>
                <Divider variant="fullWidth"/>
                {
                    this.props.keywords ? <Box className="content-tag"><Typography variant="body2"
                                                                                   color="primary">{this.props.keywords}</Typography></Box> : ""
                }
                <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                    {i18n.__("At one time, the keyword tag was vastly important to SEO. Nowadays, search engines such as Google scan content for quality and search intent. This means the keyword tag is no longer needed.")}
                </Typography>
            </Box>
        );
    }
}
