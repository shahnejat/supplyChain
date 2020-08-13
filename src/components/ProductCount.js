import React from 'react';
import { Row, Col } from 'react-bootstrap';

class ProductCount extends React.PureComponent {
    
    render() { 
        return ( 
        <Col>
        <p className="title"> {this.props.title} </p>
        <Row className="itemA">  
            <Col>A:</Col> 
            <Col md="auto">{this.props.weekCount.stockA}</Col> 
        </Row>
        <Row className="itemB">  
            <Col>B:</Col> 
            <Col md="auto">{this.props.weekCount.stockB}</Col> 
        </Row>
        <Row className="itemC">  
            <Col>C:</Col>  
            <Col md="auto">{this.props.weekCount.stockC}</Col> 
        </Row>
        </Col>
        );
    }
}
 
export default ProductCount;