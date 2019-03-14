import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HelpIcon from "@material-ui/icons/Help";

import {
    Card,
    Checkbox,
    FormControl,
    FormControlLabel,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Tooltip,
    Typography
} from '@material-ui/core';

export default class MergeTemplateInputForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textInputValue: this.props.textInputValue,
            textInputConstraintPass: true, // Default to always passes
            formInputValue: this.props.formInputValue,
            menuInputSelected: this.props.menuInputSelected
        }

        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
        this.handleMenuInput = this.handleMenuInput.bind(this);

        if (this.props.textInputConstraintRegex) { // Check initial constraint
            
        }
    }

    render() {
        return (
            <Card style={styles.container}>
                <Typography variant="h5" style={styles.title}>{this.props.title}</Typography>
                {this.renderTextInput()}
                {this.renderMenuInput()}
                {this.renderFormInput()}
                {this.renderTip()}
            </Card>
        );
    }

    // TODO: Organize the different inputs into separate components/files

    // -------- Text Input -------- //

    handleTextInput(event) {
        const newInput = event.target.value;
        this.setState({
            textInputValue: newInput
        });
        if (this.props.textInputCallback) {
            this.props.textInputCallback(newInput);
        }
        if (this.props.textInputConstraintRegex) {
            this.handleTextInputConstraint(newInput);
        }
    }

    handleTextInputConstraint(input) {
        var constraintPass = input.match(new RegExp(this.props.textInputConstraintRegex));
        this.setState({ textInputConstraintPass: constraintPass })
        if (this.props.textInputConstraintCallback) {
            this.props.textInputConstraintCallback(constraintPass)
        }
    }

    renderTextInput() {
        if (this.props.textInputTitle) {
            return (
                <FormControl
                    error={!this.state.textInputConstraintPass}
                >
                    <Input
                        name="text_input"
                        placeholder={this.props.textInputTitle}
                        onChange={this.handleTextInput}
                        value={this.state.textInputValue}
                        style={styles.textInput}
                    />
                    {!this.state.textInputConstraintPass ? <Typography variant="body2" style={styles.textInputError}>{this.props.textInputConstraintMessage}</Typography> : null}
                </FormControl>
            );
        } else {
            return null;
        }
    }

    // -------- Form Input -------- //

    handleFormInput() {
        var currentValue = this.state.formInputValue;
        this.setState({
            formInputValue: !currentValue
        });
        if (this.props.formInputCallback) {
            this.props.formInputCallback(!currentValue);
        }
    }

    renderFormInput() {
        if (this.props.formInputTitle) {
            return (
                <FormControlLabel
                    name="form_input"
                    control={
                        <Checkbox
                            color="primary"
                            style={styles.formInputCheckbox}
                            checked={this.state.formInputValue}
                            onChange={this.handleFormInput}
                        />
                    }
                    label={
                        <Typography
                            variant="caption"
                        >
                            {this.props.formInputTitle}
                        </Typography>
                    }
                    labelPlacement="end"
                    style={styles.formInput}
                />
            );
        } else {
            return null;
        }
    }

    // -------- Menu Input -------- //

    handleMenuInput(event) {
        var currentSelection = event.target.value;
        this.setState({
            menuInputSelected: currentSelection
        });
        if (this.props.menuInputCallback) {
            this.props.menuInputCallback(currentSelection);
        }
    }

    createMenuItems() {
        return (
            this.props.menuInputValues.map( function(tab) {
                return (
                    <MenuItem key={tab} value={tab}>{tab}</MenuItem>
                )
            })
        );
    }

    renderMenuInput() {
        if (this.props.menuInputTitle) {
            return (
                <FormControl name="menu_input">
                    {this.state.menuInputSelected ? null : <InputLabel>{this.props.menuInputTitle}</InputLabel>}
                    <Select
                        style={styles.menuInput}
                        value={this.state.menuInputSelected}
                        onChange={this.handleMenuInput}
                    >
                        {this.createMenuItems()}
                    </Select>
                </FormControl>
            );
        } else {
            return null;
        }
    }

    // -------- Tip -------- //

    renderTip() {
        if (this.props.tip) {
            return (
                <Tooltip title={this.props.tip} style={styles.tip}><HelpIcon/></Tooltip>
            );
        } else {
            return null;
        }
    }
}

const styles = {
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 15,
        justifyContent: 'center',
    },
    title: {
        marginBottom: 15
    },
    textInput: {
        marginTop: 15
    },
    textInputError: {
        marginTop: 5,
        color: "red"
    },
    formInput: {
        marginTop: 15
    },
    formInputCheckbox: {
        position: "relative",
        top: 0
    },
    menuInput: {
        marginTop: 15
    },
    tip: {
        marginTop: 15,
    }
}

MergeTemplateInputForm.propTypes = {
    title: PropTypes.string.isRequired,
    tip: PropTypes.string,
    checkbox: PropTypes.string,
    textInputTitle: PropTypes.string,
    textInputValue: function(props, propName, componentName) {
        if (props['textInputTitle'] && (props[propName] === undefined || typeof(props[propName]) !== 'string')) {
            return new Error(
                "Please provide a textInputValue string!"
            );
        }
    },
    textInputCallback: function(props, propName, componentName) {
        if (props['textInputTitle'] && (props[propName] === undefined || typeof(props[propName]) !== 'function')) {
            return new Error(
                "Please provide a textInputCallback function!"
            );
        }
    },
    textInputConstraintRegex: function (props, propName, componentName) {
        if (props[propName] !== undefined && props['textInputTitle'] === undefined) {
            return new Error(
                "Please provide an input to check!"
            );
        }
        if (props[propName] !== undefined && typeof(props[propName]) !== 'string') {
            return new Error(
                "\"textInputConstraintRegex\" has to be a string!"
            );
        }
    },
    textInputConstraintCallback: function(props, propName, componentName) {
        if (props['textInputConstraintRegex'] && (props[propName] === undefined || typeof(props[propName]) !== 'function')) {
            return new Error(
                "Please provide a textInputConstraintCallback function!"
            );
        }
    },
    textInputConstraintMessage: PropTypes.string, // Optional message
    formInputTitle: PropTypes.string,
    formInputValue: function(props, propName, componentName) {
        if (props['formInputTitle'] && (props[propName] === undefined || typeof(props[propName]) !== 'boolean')) {
            return new Error(
                "Please provide a formInputValue boolean!"
            );
        }
    },
    formInputCallback: function(props, propName, componentName) {
        if (props['formInputTitle'] && (props[propName] === undefined || typeof(props[propName]) !== 'function')) {
            return new Error(
                "Please provide a formInputCallback function!"
            );
        }
    },
    menuInputTitle: PropTypes.string,
    menuInputSelected: function(props, propName, componentName) {
        if (props['menuInputTitle'] && (props[propName] === undefined || typeof(props[propName]) !== 'string')) {
            return new Error(
                "Please provide a menuInputSelected string!"
            );
        }
    },
    menuInputValues: function(props, propName, componentName) {
        if (props['menuInputTitle']) {
            if (props[propName] === undefined) {
                return new Error(
                    "Please provide a menuInputValues array of strings!"
                );
            }
            for (let i = 0; i < props[propName].length; i++) {
                if (typeof(props[propName][i]) !== 'string') {
                    return new Error(
                        "menuInputValues is not an array of strings!"
                    )
                }
            }
        }
    },
    menuInputCallback: function(props, propName, componentName) {
        if (props['menuInputTitle'] && (props[propName] === undefined || typeof(props[propName]) !== 'function')) {
            return new Error(
                "Please procide a menuInputCallback function!"
            );
        }
    }
}