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
import TemplateRecipient from './TemplateRecipient'
import TemplateEmail from './TemplateEmail'
import TemplateCondition from './TemplateCondition'
import { fetchSheetTabs, fetchSheetHeaders } from '../../actions/SheetInfo'
import getParams from '../../util/QueryParam'
import merge from 'deepmerge'

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
    'What would you like your email to look like?',
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
      emailTemplate: {
        to: '',
        cc: '',
        bcc: '',
      },
    },
  }

  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLoadTabs = this.handleLoadTabs.bind(this)
    this.handleLoadHeaders = this.handleLoadHeaders.bind(this)
    this.handleChange = this.handleChange.bind(this)
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
        return (
          <TemplateRecipient
            to={this.state.template.emailTemplate.to}
            bcc={this.state.template.emailTemplate.bcc}
            cc={this.state.template.emailTemplate.cc}
            headers={this.props.headers}
            handleLoadHeaders={this.handleLoadHeaders}
            handleChange={this.handleChange}
          />
        )
      case 3:
        return (
          <TemplateEmail
            body={this.state.template.emailTemplate.body}
            subject={this.state.template.emailTemplate.subject}
            headers={this.props.headers}
            handleLoadHeaders={this.handleLoadHeaders}
            handleChange={this.handleChange}
          />
        )
      case 4:
        return (
          <TemplateCondition
            conditional={this.state.template.conditional}
            headers={this.props.headers}
            handleLoadHeaders={this.handleLoadHeaders}
            handleChange={this.handleChange}
          />
        )
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
    let levels = input.split('.')
    let obj = {}
    let nextLvl = obj

    for (let i = 0; i < levels.length - 1; i++) {
      let level = levels[i]
      nextLvl[level] = {}
      nextLvl = nextLvl[level]
    }
    nextLvl[levels.pop()] = e.target.value

    // At this point, obj is a deep object of just the single input that triggered this event.
    // Deep Merge is needed to avoid destroying properties >1 level deep.
    let template = merge(this.state.template, obj)
    this.setState({ template })
  }

  handleLoadTabs() {
    this.props.fetchSheetTabs(this.props.sheetId)
  }

  handleLoadHeaders() {
    this.props.fetchSheetHeaders(
      this.props.sheetId,
      this.state.template.sheetName,
      this.state.template.headerRowNumber
    )
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
        headers={this.props.sheet}
        sheetId={this.props.sheetId}
        fetchSheetTabs={this.props.fetchSheetTabs}
        fetchSheetHeaders={this.props.fetchSheetHeaders}
      />
    )
  }
}

const mapDispatchToProps = {
  fetchSheetTabs,
  fetchSheetHeaders,
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
    headers: [],
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
