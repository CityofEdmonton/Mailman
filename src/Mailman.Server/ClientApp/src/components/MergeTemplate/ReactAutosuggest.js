import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

export default class ReactAutosuggest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
            // suggestions: this.props.suggestions
            suggestions: [ { value: "Testing 1" }, { value: "Testing 2" } ]
        }
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    }

    onSuggestionsFetchRequested =({ value }) => {
        if (value.match(new RegExp(this.props.regex))) {
            this.setState({
                // suggestions: this.props.suggestions
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

    onSuggestionSelected = (event, { suggestion }) => {
        const newValue = this.state.value.replace(new RegExp(this.props.regex), "<<" + suggestion.value + ">>")
        this.setState({ value: newValue })
    }

    getSuggestionValue = (value) => {
        return this.state.value;
    }

    renderSuggestion = (suggestion) => (
            <span>{suggestion.value}</span>
    );

    render() {

        const inputProps = {
            placeholder: this.props.placeholder,
            value: this.state.value,
            onChange: this.onChange
        };

        return (
            <Autosuggest
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                onSuggestionSelected={this.onSuggestionSelected}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                theme={theme}
            />
        );
    }
}

const theme = {
    container: {
        position: 'relative'
    },
    input: {
        width: 240,
        height: 15,
        paddingBottom: 8,
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 300,
        fontSize: 16,
        border: 'none',
        borderBottom: '1px solid #aaa',
    },
    inputFocused: {
        outline: 'none',
        borderBottom: '1.5px solid #3e30c1',
        // TODO: add transition animation
    },
    inputOpen: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    suggestionsContainer: {
        display: 'none'
    },
    suggestionsContainerOpen: {
        display: 'block',
        position: 'absolute',
        top: 25,
        width: 240,
        border: '1px solid #aaa',
        backgroundColor: '#fff',
        fontFamily: 'Helvetica, sans-serif',
        fontWeight: 300,
        fontSize: 16,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        zIndex: 2
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    suggestion: {
        cursor: 'pointer',
        padding: '10px 20px'
    },
    suggestionHighlighted: {
        backgroundColor: '#ddd'
    }
};

ReactAutosuggest.propTypes = {
    suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
    regex: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired
}