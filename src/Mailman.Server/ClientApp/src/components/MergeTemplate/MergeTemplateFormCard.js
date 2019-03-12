import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HelpIcon from "@material-ui/icons/Help";

import { Card, Checkbox, FormControlLabel, Input, Tooltip, Typography } from '@material-ui/core';

import { mergeTemplateInfoShape } from './MergeTemplatePropTypes';

export default class MergeTemplateInputForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mergeTemplateInfo: this.props.mergeTemplateInfo,
            test: "THIS IS A TEST"
        } // Add selected tab to state?? -> this.state = ...this.state, this.props.selectedTab

        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);

        console.log("MergeTemplateInputForm State: ", this.state);

        if (this.props.textInputCallback) {
            this.props.textInputCallback(this.state.mergeTemplateInfo.title); // Initialize value in parent
        }
        if (this.props.formControlCallback) {
            this.props.formControlCallback(this.state.mergeTemplateInfo.timestampColumn.shouldPrefixNameWithMergeTemplateTitle);
        }
    }

    render() {
        return (
            <Card style={styles.container}>
                <Typography variant="h5" style={styles.title}>{this.props.title}</Typography>
                {this.renderTextInput()}
                {this.renderFormInput()}
                {this.renderTip()}
            </Card>
        );
    }

    handleTextInput(event) {
        this.setState({
            mergeTemplateInfo: {
                ...this.state.mergeTemplateInfo,
                title: event.target.value
            }
        });
        if (this.props.textInputCallback) {
            this.props.textInputCallback(event.target.value);
        }
    }

    renderTextInput() {
        if (this.props.textInput) {
            return (
                <Input
                    name="text_input"
                    placeholder={this.props.textInput}
                    onChange={this.handleTextInput}
                    value={this.state.mergeTemplateInfo.title}
                    style={styles.textInput}
                />
            );
        } else {
            return null;
        }
    }

    handleFormInput() {
        var currentValue = this.state.mergeTemplateInfo.timestampColumn.shouldPrefixNameWithMergeTemplateTitle;
        console.log("BEFORE STATE: ", this.state);
        this.setState({
            mergeTemplateInfo: {
                ...this.state.mergeTemplateInfo,
                timestampColumn: {
                    ...this.state.mergeTemplateInfo.timestampColumn,
                    shouldPrefixNameWithMergeTemplateTitle: !currentValue
                }
            }
        });
        console.log("AFTER STATE: ", this.state);
        if (this.props.formInputCallback) {
            this.props.formInputCallback(!currentValue);
        }
    }

    renderFormInput() {
        if (this.props.formInput) {
            return (
                <FormControlLabel
                    control={
                        <Checkbox
                            color="primary"
                            style={styles.formInputCheckbox}
                            checked={this.state.mergeTemplateInfo.timestampColumn.shouldPrefixNameWithMergeTemplateTitle}
                            onChange={this.handleFormInput}
                        />
                    }
                    label={
                        <Typography
                            variant="caption"
                        >
                            {this.props.formInput}
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
    tip: {
        marginTop: 15
    }
}

MergeTemplateInputForm.propTypes = {
    title: PropTypes.string.isRequired,
    mergeTemplateInfo: mergeTemplateInfoShape.isRequired,
    tip: PropTypes.string,
    checkbox: PropTypes.string,
    textInput: PropTypes.string,
    textInputCallback: function(props, propName, componentName) {
        if ((props['textInput'] && (props[propName] === undefined || typeof(props[propName]) !== 'function'))) {
            return new Error(
                "Please provide a textInputCallback function!"
            );
        }
    },
    formInput: PropTypes.string,
    formInputCallback: function(props, propName, componentName) {
        if ((props['formInput'] && (props[propName] === undefined || typeof(props[propName]) !== 'function'))) {
            return new Error(
                "Please provide a formInputCallback function!"
            );
        }
    },
    hint: PropTypes.string,
}