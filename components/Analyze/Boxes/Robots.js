import {Box, Divider, Typography} from "@material-ui/core";
import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Error";

export default class Robots extends React.Component
{
    robotsIcon(){
        if(
            (!this.props.robots) ||
            (this.props.robots.indexOf('index') !== -1 &&
                this.props.robots.indexOf('follow') !== -1) ||
            (this.props.robots.indexOf('noindex') === -1 &&
                this.props.robots.indexOf('nofollow') === -1) ||
            (this.props.robots.indexOf('all') !== -1) ||
            (this.props.robots.indexOf('none') === -1)
        ){
            return <CheckCircleIcon color="primary" />;
        }
        if(
            (this.props.robots.indexOf('noindex') !== -1 &&
                this.props.robots.indexOf('follow') !== -1) ||
            (this.props.robots.indexOf('index') !== -1 &&
                this.props.robots.indexOf('nofollow') !== -1)
        ){
            return <WarningIcon color="secondary" />;
        }
        return <ErrorIcon color="error" />;
    }

    getRobotsText(){
        if(
            (!this.props.robots) ||
            (this.props.robots.indexOf('index') !== -1 &&
                this.props.robots.indexOf('follow') !== -1) ||
            (this.props.robots.indexOf('noindex') === -1 &&
                this.props.robots.indexOf('nofollow') === -1) ||
            (this.props.robots.indexOf('all') !== -1) ||
            (this.props.robots.indexOf('none') === -1)
        ){
            return "The robots tag is a useful element if you want to prevent certain articles from being indexed. These can stop crawlers from sites such as Google from accessing the content.";
        }
        if(this.props.robots.indexOf('noindex') !== -1 &&
            this.props.robots.indexOf('follow') !== -1
        ){
            return "If you set robots meta like this, crawlers such as Google not index this page.";
        }
        if((this.props.robots.indexOf('index') !== -1 &&
            this.props.robots.indexOf('nofollow') !== -1)
        ){
            return "If you set robots meta like this, crawlers such as Google not follow links in this page.";
        }
        return "If you set robots meta like this, crawlers such as Google not index this page and not follow links in this page.";
    }

    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    {this.robotsIcon()} Robots
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