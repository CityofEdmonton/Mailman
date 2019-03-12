import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HelpIcon from "@material-ui/icons/Help";

import {
    Button,
    Card,
    Checkbox,
    FormControlLabel,
    Input,
    Menu,
    MenuItem,
    Select,
    Tooltip,
    Typography
} from '@material-ui/core';

import { mergeTemplateInfoShape } from './MergeTemplatePropTypes';

export default class MergeTemplateInputForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textInputValue: this.props.textInputValue,
            formInputValue: this.props.formInputValue,
            // mergeTemplateInfo: this.props.mergeTemplateInfo,
            sheetTabs: ["TODO: ADD TABS", 1, 2, 3],
            sheetHeaders: "TODO: ADD HEADERS", // ?? should this be in this component or handled by other component??
            // selectedTab: "Hello!"
            // anchorElement: null
        } // Add selected tab to state?? -> this.state = ...this.state, this.props.selectedTab

        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);

        console.log("MergeTemplateInputForm State: ", this.state);

        // if (this.props.textInputCallback) {
        //     this.props.textInputCallback(this.state.mergeTemplateInfo.title); // Initialize value in parent - YOU SHOULD NOT HAVE TO DO THIS, INITIALIZE FROM PARENT!!!
        // }
        // if (this.props.formControlCallback) {
        //     this.props.formControlCallback(this.state.mergeTemplateInfo.timestampColumn.shouldPrefixNameWithMergeTemplateTitle);
        // }
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

    // TODO: Drop-down menu -> get input from props

    handleClick = (event) => {
        this.setState({ anchorElement: event.currentTarget });
    }

    handleClose = () => {
        this.setState({ anchorElement: null });
    }

    createMenuItems() {
        return (
            // <React.Fragment>
            //     { this.state.sheetTabs.map(function(tab) {
            //         return (
            //             <MenuItem value={tab}>{tab}</MenuItem>
            //         )
            //     }) }
            // </React.Fragment>
            this.state.sheetTabs.map( function(tab) {
                return (
                    <MenuItem value={tab} key={tab}>{tab}</MenuItem>
                )
            })
        );
    }

    renderMenuInput() {
        if (this.props.menuInput) {

            // const { anchorElement } = this.state;
            
            return (
                <Select
                    style={styles.menuInput}
                    value={this.state.menuInputValue}
                >
                    {this.createMenuItems()}
                </Select>
                // <React.Fragment>
                //     <Button
                //         onClick={this.handleClick}
                //     >
                //         Open Menu
                //     </Button>
                //     <Menu
                //         anchorEl={anchorElement}
                //         open={Boolean(anchorElement)}
                //         onClick={() => console.log("Menu was clicked. TODO: get the available tabs?? - use a callback function??")}
                //         onClose={this.handleClose}
                //         style={styles.menuInput}
                //     >
                //         <Typography onClick={this.handleClose} style={styles.menuItem}>Menu Item 1</Typography>
                //         <Typography onClick={this.handleClose} style={styles.menuItem}>Menu Item 2</Typography>
                //         <Typography onClick={this.handleClose} style={styles.menuItem}>Menu Item 3</Typography>
                //     </Menu>
                // </React.Fragment>
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
    menuInput: PropTypes.array,
    // menuInputCallback: function(props, propName, componentName) {
    //     if ((props['menuInput'] && (props[propName] === undefined || typeof(props[propName]) !== 'function'))) {
    //         return new Error(
    //             "Please provide a menuInputCallback function!"
    //         );
    //     }
    // },
    sheetTabs: PropTypes.array,
    sheetHeaders: PropTypes.array
}