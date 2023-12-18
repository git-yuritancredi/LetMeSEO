import React from "react";
import {i18n} from "../../language";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import {Box, Divider, Typography} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default class Robots extends React.Component {
    robotsIcon() {
        if (
            (!this.props.robots) ||
            (this.props.robots.indexOf('index') !== -1 &&
                this.props.robots.indexOf('follow') !== -1) ||
            (this.props.robots.indexOf('noindex') === -1 &&
                this.props.robots.indexOf('nofollow') === -1) ||
            (this.props.robots.indexOf('all') !== -1) ||
            (this.props.robots.indexOf('none') === -1)
        ) {
            return <CheckCircleIcon color="primary"/>;
        }
        if (
            (this.props.robots.indexOf('noindex') !== -1 &&
                this.props.robots.indexOf('follow') !== -1) ||
            (this.props.robots.indexOf('index') !== -1 &&
                this.props.robots.indexOf('nofollow') !== -1)
        ) {
            return <WarningIcon color="secondary"/>;
        }
        return <ErrorIcon color="error"/>;
    }

    getRobotsText() {
        if (
            (!this.props.robots) ||
            (this.props.robots.indexOf('index') !== -1 &&
                this.props.robots.indexOf('follow') !== -1) ||
            (this.props.robots.indexOf('noindex') === -1 &&
                this.props.robots.indexOf('nofollow') === -1) ||
            (this.props.robots.indexOf('all') !== -1) ||
            (this.props.robots.indexOf('none') === -1)
        ) {
            return i18n.__("The robots tag is a useful element if you want to prevent certain articles from being indexed. These can stop crawlers from sites such as Google from accessing the content.");
        }
        if (this.props.robots.indexOf('noindex') !== -1 &&
            this.props.robots.indexOf('follow') !== -1
        ) {
            return i18n.__("If you set robots meta like this, crawlers such as Google not index this page.");
        }
        if ((this.props.robots.indexOf('index') !== -1 &&
            this.props.robots.indexOf('nofollow') !== -1)
        ) {
            return i18n.__("If you set robots meta like this, crawlers such as Google not follow links in this page.");
        }
        return i18n.__("If you set robots meta like this, crawlers such as Google not index this page and not follow links in this page.");
    }

    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    {this.robotsIcon()} {i18n.__("Robots")}
                </Typography>
                <Divider variant="fullWidth"/>
                {
                    this.props.robots ? <Box className="content-tag">
                        <Typography
                            variant="body2"
                            color="primary">{this.props.robots}</Typography>
                    </Box> : ""
                }
                <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                    {this.getRobotsText()}
                </Typography>
            </Box>
        );
    }
}
