import React from "react";
import electron from "electron";
import { Typography, Divider, Box, Badge, Button, Grid } from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';

export default class Analysis extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    validTitle(){
        if(!this.state.data.meta.title){
            return 0;
        }
        if(this.state.data.meta.title.length > 60){
            return 1;
        }
        return 2;
    }

    validDescription(){
        if(!this.state.data.meta.description){
            return 0;
        }
        if(this.state.data.meta.description.length < 120){
            return 1;
        }
        if(this.state.data.meta.description.length > 158) {
            return 2;
        }
        return 3;
    }

    robotsIcon(){
        if(
            (!this.state.data.robots) ||
            (this.state.data.robots.indexOf('index') !== -1 &&
                this.state.data.robots.indexOf('follow') !== -1) ||
            (this.state.data.robots.indexOf('noindex') === -1 &&
                this.state.data.robots.indexOf('nofollow') === -1) ||
            (this.state.data.robots.indexOf('all') !== -1) ||
            (this.state.data.robots.indexOf('none') === -1)
        ){
            return <CheckCircleIcon color="primary" />;
        }
        if(
            (this.state.data.robots.indexOf('noindex') !== -1 &&
            this.state.data.robots.indexOf('follow') !== -1) ||
            (this.state.data.robots.indexOf('index') !== -1 &&
            this.state.data.robots.indexOf('nofollow') !== -1)
        ){
            return <WarningIcon color="secondary" />;
        }
        return <ErrorIcon color="error" />;
    }

    getRobotsText(){
        if(
            (!this.state.data.robots) ||
            (this.state.data.robots.indexOf('index') !== -1 &&
                this.state.data.robots.indexOf('follow') !== -1) ||
            (this.state.data.robots.indexOf('noindex') === -1 &&
                this.state.data.robots.indexOf('nofollow') === -1) ||
            (this.state.data.robots.indexOf('all') !== -1) ||
            (this.state.data.robots.indexOf('none') === -1)
        ){
            return "The robots tag is a useful element if you want to prevent certain articles from being indexed. These can stop crawlers from sites such as Google from accessing the content.";
        }
        if(this.state.data.robots.indexOf('noindex') !== -1 &&
           this.state.data.robots.indexOf('follow') !== -1
        ){
           return "If you set robots meta like this, crawlers such as Google not index this page.";
        }
        if((this.state.data.robots.indexOf('index') !== -1 &&
            this.state.data.robots.indexOf('nofollow') !== -1)
        ){
            return "If you set robots meta like this, crawlers such as Google not follow links in this page.";
        }
        return "If you set robots meta like this, crawlers such as Google not index this page and not follow links in this page.";
    }

    validViewport(){
        if(this.state.data.mobile) {
            if (this.state.data.mobile.indexOf('width=device-width') !== -1 && this.state.data.mobile.indexOf('initial-scale=1') !== -1) {
                return true;
            }
        }
        return false;
    }

    headerTagIcon(){
        if(this.state.data.titles.h1 > 1 || this.state.data.titles.h1 === 0){
            return <ErrorIcon color="error" />;
        }
        if((this.state.data.titles.h2 > this.state.data.titles.h3) && this.state.data.titles.h3 > 0){
            return <WarningIcon color="secondary" />;
        }
        if((this.state.data.titles.h3 > this.state.data.titles.h4) && this.state.data.titles.h4 > 0){
            return <WarningIcon color="secondary" />;
        }
        return <CheckCircleIcon color="primary" />;
    }

    headerAdditionalText(){
        if(this.state.data.titles.h1 === 0){
            return "In this case your site hasn't H1 tag and this is not correct for search engines.";
        }
        if(this.state.data.titles.h1 > 1){
            return "In this case your site has more than one H1 tag and this is not correct for search engines.";
        }
        if((this.state.data.titles.h2 > this.state.data.titles.h3) && this.state.data.titles.h3 > 0){
            return "In this case your site can reduce the content importance moving some H2 to H3 tags that has minor importance than H2 tag.";
        }
        if((this.state.data.titles.h3 > this.state.data.titles.h4) && this.state.data.titles.h4 > 0){
            return "In this case your site can reduce the content importance moving some H3 to H4 tags that has minor importance than H3 tag.";
        }
        return "";
    }

    headerTagStatus(){
        if(this.state.data.titles.h1 > 1 || this.state.data.titles.h1 === 0){
            return 0;
        }
        if(
            ((this.state.data.titles.h2 > this.state.data.titles.h3) && this.state.data.titles.h3 > 0) ||
            ((this.state.data.titles.h3 > this.state.data.titles.h4) && this.state.data.titles.h4 > 0)
        ){
            return 1;
        }
        return 2;
    }

    imageAsString(){
        return this.state.data.imageNoAlt.map((image) => {
           return <>{image} <br /></>;
        });
    }

    socialSet(){
        if(
            this.state.data.social.title &&
            this.state.data.social.image &&
            this.state.data.social.url &&
            this.state.data.social.description
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
            <Box className="analysis-conainer-inner">
                <Box className="tag-analysis-container">
                    <Typography variant="h5" color="textPrimary" className="title-tag">
                        { this.robotsIcon() } Robots
                    </Typography>
                    <Divider variant="fullWidth" />
                    {
                        this.state.data.robots ? <Box className="content-tag"><Typography variant="body2" color="primary">{this.state.data.robots}</Typography></Box> : ""
                    }
                    <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                        { this.getRobotsText() }
                    </Typography>
                </Box>

                <Box className="tag-analysis-container">
                    <Typography variant="h5" color="textPrimary" className="title-tag">
                        {
                            this.state.data.canonical ? <CheckCircleIcon color="primary" /> : <ErrorIcon color="error" />
                        } Canonical
                        {
                            this.state.data.canonical ? <Badge badgeContent="+1" color="primary" /> : <Badge badgeContent="-1" color="error" />
                        }
                    </Typography>
                    <Divider variant="fullWidth" />
                    {
                        this.state.data.canonical ? <Box className="content-tag"><Typography variant="body2" color="primary">{this.state.data.canonical}</Typography></Box> : ""
                    }
                    <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                        When you create a website, it may be accessible in a variety of ways. Canonical tags are quite useful in terms of rankings. <br /> These essentially tell search engines such as Google what domains are the most important to you.
                    </Typography>
                </Box>

                <Box className="tag-analysis-container">
                    <Typography variant="h5" color="textPrimary" className="title-tag">
                        {
                            this.validViewport() ? <CheckCircleIcon color="primary" /> : <ErrorIcon color="error" />
                        } Viewport
                        {
                            this.validViewport() ? <Badge badgeContent="+0.5" color="primary" /> : <Badge badgeContent="0" color="secondary" />
                        }
                    </Typography>
                    <Divider variant="fullWidth" />
                    {
                        this.state.data.mobile ? <Box className="content-tag"><Typography variant="body2" color="primary">{this.state.data.mobile}</Typography></Box> : ""
                    }
                    <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                        About 48% of people will use a mobile search to find information about a product or business. This means you need to focus attention on responsive and mobile designs.<br />
                        To inform search engines you have a responsive design available, you must use the meta viewport tag.
                    </Typography>
                </Box>

                <Box className="tag-analysis-container">
                    <Typography variant="h5" color="textPrimary" className="title-tag">
                        {
                            this.validTitle() === 2 ?
                                <CheckCircleIcon color="primary" /> :
                                (
                                    this.validTitle() === 1 ?
                                        <WarningIcon color="secondary" /> :
                                        <ErrorIcon color="disabled" />
                                )
                        } Title
                        {
                            this.validTitle() === 2 ?
                                <Badge badgeContent="+1" color="primary" /> :
                                (
                                    this.validTitle() === 1 ?
                                        <Badge badgeContent="0" color="secondary" /> :
                                        <Badge badgeContent="-1" color="error" />
                                )
                        }
                    </Typography>
                    <Divider variant="fullWidth" />
                    {
                        this.state.data.meta.title ? <Box className="content-tag"><Typography variant="body2" color="primary">{this.state.data.meta.title}</Typography></Box> : ""
                    }
                    <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                        {
                            this.validTitle() === 2 ? "The meta title tag is correct." : (
                                this.validTitle() === 1 ?
                                "The meta title tag is greater than 60 characters, some search engines such as Google show only 55/60 characters." :
                                "The meta title tag was not found, is very important to implement it in your site because it is how searches see your page in search engines such as Google."
                            )
                        }
                    </Typography>
                </Box>

                <Box className="tag-analysis-container">
                    <Typography variant="h5" color="textPrimary" className="title-tag">
                        {
                            this.validDescription() === 3 ?
                                <CheckCircleIcon color="primary" /> :
                                (
                                    this.validDescription() === 1 || this.validDescription() === 2 ?
                                        <WarningIcon color="secondary" /> :
                                        <ErrorIcon color="error"  />
                                )
                        } Description
                        {
                            this.validDescription() === 3 ?
                                <Badge badgeContent="+1" color="primary" /> :
                                (
                                    this.validDescription() === 1 || this.validDescription() === 2 ?
                                        <Badge badgeContent="0" color="secondary" /> :
                                        <Badge badgeContent="-1" color="error" />
                                )
                        }
                    </Typography>
                    <Divider variant="fullWidth" />
                    {
                        this.state.data.meta.description ? <Box className="content-tag"><Typography variant="body2" color="primary">{this.state.data.meta.description}</Typography></Box> : ""
                    }
                    <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                        {
                            this.validDescription() === 3 ? "The meta description tag is correct." : (
                                this.validDescription() === 1 ?
                                    "The meta description tag is too short, try to keep your meta description between 120 and 158 characters." :
                                (this.validDescription() === 2 ?
                                    "The meta description tag is too long, try to keep your meta description between 120 and 158 characters." :
                                    "The meta description was not found, it serves the function of advertising copy and thus is a very visible and important part of search marketing."
                                )
                            )
                        }
                    </Typography>
                </Box>

                <Box className="tag-analysis-container">
                    <Typography variant="h5" color="textPrimary" className="title-tag">
                        <InfoIcon /> Keywords
                    </Typography>
                    <Divider variant="fullWidth" />
                    {
                        this.state.data.meta.keywords ? <Box className="content-tag"><Typography variant="body2" color="primary">{this.state.data.meta.keywords}</Typography></Box> : ""
                    }
                    <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                        At one time, the keyword tag was vastly important to SEO. Nowadays, search engines such as Google scan content for quality and search intent. This means the keyword tag is no longer needed.
                    </Typography>
                </Box>

                <Box className="tag-analysis-container">
                    <Typography variant="h5" color="textPrimary" className="title-tag">
                        { this.headerTagIcon() } Header tags
                        {
                            this.headerTagStatus() === 0 ? <Badge badgeContent="-0.5" color="error" /> : (
                                this.headerTagStatus() === 1 ? <Badge badgeContent="0" color="secondary" /> :
                                    <Badge badgeContent="+0.5" color="primary" />
                            )
                        }
                    </Typography>
                    <Divider variant="fullWidth" />
                    {
                        <Box className="content-tag">
                            <Typography variant="body2" color="primary">
                                Number of H1: {this.state.data.titles.h1} <br />
                                Number of H2: {this.state.data.titles.h2} <br />
                                Number of H3: {this.state.data.titles.h3} <br />
                                Number of H4: {this.state.data.titles.h4}
                            </Typography>
                        </Box>
                    }
                    <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                        Header tags are an important on-page SEO factor because they’re used to communicate to the search engines what your website is about. <br />
                        Search engines recognize the copy in your header tags as more important than the rest.
                        { this.headerAdditionalText() !== "" ? <br /> : '' }
                        { this.headerAdditionalText() }
                    </Typography>
                </Box>

                <Box className="tag-analysis-container">
                    <Typography variant="h5" color="textPrimary" className="title-tag">
                        { this.state.data.imageNoAlt.length > 0 ? <WarningIcon color="secondary" /> : <CheckCircleIcon color="primary" /> } Images alt attribute
                        { this.state.data.imageNoAlt.length > 0 ? <Badge badgeContent="0" color="secondary" /> : <Badge badgeContent="+0.5" color="primary" /> }
                    </Typography>
                    <Divider variant="fullWidth" />
                    { this.state.data.imageNoAlt.length > 0 ?
                        <Box className="content-tag no-wrapping">
                            <Typography variant="body2" color="primary">
                                { this.imageAsString() }
                            </Typography>
                        </Box> : ''
                    }
                    <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                        Alt attribute provide a text alternative for search engines. <br />
                        Applying images to alt attribute such as product photos can positively impact an ecommerce store's search engine rankings.
                    </Typography>
                </Box>

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

                <Box className="tag-analysis-container">
                    <Typography variant="h5" color="textPrimary" className="title-tag">
                         <FacebookIcon /> Facebook
                    </Typography>
                    <Divider variant="fullWidth" />
                    <Box className="content-tag no-wrapping">
                        <Typography variant="body2" color="primary">
                            { !this.state.data.social.facebook.app_id ? "If you want to use Facebook Insights, you must add og:app_id tag." : "You can use Facebook Insights." }
                            <br/>
                            { !this.state.data.social.facebook.type ? "Facebook set default og:type tag to 'website', if the content of post is different, you must add this tag." : "You has set og:type tag." }
                            <br />
                            { !this.state.data.social.facebook.locale ? "Facebook set default og:locale tag to 'en_US', if the content of post is in different language, you must add this tag." : "You has set og:locale tag." }
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

                <Box className="tag-analysis-container">
                    <Typography variant="h5" color="textPrimary" className="title-tag">
                        <TwitterIcon /> Twitter
                    </Typography>
                    <Divider variant="fullWidth" />
                    <Box className="content-tag no-wrapping">
                        <Typography variant="body2" color="primary">
                            { !this.state.data.social.twitter.creator ? "In the twitter:creator tag you can place the username for the website used in the card footer." : "You has set twitter:creator." }
                            <br/>
                            { !this.state.data.social.twitter.site ? "In the twitter:creator tag you can place the username for the content creator / author." : "You has set twitter:creator tag." }
                            <br />
                            { !this.state.data.social.twitter.card ? "In the twitter:cart tag you can specify the card type." : "You has set twitter:card tag." }
                        </Typography>
                    </Box>
                    <Grid alignContent="center" container>
                        <Grid xs={6} item>
                            <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                                This meta tags are only available with Twitter.
                            </Typography>
                        </Grid>
                        <Grid xs={6} className="text-right" item>
                            <Button color="primary" variant="outlined" onClick={() => { this.openUrl('https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started') }}>More information</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        );
    }
}