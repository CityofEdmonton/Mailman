// Source: https://material-ui.com/demos/autocomplete/

import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

import {
  FormControl,
  Input,
  Typography
} from '@material-ui/core';

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <Input
      fullWidth
      // InputProps={{
      //   inputRef: node => {
      //     ref(node);
      //     inputRef(node);
      //   },
      //   classes: {
      //     input: classes.input
      //   }
      // }}
      {...other}
    />
  );
}

function getSuggestions(value, suggestions, openWrapper, closeWrapper) {
  const regex = openWrapper ? new RegExp(openWrapper + "[^" + closeWrapper +"]*$") : new RegExp("");
  if (openWrapper && !value.match(regex)) {
    return [];
  }

  const sliceFrom = value.match(new RegExp(regex)).index + 2;
  const inputValue = openWrapper ? value.slice(sliceFrom, value.length).trim().toLowerCase() : value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? suggestions
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

const styles = theme => ({
  container: {
    position: "relative",
    marginTop: 30
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  }
});

class MuiReactAutosuggest extends React.Component {
  state = {
    single: this.props.value || "",
    suggestions: [],
    constraintPass: true // Always default to true
  };

  componentDidMount() {
    if (this.props.constraintRegex) { // Check initial constraint
        console.log("Input to check: ", this.state.single)
        this.handleConstraint(this.state.single)
    }
  }

  handleConstraint = (input) => {
    var newConstraintPass = Boolean(input.match(new RegExp(this.props.constraintRegex)));
    if (this.props.constraintCallback) {
        this.setState({ constraintPass: newConstraintPass })
        this.props.constraintCallback(newConstraintPass)
    }
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.suggestions, this.props.openWrapper, this.props.closeWrapper)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = name => (event, { newValue }) => {
    this.setState({
      [name]: newValue
    });
    this.props.callback(newValue); // Callbacks here
    if (this.props.constraintRegex) {
      this.handleConstraint(newValue);
    }
  };

  onSuggestionSelected = (event, { suggestion }) => {
    const { openWrapper, closeWrapper } = this.props;
    const regex = openWrapper ? new RegExp(openWrapper + "[^" + closeWrapper +"]*$") : null;
    const newValue = regex
      ? this.state.single.replace(regex, openWrapper + suggestion.label + closeWrapper)
      : suggestion.label
    this.setState({ single: newValue })
    this.props.callback(newValue); // Callbacks here as well
    if (this.props.constraintRegex) {
      this.handleConstraint(newValue);
    }
  }

  getSuggestionValue = (suggestion) => {
    return this.state.single;
  }

  renderSuggestion = (suggestion, { query, isHighlighted }) => {

    const { openWrapper, closeWrapper } = this.props;

    const regex = openWrapper ? new RegExp(openWrapper + "[^" + closeWrapper + "]*$") : null;

    const sliceFrom = regex ? query.match(regex).index + 2 : 0;
    const newQuery = regex ? query.slice(sliceFrom, query.length).trim().toLowerCase() : query.trim().toLowerCase();
    
    const matches = match(suggestion.label, newQuery);
    const parts = parse(suggestion.label, matches);
  
    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) =>
            part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            )
          )}
        </div>
      </MenuItem>
    );
  }

  render() {
    const { classes } = this.props;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue: this.getSuggestionValue,
      renderSuggestion: this.renderSuggestion
    };

    return (
      <FormControl
        error={(!this.state.constraintPass && Boolean(this.state.single))}
      >
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            placeholder: this.props.placeholder,
            value: this.state.single,
            onChange: this.handleChange("single")
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionHighlighted={this.onSuggestionHighlighted}
        />
        {(!this.state.constraintPass && Boolean(this.state.single)) ? <Typography variant="body2" style={{ marginTop: 5, color: "red" }}>{this.props.constraintMessage}</Typography> : null}
      </FormControl>
    );
  }
}

MuiReactAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string
  })).isRequired,
  callback: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  openWrapper: PropTypes.string,
  closeWrapper: function (props, propName, componentName) {
    if (props['openWrapper'] && (props[propName] === undefined || typeof(props[propName]) !== 'string')) {
      return new Error(
          "Please provide a closeWrapper function!"
      );
    }
  },
  constraintRegex: function (props, propName, componentName) {
    if (props[propName] !== undefined && props['callback'] === undefined) {
        return new Error(
            "Please provide a callback function!"
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
};

export default withStyles(styles)(MuiReactAutosuggest);
