import React, { Component, Fragment, useContext, useState, useEffect } from 'react'
import { View, ImageBackground, AppState, Text, Image, TouchableHighlight, TouchableOpacity, SafeAreaView, StyleSheet, Alert, Share, Modal } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import AsyncStorage from '@react-native-community/async-storage'

import { Authcontext } from '../context/context'

import { socket } from '../socket/socket'

import { link } from '../links/links'
import Loader from '../loader/loader'

import dynamicLinks from '@react-native-firebase/dynamic-links';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import splas from '../../assets/splash.png'
import { useDispatch, useSelector } from 'react-redux'
import { socketConnection } from '../Store/actiontype'
import { socketF, userP } from '../Store/action'

import { dylinkF } from '../Store/action'

export default function Home({ navigation }) {
  const { logout } = useContext(Authcontext)
  const dispatch = useDispatch()
  const socketClose = useSelector((state) => state.socket)
  const [loader, setloader] = useState(false)
  const dylink = useSelector((state) => state.dyL)
  const userProfile = useSelector((state) => state.user)
  const reload = useSelector((state) => state.reload)


  const authlogout = async () => {
    await AsyncStorage.removeItem('token')
    await AsyncStorage.setItem('IsSignedIn', 'false').then(() => {

      socketClose.close()

      logout()

    })
    Alert.alert(
      'Sawari',
      'Logout Successfully'
    )
  }

  useEffect(() => {

  }, [reload])

  useEffect(() => {

    AppState.addEventListener('change', handle)

    open()

    return (() => {
      console.log('removed')
      AppState.removeEventListener('change', handle)
    })

  }, [])

  const handle = (e) => {
    if (e === 'active') {
      console.log(dylink)
    }
  }

  const open = async () => {

    try {

      let val = JSON.parse(await AsyncStorage.getItem('token'))

      dyOpen(val)

      dispatch(userP(val))

      const s = socket(val.id, val.token)

      dispatch(socketF(s))

      s.on("connect_error", (err) => {
        console.log(err.message);
      });

    }
    catch (e) {
      console.log(e)
    }

  }

  const dyOpen = async (val) => {

    let apiLink = ''

    try {

      const l = await dynamicLinks().getInitialLink()
      const li = l.url.split('/')

      console.log(li)

      if (li[li.length - 2] == 'SCDDY' && dylink != li[li.length - 1]) {
        apiLink = '/ad/getAd'
        setloader(true)
        dynamicAds(apiLink, val, li)
      }
      else if (li[li.length - 2] == 'RSCDDY' && dylink != li[li.length - 1]) {
        apiLink = '/rent/getRent'
        setloader(true)
        dynamicAds(apiLink, val, li)
      }

      // navigation.navigate(link[link.length - 2], {
      //   data: link[link.length - 1]
      // })

    } catch (e) {
      console.log(e)
    }

  }

  const dynamicAds = async (apiLink, val, li) => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + val.token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    try {

      fetch(link + apiLink + '?Id=' + li[li.length - 1], requestOptions)
        .then((response) => response.json())
        .then(async (responseJson) => {

          setloader(false)

          if (responseJson.type === 'success') {
            dispatch(dylinkF(li[li.length - 1]))
            navigation.navigate(li[li.length - 2], {
              data: responseJson.result
            })
            setTimeout(() => {
              console.log(dylink)
            }, 500);
          }
          // console.log(li[li.length - 1])

        })
        .catch((e) => {
          console.log(e)
          setloader(false)
        })

    } catch (e) {
      console.log(e)
      setloader(false)
    }

  }

  const onShare = async () => {

    try {

      const link = await dynamicLinks().buildShortLink({
        link: 'https://user/123',
        domainUriPrefix: 'https://sawario.page.link',
        android: {
          packageName: 'com.sawario',
        }

      }, dynamicLinks.ShortLinkType.SHORT);

      console.log(link)

      const result = await Share.share({
        message:
          link,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(
        'Network',
        'Turn on internet to share app'
      )
    }

  }


  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <View style={{ flex: 1 }}>

          <ImageBackground style={{ height: 120, width: 150, alignSelf: 'center', marginTop: height(4) }} source={splas}>

          </ImageBackground>

          <View style={{ height: height(6), width: width(90), flexDirection: 'row', justifyContent: 'space-between', marginTop: height(2), alignSelf: 'center', position: 'absolute' }}>

            <TouchableOpacity
              onPress={() => navigation.navigate('myProfile')}
            >

              <Image
                source={{ uri: link + '/' + userProfile.userDetails.image }}
                style={{ height: 40, width: 40, borderRadius: 20, borderWidth: 1, borderColor: '#FFBB41' }}
              />

            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onShare()}
            // style={{ borderWidth: 1, borderRadius: 3 }}
            >

              <MaterialCommunityIcons name='share' size={35} style={{ paddingHorizontal: 7 }} />

            </TouchableOpacity>

          </View>


          <View style={{ width: width(90), alignSelf: 'center' }}>

            <TouchableHighlight
              underlayColor='#242527'
              onPress={() => navigation.navigate('buymenu')}
              style={{ height: height(7), marginTop: height(4), borderRadius: 5, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}
            >

              <Text style={{ fontSize: totalSize(4), fontFamily: 'BebasNeue-Regular' }}>
                BUY
            </Text>

            </TouchableHighlight>

            <TouchableHighlight
              underlayColor='#242527'
              onPress={() => navigation.navigate('sellmenu')}
              style={{ height: height(7), marginTop: height(4), borderRadius: 5, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}
            >

              <Text style={{ fontSize: totalSize(4), fontFamily: 'BebasNeue-Regular' }}>
                SELL
            </Text>

            </TouchableHighlight>

            <TouchableHighlight
              underlayColor='#242527'
              onPress={() => navigation.navigate('rmenu')}
              style={{ height: height(7), marginTop: height(4), borderRadius: 5, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}
            >

              <Text style={{ fontSize: totalSize(4), fontFamily: 'BebasNeue-Regular' }}>
                RENT
            </Text>

            </TouchableHighlight>

            <TouchableHighlight
              underlayColor='#242527'
              onPress={() => navigation.navigate('romenu')}
              style={{ height: height(7), marginTop: height(4), borderRadius: 5, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}
            >

              <Text style={{ fontSize: totalSize(4), fontFamily: 'BebasNeue-Regular' }}>
                RENT OUT
            </Text>

            </TouchableHighlight>

            <TouchableHighlight
              underlayColor='#242527'
              onPress={() => navigation.navigate('Nfeed')}
              style={{ height: height(7), marginTop: height(4), borderRadius: 5, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}
            >

              <Text style={{ fontSize: totalSize(4), fontFamily: 'BebasNeue-Regular' }}>
                social media
            </Text>

            </TouchableHighlight>

            <TouchableOpacity
              onPress={() => authlogout()}
              underlayColor='#242527'
              style={{ height: height(7), width: width(35), marginTop: height(8), backgroundColor: '#232526', alignSelf: 'center', borderRadius: 5, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}
            >

              <Text style={{ fontSize: totalSize(4), color: '#FFBB41', fontFamily: 'BebasNeue-Regular' }}>
                logout
            </Text>

            </TouchableOpacity>

          </View>

          <Modal
            animationType={'fade'}
            transparent={true}
            visible={loader}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
              <Loader
                color='#fff'
              />
            </View>

          </Modal>

        </View>

      </SafeAreaView>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  }
})