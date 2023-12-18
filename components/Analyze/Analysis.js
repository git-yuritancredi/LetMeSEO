import React from "react";
import {Box} from "@mui/material";
import Title from './Boxes/Title';
import Images from "./Boxes/Images";
import Robots from './Boxes/Robots';
import OgTags from "./Boxes/OgTags";
import Twitter from "./Boxes/Twitter";
import Headers from './Boxes/Headers';
import Facebook from "./Boxes/Facebook";
import Keywords from './Boxes/Keywords';
import Viewport from './Boxes/Viewport';
import Canonical from './Boxes/Canonical';
import Description from './Boxes/Description';

export default class Analysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    render() {
        return (
            <Box className="analysis-conainer-inner">
                <Robots robots={this.state.data.robots}/>
                <Canonical canonical={this.state.data.canonical}/>
                <Viewport mobile={this.state.data.mobile}/>
                <Title title={this.state.data.meta.title}/>
                <Description description={this.state.data.meta.description}/>
                <Keywords keywords={this.state.data.meta.keywords}/>
                <Headers titles={this.state.data.titles}/>
                <Images images={this.state.data.imageNoAlt}/>
                <OgTags social={this.state.data.social}/>
                <Facebook social={this.state.data.social}/>
                <Twitter social={this.state.data.social}/>
            </Box>
        );
    }
}
