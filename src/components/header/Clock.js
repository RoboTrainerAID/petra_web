import React from "react";

//Styling
import "./Clock.css";


export default class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.ticker = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.ticker);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div className="clock">
                {this.state.date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} Uhr
            </div>
        );
    }
}


