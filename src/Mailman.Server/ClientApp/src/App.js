import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Settings from './components/Settings';
import { TitlePageContainer } from './components/CreateMerge/TitlePageContainer';
import { TabSelectionContainer } from './components/CreateMerge/TabSelectionContainer';
import { HeaderSelectionContainer } from './components/CreateMerge/HeaderSelectionContainer'
import Counter from './components/Counter';
import FetchData from './components/FetchData';

export default () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/settings' component={Settings} />
    <Route path='/mergeTemplate/title/:id?' component={TitlePageContainer} />
    <Route path='/mergeTemplate/tabSelection' component={TabSelectionContainer} />
    <Route path='/mergeTemplate/headerSelection' component={HeaderSelectionContainer} />
    <Route path='/counter' component={Counter} />
    <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
  </Layout>
);
