import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HelpIcon from "@material-ui/icons/Help";

import {
    Button,
    Card,
    Checkbox,
    FormControl,
    FormControlLabel,
    Input,
    InputLabel,
    Menu,
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
            formInputValue: this.props.formInputValue,
            menuInputSelected: this.props.menuInputSelected,
            // mergeTemplateInfo: this.props.mergeTemplateInfo,
            // sheetTabs: ["TODO: ADD TABS", 1, 2, 3],
            // sheetHeaders: "TODO: ADD HEADERS", // ?? should this be in this component or handled by other component??
            // selectedTab: "Hello!"
            // anchorElement: null
        } // Add selected tab to state?? -> this.state = ...this.state, this.props.selectedTab

        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
        this.handleMenuInput = this.handleMenuInput.bind(this);

        console.log("MergeTemplateInputForm State: ", this.state);
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

    handleTextInput(event) {
        this.setState({
            textInputValue: event.target.value
        });
        if (this.props.textInputCallback) {
            this.props.textInputCallback(event.target.value);
        }
    }

    renderTextInput() {
        if (this.props.textInputTitle) {
            return (
                <Input
                    name="text_input"
                    placeholder={this.props.textInputTitle}
                    onChange={this.handleTextInput}
                    value={this.state.textInputValue}
                    style={styles.textInput}
                />
            );
        } else {
            return null;
        }
    }

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

    // TODO: Handle callback! -> update selected from parent view

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
                <FormControl>
                    {this.state.menuInputSelected ? null : <InputLabel>{this.props.menuInputTitle}</InputLabel>}
                    <Select
                        style={styles.menuInput}
                        value={this.state.menuInputSelected}
                        onChange={this.handleMenuInput}
                        // TODO: Handle change and selection!!!
                    >
                        {this.createMenuItems()}
                    </Select>
                </FormControl>
            );
        } else {
            return null;
        }
    }

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
    menuInputSelected: PropTypes.string, // The initial value of the menu - optional
    menuInputValues: PropTypes.arrayOf(PropTypes.string),
    menuInputCallback: PropTypes.func
    // menuInputCallback: function(props, propName, componentName) {
    //     if ((props['menuInput'] && (props[propName] === undefined || typeof(props[propName]) !== 'function'))) {
    //         return new Error(
    //             "Please provide a menuInputCallback function!"
    //         );
    //     }
    // },
    // sheetTabs: PropTypes.array,
    // sheetHeaders: PropTypes.array
}