import React from 'react';
import {Box, Divider, Skeleton} from "@mui/material";

export default class Placeholder extends React.Component {
    constructor(props) {
        super(props);

        let items = [];
        items.push(<Skeleton animation="wave" key={this.getRandom()} className="first-line" variant="rect" width={200} height={35}/>)
        items.push(<Divider variant="fullWidth" key={this.getRandom()}/>);
        for (let i = 1; i <= 10; i++) {
            items.push(<Skeleton animation="wave" key={i} variant="rect" width={this.getRandom()} height={15}/>);
        }
        items.push(<br key={this.getRandom()}/>);
        items.push(<br key={this.getRandom()}/>);
        items.push(<Skeleton animation="wave" key={this.getRandom()} className="first-line" variant="rect" width={200} height={35}/>)
        items.push(<Divider key={this.getRandom()} variant="fullWidth"/>);
        for (let j = 0; j < 10; j++) {
            items.push(<Skeleton animation="wave" key={14 + j} variant="rect" width={this.getRandom()} height={15}/>);
        }

        this.state = {
            skeletonItems: items
        }
    }

    getRandom() {
        let random = Math.random(0, 100).toFixed(2) * 100;
        random < 1 ? random + 10 : random;
        return random + "%";
    }

    render() {
        return (
            <Box className="skeleton-container">
                {this.state.skeletonItems}
            </Box>
        );
    }
}
