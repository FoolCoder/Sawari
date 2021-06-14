import React, { useEffect, useMemo, useState } from 'react'
import { LayoutAnimation, UIManager, Platform, LogBox, AppState } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import { Authcontext } from '../context/context'

import AsyncStorage from '@react-native-community/async-storage'

import { Provider } from 'react-redux'
import { store } from '../Store/store'

import Splash from '../Splash/Splash'

import Fhome from '../home/Fhome'
import login from '../loginSignup/login'
import signup from '../loginSignup/signup'

import homeS from '../home/home'
import myProfile from '../Profile/Profile'
import buymenu from '../buymenu/newbuymenu'
import sellmenu from '../sellmenu/sellmenu'
import editadd from '../sellmenu/editadd'
import placeadd from '../sellmenu/placeadd'
import carslist from '../buymenu/carslist'
import selectedcardetails from '../buymenu/selectedcardetails'

import rentmenu from '../rentmenu/rentmenu'
import rentoutmenu from '../rentoutmenu/rentoutmenu'
import renteditadd from '../rentoutmenu/renteditadd'
import rentcarslist from '../rentmenu/rentcarslist'
import rentoutplaceadd from '../rentoutmenu/rentoutplaceadd'
import rentselectedcardetails from '../rentmenu/rentselectedcardetails'

import Nfeed from '../media/newsFeed'
import profile from '../media/profile'
import userProfile from '../media/userProfile'
import editprofile from '../media/editprofile'
import searchchat from '../media/searchchat'
import listchat from '../media/listchat'
import chat from '../media/chat'

LogBox.ignoreAllLogs()

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const loginStack = createStackNavigator()
const home = createStackNavigator()
const chatStack = createStackNavigator()

const LoginScreen = () => (
  <loginStack.Navigator headerMode='none'>
    <loginStack.Screen name='Fhome' component={Fhome} />

    <loginStack.Screen name='SCDDY' component={selectedcardetails} />
    <loginStack.Screen name='RSCDDY' component={rentselectedcardetails} />

    <loginStack.Screen name='login' component={login} />
    <loginStack.Screen name='signup' component={signup} />

    <loginStack.Screen name='buymenu' component={buymenu} />
    <loginStack.Screen name='carslist' component={carslist} />
    <loginStack.Screen name='SCD' component={selectedcardetails} />

    <loginStack.Screen name='rmenu' component={rentmenu} />
    <loginStack.Screen name='rcarslist' component={rentcarslist} />
    <loginStack.Screen name='RSCD' component={rentselectedcardetails} />

  </loginStack.Navigator>
)

const HomeScreen = () => {
  return (
    <home.Navigator headerMode='none'>
      <home.Screen name='home' component={homeS} />
      <home.Screen name='myProfile' component={myProfile} />

      <home.Screen name='SCDDY' component={selectedcardetails} />
      <home.Screen name='RSCDDY' component={rentselectedcardetails} />

      <home.Screen name='buymenu' component={buymenu} />
      <home.Screen name='carslist' component={carslist} />

      <home.Screen name='sellmenu' component={sellmenu} />
      <home.Screen name='placeadd' component={placeadd} />
      <home.Screen name='editadd' component={editadd} />

      <home.Screen name='SCD' component={selectedcardetails} />

      <home.Screen name='rmenu' component={rentmenu} />

      <home.Screen name='roeditadd' component={renteditadd} />

      <home.Screen name='rcarslist' component={rentcarslist} />

      <home.Screen name='romenu' component={rentoutmenu} />
      <home.Screen name='roplaceadd' component={rentoutplaceadd} />

      <home.Screen name='RSCD' component={rentselectedcardetails} />

      <home.Screen name='Nfeed' component={Nfeed} />
      <home.Screen name='profile' component={profile} />
      <home.Screen name='uProfile' component={userProfile} />
      <home.Screen name='editprofile' component={editprofile} />
      <home.Screen name='searchchat' component={searchchat} />
      <home.Screen name='chatStack' component={ChatScreen} />

    </home.Navigator>

  )
}

const ChatScreen = () => {
  return (
    <chatStack.Navigator headerMode='none' initialRouteName='listchat'>
      <home.Screen name='listchat' component={listchat} />
      <home.Screen name='chat' component={chat} />
    </chatStack.Navigator>
  )
}

function Navigation() {
  const [IsSignedIn, setIsSignedIn] = useState(false)
  const [IsSplash, setIsSplash] = useState(true)

  useEffect(() => {

    check()

  }, [])

  async function check() {

    const val = await AsyncStorage.getItem('IsSignedIn')

    setTimeout(() => {

      if (val == 'true') {
        setIsSignedIn(true)
      }
      else {
        setIsSignedIn(false)
      }
      setIsSplash(false)
    }, 3000);

  }

  const auth = React.useMemo(() => ({
    login: () => {
      setIsSignedIn(true)
    },
    logout: () => {
      setIsSignedIn(false)
    }
  }), []);

  LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)

  if (IsSplash) {
    return (
      <Splash />
    )
  }
  else {

    return (
      <Authcontext.Provider value={auth}>

        <NavigationContainer>
          {
            !IsSignedIn ? (
              <LoginScreen />
            )
              : (
                <HomeScreen />
              )
          }

        </NavigationContainer>

      </Authcontext.Provider>
    )
  }
}

const redux = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  )
}

export default redux;