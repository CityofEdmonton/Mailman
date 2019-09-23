import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Settings from './components/Settings'
import { TitlePageContainer } from './components/create-merge/TitlePageContainer'
import { TabSelectionContainer } from './components/create-merge/TabSelectionContainer'
import { HeaderSelectionContainer } from './components/create-merge/HeaderSelectionContainer'
import { ReceiverSelectionContainer } from './components/create-merge/ReceiverSelectionContainer'
import { EmailSubjectContainer } from './components/create-merge/EmailSubjectContainer'
import { EmailBodyContainer } from './components/create-merge/EmailBodyContainer'
import { SavePageContainer } from './components/create-merge/SavePageContainer'
import { EditMergeTemplateById } from './components/merge-template/EditMergeTemplate'
import Counter from './components/Counter'
import FetchData from './components/FetchData'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

export default () => (
  <Router>
    <Layout>
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute path="/settings" component={Settings} />
      <Route path="/login" component={Login} />
      <ProtectedRoute
        path="/mergeTemplate/:id"
        component={EditMergeTemplateById}
      />
      <ProtectedRoute
        path="/mergeTemplate/title/:id?"
        component={TitlePageContainer}
      />
      <ProtectedRoute
        path="/mergeTemplate/tabSelection"
        component={TabSelectionContainer}
      />
      <ProtectedRoute
        path="/mergeTemplate/headerSelection"
        component={HeaderSelectionContainer}
      />
      <ProtectedRoute
        path="/mergeTemplate/receiverSelection"
        component={ReceiverSelectionContainer}
      />
      <ProtectedRoute
        path="/mergeTemplate/subject"
        component={EmailSubjectContainer}
      />
      <ProtectedRoute
        path="/mergeTemplate/body"
        component={EmailBodyContainer}
      />
      <ProtectedRoute
        path="/mergeTemplate/save"
        component={SavePageContainer}
      />
      <ProtectedRoute path="/counter" component={Counter} />
      <ProtectedRoute
        path="/fetchdata/:startDateIndex?"
        component={FetchData}
      />
    </Layout>
  </Router>
)
