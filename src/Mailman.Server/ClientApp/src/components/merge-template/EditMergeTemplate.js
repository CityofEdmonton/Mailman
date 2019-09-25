import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Title from './Title'
import TemplateDataSource from './TemplateDataSource'
import { fetchSheetTabs } from '../../actions/SheetInfo'
import getParams from '../../util/QueryParam'

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
})

function getSteps() {
  return [
    'What should this merge template be called?',
    'Where is your data located?',
    'Who are you sending to?',
    'What would you like your email subject to be?',
    'What would you like your email body to be?',
    'How do you want to send the email?',
    'Conditionally send this merge?',
  ]
}

class EditMergeTemplateInner extends Component {
  state = {
    activeStep: 0,
    template: {
      title: '',
      sheetName: '',
      headerRowNumber: 1,
    },
  }

  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLoadTabs = this.handleLoadTabs.bind(this)
  }

  getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Title
            handleChange={this.handleChange}
            value={this.state.template.title}
          />
        )
      case 1:
        return (
          <TemplateDataSource
            tab={this.state.template.sheetName}
            row={this.state.template.headerRowNumber}
            sheetId={this.props.sheetId}
            tabs={this.props.tabs}
            handleLoadTabs={this.handleLoadTabs}
            handleChange={this.handleChange}
          />
        )
      case 2:
        return `This is the column filled with the email addresses of the recipients.`
      case 3:
        return `Recipients will see this as the subject line of the email. Type << to see a list of column names. Template tags will be swapped out with the associated values in the Sheet.`
      case 4:
        return `Recipients will see this as the body of the email. Type << to see a list of column names. Template tags will be swapped out with the associated values in the Sheet.`
      case 5:
        return `This card is used to determine what type of repeater you want to have. "Immediately" will send the email once a Google form linked to the sheet is submitted. Please note that if you choose this option, you will not be able to set conditionals."Hourly"  will send emails every hour; it is a good idea to combine this with a conditional, otherwise every person listed in the spreadsheet will recieve an email whenever Mailman runs!"Manually" will send emails whenever the user manually presses the run button.`
      case 6:
        return `This column is used to determine when to send an email. If a given row reads TRUE, Mailman will send an email. Any other value and Mailman won't send. This can be useful for scheduling your merges or ensuring you don't accidentally email someone twice.`
      default:
        return 'Unknown step'
    }
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }))
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }))
  }

  handleReset = () => {
    this.setState({
      activeStep: 0,
    })
  }

  handleSubmit(event) {
    event.preventDefault()
  }

  handleChange = input => e => {
    let template = {
      ...this.state.template,
      ...{ [input]: e.target.value },
    }
    this.setState({ template })
  }

  handleLoadTabs(sheetId) {
    console.log('Updating tabs')
  }

  render() {
    const { classes } = this.props
    const { activeStep } = this.state
    const steps = getSteps()

    let buttonAttr = {
      variant: 'contained',
      color: 'primary',
      onClick: this.handleNext,
      className: classes.button,
    }
    let buttonText = 'Next'
    if (activeStep === steps.length - 1) {
      buttonText = 'Finish'
      buttonAttr.onClick = this.handleSubmit
      buttonAttr.type = 'submit'
    }

    return (
      <form
        onSubmit={this.handleSubmit}
        className={classes.root}
        autoComplete="off"
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {this.getStepContent(index)}
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button {...buttonAttr}>{buttonText}</Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </form>
    )
  }

  static getDerivedStateFromProps(props, state) {
    if (props.template && props.template.id !== state.template.id) {
      return {
        template: props.template,
      }
    }
    return null
  }
}
export const EditMergeTemplate = withStyles(styles, { withTheme: true })(
  EditMergeTemplateInner
)

class EditMergeTemplateByIdInner extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchSheetTabs(this.props.sheetId)
  }

  render() {
    return (
      <EditMergeTemplate
        template={this.props.template}
        tabs={this.props.sheet}
        sheetId={this.props.sheetId}
      />
    )
  }
}

const mapDispatchToProps = {
  fetchSheetTabs,
}

const mapStateToProps = (state, ownProps) => {
  const sheetId = getParams(ownProps.location.search)['ssid']
  const id = ownProps.match.params.id

  const template = state.readMergeTemplates.mergeTemplates.find(el => {
    return el.id === id
  })

  let sheet = {
    loading: false,
    tabs: [],
  }
  if (state.sheetInfo.sheets && state.sheetInfo.sheets[sheetId]) {
    sheet = state.sheetInfo.sheets[sheetId]
  }

  return {
    template,
    sheet,
    sheetId,
  }
}

export const EditMergeTemplateById = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMergeTemplateByIdInner)
