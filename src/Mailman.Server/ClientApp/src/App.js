import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Settings from './components/Settings'
import AddMergeTemplate from './components/AddMergeTemplate'
import Counter from './components/Counter';
import FetchData from './components/FetchData';

export default () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/settings' component={Settings} />
    <Route path='/addMergeTemplate' component={AddMergeTemplate} />
    <Route path='/counter' component={Counter} />
    <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
  </Layout>
);
