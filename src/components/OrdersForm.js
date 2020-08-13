import React from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'

class OrdersForm extends React.PureComponent {

    handleInput = (event) => {
        this.props.handleInput({action: this.props.title,
            name: event.target.name, value: event.target.value});
    };

    render() { 
        const {supplier, title, orders} = this.props;
        const enabled = supplier.enabledOrders;

        if(!supplier.info) {
            return <p className="title"> Please choose a supplier by clicking a node in the graph. </p>
        }

        const supplierData = orders.find(ele => ele.supplierId === supplier.info.id);


        return (
        <React.Fragment>
        <p className="title"> {title} ({supplier.info.label}) </p>
        <Form>
            <Form.Row>
            <Form.Group as={Col}>
                <Form.Control className="itemA" type="number" min="0" name="A"
                     value={supplierData.a || ""} placeholder="A" disabled={!enabled.a}
                     onChange={this.handleInput}/>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Control className="itemB" type="number" min="0" name="B"
                     value={supplierData.b || ""} placeholder="B" disabled={!enabled.b}
                     onChange={this.handleInput}/>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Control className="itemC" type="number" min="0" name="C"
                     value={supplierData.c || ""} placeholder="C" disabled={!enabled.c}
                     onChange={this.handleInput}/>
            </Form.Group>
            </Form.Row>
        </Form>
        </React.Fragment>
        );
    }
}
 
export default OrdersForm;