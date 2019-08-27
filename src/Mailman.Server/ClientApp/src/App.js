import React from 'react'
import { Route } from 'react-router'
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
import Counter from './components/Counter'
import FetchData from './components/FetchData'

export default () => (
  <Layout>
    <Route exact path="/" component={Home} />
    <Route path="/settings" component={Settings} />
    <Route path="/mergeTemplate/title/:id?" component={TitlePageContainer} />
    <Route
      path="/mergeTemplate/tabSelection"
      component={TabSelectionContainer}
    />
    <Route
      path="/mergeTemplate/headerSelection"
      component={HeaderSelectionContainer}
    />
    <Route
      path="/mergeTemplate/receiverSelection"
      component={ReceiverSelectionContainer}
    />
    <Route path="/mergeTemplate/subject" component={EmailSubjectContainer} />
    <Route path="/mergeTemplate/body" component={EmailBodyContainer} />
    <Route path="/mergeTemplate/save" component={SavePageContainer} />
    <Route path="/counter" component={Counter} />
    <Route path="/fetchdata/:startDateIndex?" component={FetchData} />
  </Layout>
)
