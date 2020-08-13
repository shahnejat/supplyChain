import React from 'react';
import "./WeekBar.css";
import ProgressBar from 'react-bootstrap/ProgressBar'
//import { Container, Row, Col } from 'react-bootstrap';

class WeekBar extends React.PureComponent {
    render() { 
        return (
            <div className="week-bar">  
                <span className="span" md="auto">Current Week: {`${this.props.currentWeek}`} </span>
                <ProgressBar className='pbar' now={this.props.currentWeek} />
            </div>
        );
    }
}
/*<Container>
    <Row>
    <Col className="inline" md="auto">Current Week:</Col>
    <Col><ProgressBar className='pbar' now={now} label={`${now}`} /></Col>
    </Row>
</Container>   */
export default WeekBar;