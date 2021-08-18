import {Badge, Box, Divider, Typography} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";
import {i18n} from '../../language';

export default class Canonical extends React.Component
{

    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    {
                        this.props.canonical ? <CheckCircleIcon color="primary" /> : <ErrorIcon color="error" />
                    } {i18n.__("Canonical")}
                    {
                        this.props.canonical ? <Badge badgeContent="+1" color="primary" /> : <Badge badgeContent="-1" color="error" />
                    }
                </Typography>
                <Divider variant="fullWidth" />
                {
                    this.props.canonical ? <Box className="content-tag"><Typography variant="body2" color="primary">{this.props.canonical}</Typography></Box> : ""
                }
                <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                    {i18n.__("When you create a website, it may be accessible in a variety of ways. Canonical tags are quite useful in terms of rankings.")} <br />
                    {i18n.__("These essentially tell search engines such as Google what domains are the most important to you.")}
                </Typography>
            </Box>
        );
    }
}
