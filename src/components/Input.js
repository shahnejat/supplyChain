import React from 'react';
import { Container } from 'react-bootstrap';
import OrdersForm from './OrdersForm';
import DemandsSellsForm from './DemandsSellsForm';
import Button from 'react-bootstrap/Button'
import { Row, Col } from 'react-bootstrap';

class Input extends React.PureComponent {
    render() { 
        const {simInput, handleNextButton, supplier, handleInput} = this.props;
        
        return (
        <Container>
        <DemandsSellsForm title="Demands" simInput={simInput}
            handleInput={handleInput}/>
        <DemandsSellsForm title="Sells" simInput={simInput} 
            handleInput={handleInput}/>
        <OrdersForm supplier={supplier} title="Orders"
            orders={simInput.orders} handleInput={handleInput}/>
        <Row>  
            <Col><Button disabled={true} variant="outline-primary" block>Previous</Button></Col>
            <Col><Button disabled={true} variant="outline-primary" block>Reset</Button></Col>
            <Col>
                <Button onClick={handleNextButton} 
                    variant="outline-primary" block>Next
                </Button>
            </Col>
        </Row>
        </Container>
        );
    }
}

export default Input;