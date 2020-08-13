import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCount from './ProductCount';
import CytoscapeComponent from 'react-cytoscapejs'

import "./Output.css"
  
class Output extends React.PureComponent {

    componentDidMount = () => {
        this.setUpListeners()
    }
      
    setUpListeners = () => {
        this.cy.on('click', 'node', (event) => {
            if(event.target._private.data.id !== "US")
                this.props.handleGraphClick(event)
        })
    }

    render(){
        const elements = [
           { data: { id: 'KW', label: 'Ke-Wan Thum Inc.' }, position: { x: 0, y: 0 },aaa: { x: 0, y: 0 } },
           { data: { id: 'WWR', label: 'W.W.R. Industries' }, position: { x: 100, y: 0 } },
           { data: { id: 'ADD', label: 'A.A.D.' }, position: { x: 100, y: 0 } },
           { data: { id: 'IP', label: 'I.P.' }, position: { x: 100, y: 0 } },
           { data: { id: 'DP', label: 'D.P.' }, position: { x: 0, y: 0 } },
           { data: { id: 'US', label: 'US Inc.' }, position: { x: 0, y: 0 } },

           { data: { source: 'KW', target: 'US', label: ' ' } },
           { data: { source: 'WWR', target: 'US', label: ' ' } },
           { data: { source: 'ADD', target: 'US', label: ' ' } },
           { data: { source: 'IP', target: 'US', label: ' ' } },
           { data: { source: 'DP', target: 'US', label: ' ' } },
        ];
    
        const cyLayout = {
            name: 'concentric',
            minNodeSpacing: 60,
            edgeElasticity: function( edge ){ return 0; },
            animate: true,
            fit: true,
        }

        const cyStyle = {
            width: '300px',
            height: '300px',
        }

        const stylesheet = [
            {
                selector: 'node',
                style: {
                    'background-color': '#3b5998',
                    'label': 'data(label)'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier'
                }
            }
        ]
        const {weekStart, weekEnd, results} = this.props.week.simOutput;
        return (
        <Container>
            <Row>
            <Col md="auto"> 
                <CytoscapeComponent cy={(cy) => {this.cy = cy}} elements={elements} 
                    layout= {cyLayout} style={cyStyle} stylesheet={stylesheet} />
            </Col>
            <Col md="auto">
                <p className="title">Week Results</p>
                <Row className="output">
                    <Col>Income:</Col>
                    <Col md="auto">{results.income}$</Col>
                </Row>
                <Row className="output">
                    <Col>Storage cost:</Col>
                    <Col md="auto">{results.storageCost}$</Col>
                </Row>
                <Row className="output">
                    <Col>Total order cost:</Col>
                    <Col md="auto">{results.ordersCost}$</Col>
                </Row>
                <Row className="output">
                    <Col>Profit:</Col>
                    <Col md="auto">{results.profit}$</Col>
                </Row>
                <Row className="output">
                    <Col>Accumulated profit:</Col>
                    <Col md="auto">{results.accumulatedProfit}$</Col>
                </Row>
            </Col>
            <ProductCount title="Week Start" weekCount={weekStart}/>
            <ProductCount title="Week End" weekCount={weekEnd}/>
            </Row>
        </Container>
        )
    }
}

export default Output;
