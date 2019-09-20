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
    'Which tab are we sending from?',
    'Which row contains your header titles?',
    'Who are you sending to?',
    'What would you like your email subject to be?',
    'What would you like your email body to be?',
    'How do you want to send the email?',
    'Conditionally send this merge?',
  ]
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `This title will help you differentiate this merge from others.`
    case 1:
      return 'This tab must contain all the information you may want to send in an email.'
    case 2:
      return `Mailman will use this to swap out template tags.`
    case 3:
      return `This is the column filled with the email addresses of the recipients.`
    case 4:
      return `Recipients will see this as the subject line of the email. Type << to see a list of column names. Template tags will be swapped out with the associated values in the Sheet.`
    case 5:
      return `Recipients will see this as the body of the email. Type << to see a list of column names. Template tags will be swapped out with the associated values in the Sheet.`
    case 6:
      return `This card is used to determine what type of repeater you want to have. "Immediately" will send the email once a Google form linked to the sheet is submitted. Please note that if you choose this option, you will not be able to set conditionals."Hourly"  will send emails every hour; it is a good idea to combine this with a conditional, otherwise every person listed in the spreadsheet will recieve an email whenever Mailman runs!"Manually" will send emails whenever the user manually presses the run button.`
    case 7:
      return `This column is used to determine when to send an email. If a given row reads TRUE, Mailman will send an email. Any other value and Mailman won't send. This can be useful for scheduling your merges or ensuring you don't accidentally email someone twice.`
    default:
      return 'Unknown step'
  }
}

class EditMergeTemplateInner extends Component {
  state = {
    activeStep: 0,
  }

  constructor(props) {
    super(props)
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

  render() {
    const { template, classes } = this.props
    const { activeStep } = this.state
    const steps = getSteps()

    let form
    if (template) {
      form = <p>Edit Merge Templates for {template.id}</p>
    }
    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography>{getStepContent(index)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
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
      </div>
    )
  }
}
export const EditMergeTemplate = withStyles(styles, { withTheme: true })(
  EditMergeTemplateInner
)

class EditMergeTemplateByIdInner extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <EditMergeTemplate template={this.props.template} />
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id

  return {
    template: state.readMergeTemplates.mergeTemplates.find(el => {
      return el.id === id
    }),
  }
}

export const EditMergeTemplateById = connect(mapStateToProps)(
  EditMergeTemplateByIdInner
)
