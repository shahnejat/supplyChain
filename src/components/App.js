import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import update from 'immutability-helper';
import Header from './Header';
import WeekList from './WeekList';
import WeekBar from "./WeekBar";
import Input from './Input';
import Output from "./Output";
import {Core} from '../core/simulate';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.core = new Core()
    this.state = {
      currentWeek: 0,
      supplier: {
        enabledOrders: {a: false, b: false, c: false}
      },
      week: this.core.initWeek()
    } 
  }
  
  handleNextButton = event => {
    const newWeek = this.core.advanceSimulation(this.state.week);
    let newState = update(this.state, {currentWeek: {$set: this.state.currentWeek + 1}});
    newState = update(newState, {week: {$set: newWeek}});
    this.setState(newState);
  };

  handleInput = event => {
    this.setState(this.core.simulate(this.state, event));
  };

  handleGraphClick = event => {
    this.setState(this.core.supplierSelected(this.state, event.target._private.data));
  };

  render() { 
    return (
      <div>
        <Header />
        <Container>
          <WeekBar currentWeek={this.state.currentWeek} />
          <Row>
            <Col md="auto"> <WeekList/> </Col>
            <Col>
              <Row > 
                <Output week={this.state.week}
                  handleGraphClick={this.handleGraphClick} /> 
              </Row>
              <Row> 
                <Input simInput={this.state.week.simInput} handleNextButton={this.handleNextButton}
                  supplier={this.state.supplier} handleInput={this.handleInput}/> 
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
