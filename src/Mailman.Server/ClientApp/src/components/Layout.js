import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import NavMenu from './NavMenu';

export default props => (
  <div>
  <NavMenu />
  <Grid fluid>
    <Row>
      <Col sm={3}>
      </Col>
      <Col sm={9}>
        {props.children}
      </Col>
    </Row>
  </Grid>

  </div>
);
