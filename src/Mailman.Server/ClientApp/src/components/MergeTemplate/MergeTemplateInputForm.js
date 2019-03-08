import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import HelpIcon from "@material-ui/icons/Help";

import { Card, Grid, Input, Typography } from '@material-ui/core';

export default class MergeTemplateInputForm extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.mergeTemplateInfo;

        this.handleTextInput = this.handleTextInput.bind(this);
    }

    render() {
        return (
            <Card style={styles.container}>
                <Typography variant="h5" gutterBottom>{this.props.title}</Typography>
                {this.renderTextInput()}
            </Card>
        );
    }

    handleTextInput(event) {
        // let templateInfo = Object.assign({}, this.props.)
        this.setState({ merge_title: event.target.value })
    }

    renderTextInput() {
        if (this.props.textInput) {
            return [
                <Input name="text_input" placeholder={this.props.textInput} onChange={this.handleTextInput} value={this.state.merge_title}/>
            ];
        } else {
            return null;
        }
    }

    renderTip() {
        return (
            null
        );
    }
}

const styles = {
    container: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
    }
}

MergeTemplateInputForm.propTypes = {
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    mergeTemplateInfo: PropTypes.object.isRequired, // For gathering info of MergeTemplate -> include title (autofill if props passed in -> TitlePage)
    tip: PropTypes.string,
    checkbox: PropTypes.string,
    textInput: PropTypes.string,
    hint: PropTypes.string,
}