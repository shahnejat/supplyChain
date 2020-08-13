import React from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'

class DemandsSellsForm extends React.PureComponent {
    
    handleInput = (event) => {
        this.props.handleInput({action: this.props.title,
            name: event.target.name, value: event.target.value});
    };

    render() { 
        const {title, simInput} = this.props;
        let input = title === "Demands" ? simInput.demands : null;
        input = title === "Sells" ? simInput.sells : input;

        return (
        <React.Fragment>
        <p className="title"> {title} </p>
        <Form>
            <Form.Row>
            <Form.Group as={Col}>
                <Form.Control className="itemA" type="number" min="0" name="A"
                     value={input.a || ""} placeholder="A" onChange={this.handleInput}/>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Control className="itemB" type="number" min="0" name="B"
                     value={input.b || ""} placeholder="B" onChange={this.handleInput}/>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Control className="itemC" type="number" min="0" name="C"
                     value={input.c || ""} placeholder="C" onChange={this.handleInput}
                     disabled={true}/>
            </Form.Group>
            </Form.Row>
        </Form>
        </React.Fragment>
        );
    }
}
 
export default DemandsSellsForm;