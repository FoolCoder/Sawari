/**
 * @format
 */

import React from 'react'
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import Navigation from './app/Components/Navigation/Navigation'
import ed from './app/Components/media/editprofile'
import messaging from '@react-native-firebase/messaging'
import dynamicLinks from '@react-native-firebase/dynamic-links'

import test1 from './test1'
import redux from './app/Components/Navigation/Navigation';

const Redux = () => {
  return (
    <Navigation />
  )
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => Redux);
