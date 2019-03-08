import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HelpIcon from "@material-ui/icons/Help";

import { Card, Checkbox, FormControlLabel, Input, Tooltip, Typography } from '@material-ui/core';

export default class MergeTemplateInputForm extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.mergeTemplateInfo;

        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);

        if (this.props.textInputCallback) {
            this.props.textInputCallback(this.state.title); // Initialize value in parent
        }
        if (this.props.formControlCallback) {
            this.props.formControlCallback(this.state.timestampColumn.shouldPrefixNameWithMergeTemplateTitle);
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
        this.setState({ title: event.target.value });
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
                    value={this.state.title}
                    style={styles.textInput}
                />
            );
        } else {
            return null;
        }
    }

    handleFormInput() {
        var currentValue = this.state.timestampColumn.shouldPrefixNameWithMergeTemplateTitle;
        this.setState({
            timestampColumn: {
                ...this.state.timestampColumn,
                shouldPrefixNameWithMergeTemplateTitle: !currentValue
            }
        });
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
                            checked={this.state.timestampColumn.shouldPrefixNameWithMergeTemplateTitle}
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
    mergeTemplateInfo: PropTypes.shape({
        emailTemplate: PropTypes.shape({
            to: PropTypes.string,
            cc: PropTypes.string,
            bcc: PropTypes.string,
            subject: PropTypes.string,
            body: PropTypes.string
        }),
        id: PropTypes.string,
        type: PropTypes.string,
        createdBy: PropTypes.string,
        createdDateUtc: PropTypes.string,
        version: PropTypes.any,
        title: PropTypes.string.isRequired,
        sheetName: PropTypes.string,
        headerRowNumber: PropTypes.number,
        timestampColumn: PropTypes.shape({
            name: PropTypes.string,
            shouldPrefixNameWithMergeTemplateTitle: PropTypes.bool.isRequired,
            title: PropTypes.string
        }).isRequired,
        conditional: PropTypes.string,
        repeater: PropTypes.string
    }).isRequired, // For gathering info of MergeTemplate -> include title (autofill if props passed in -> TitlePage)
    tip: PropTypes.string,
    checkbox: PropTypes.string,
    textInput: PropTypes.string,
    textInputCallback: PropTypes.func,
    formInput: PropTypes.string,
    formInputCallback: PropTypes.func,
    hint: PropTypes.string,
}