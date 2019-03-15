import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HelpIcon from "@material-ui/icons/Help";

import { Tooltip } from '@material-ui/core';

export default class Hint extends Component {
    render() {
        return (
            <Tooltip title={this.props.title} style={styles.hint}><HelpIcon/></Tooltip>
        );
    }
}

const styles = {
    hint: {
        marginTop: 15,
    }
}

Hint.propTypes = {
    title: PropTypes.string.isRequired
}