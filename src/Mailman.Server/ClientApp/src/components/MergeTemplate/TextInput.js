import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    FormControl,
    Input,
    Typography
} from '@material-ui/core';

export default class TextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || "",
            constraintPass: true, // Default to always passes
        }
    }

    componentDidMount() {
        if (this.props.constraintRegex) { // Check initial constraint
            console.log("Input to check: ", this.state.value)
            this.handleConstraint(this.state.value)
        }
    }

    render() {
        return (
            <FormControl
                error={(!this.state.constraintPass && Boolean(this.state.value))}
            >
                <Input
                    name="text_input"
                    placeholder={this.props.placeholder}
                    onChange={this.handleTextInput}
                    value={this.state.value}
                    style={styles.input}
                />
                {(!this.state.constraintPass && Boolean(this.state.value)) ? <Typography variant="body2" style={styles.error}>{this.props.constraintMessage}</Typography> : null}
            </FormControl>
        );
    }

    handleTextInput = (event) => {
        const newInput = event.target.value;
        this.setState({
            value: newInput
        });
        if (this.props.callback) {
            this.props.callback(newInput);
        }
        if (this.props.constraintRegex) {
            this.handleConstraint(newInput);
        }
    }

    handleConstraint = (input) => {
        var newConstraintPass = input.match(new RegExp(this.props.constraintRegex));
        if (this.props.constraintCallback) {
            this.setState({ constraintPass: newConstraintPass })
            this.props.constraintCallback(newConstraintPass)
        }
    }
}

const styles = {
    input: {
        marginTop: 15
    },
    error: {
        marginTop: 5,
        color: "red"
    }
}

TextInput.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    callback: PropTypes.func.isRequired,
    constraintRegex: function (props, propName, componentName) {
        if (props[propName] !== undefined && props['callback'] === undefined) {
            return new Error(
                "Please provide an input to check!"
            );
        }
        if (props[propName] !== undefined && typeof(props[propName]) !== 'string') {
            return new Error(
                "\"constraintRegex\" has to be a string!"
            );
        }
    },
    constraintCallback: function(props, propName, componentName) {
        if (props['constraintRegex'] && (props[propName] === undefined || typeof(props[propName]) !== 'function')) {
            return new Error(
                "Please provide a constraintCallback function!"
            );
        }
    },
    constraintMessage: PropTypes.string, // Optional message
}