import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Settings from './components/Settings'
import { EditMergeTemplateById } from './components/merge-template/EditMergeTemplate'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

export default () => (
  <Router>
    <Layout>
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute path="/settings" component={Settings} />
      <Route path="/login" component={Login} />
      <ProtectedRoute
        path="/mergeTemplate/:id?"
        component={EditMergeTemplateById}
      />
    </Layout>
  </Router>
)
