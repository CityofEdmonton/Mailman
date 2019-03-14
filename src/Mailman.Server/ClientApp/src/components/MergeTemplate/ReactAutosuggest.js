import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

import { Grid } from '@material-ui/core' // TODO: Remove this later -> just return the select component

export default class ReactAutosuggest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
            // suggestions: this.props.suggestions
            suggestions: [ { value: "Testing 1" }, { value: "Testing 2" } ]
        }
    }

    // handleChange = (selectedOption) => {
    //     this.setState({ selectedOption });
    //     console.log("Option selected: ", selectedOption);
    // }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    }

    onSuggestionsFetchRequested =({ value }) => {
        if (value.match(new RegExp(this.props.regex))) {
            this.setState({
                // suggestions: this.props.suggestions || test
                suggestions: [ { value: "Testing 1" }, { value: "Testing 2" } ]
            });
        } else {
            this.setState({
                suggestions: []
            });
        }
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    }

    getSuggestionValue = (value) => {
        return (
            this.state.value + value.value
        );
    }

    renderSuggestion = suggestion => (
        <div>
            {suggestion.value}
        </div>
    );

    render() {

        const inputProps = {
            placeholder: 'Type a programming language',
            value: this.state.value,
            onChange: this.onChange
        };

        return (
            <Grid style={styles.container}>
                <Autosuggest
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                    // onChange={this.handleChange}
                    // options={this.props.options}
                    // style={this.props.style}
                />
            </Grid>
        );
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
}

ReactAutosuggest.propTypes = {
    suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
    regex: PropTypes.string.isRequired
}