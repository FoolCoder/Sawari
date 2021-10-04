import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import { View, ImageBackground, Image, Text, TouchableOpacity, TouchableHighlight, TextInput, SafeAreaView, StyleSheet, Modal } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import AsyncStorage from '@react-native-community/async-storage'
import message from '@react-native-firebase/messaging'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { link } from '../links/links'
import { Authcontext } from '../context/context'
import Loader from '../loader/loader'

import splas from '../../assets/splash1.png'
import facebook from '../../assets/facebook.png'
import goole from '../../assets/google.png'

export default function Login({ navigation }) {
  const [loader, setloader] = useState(false)
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [spassword, setspassword] = useState(false)
  const { login } = useContext(Authcontext)


  const log = async () => {
    if (email !== '' && password != '') {

      let fcm = await message().getToken()

      setloader(true)
      try {
        fetch(link + '/user/signin?email=' + email.toLowerCase() + '&password=' + password + '&fcmToken=' + fcm)
          .then((response) => response.json())
          .then(async (responseJson) => {

            setloader(false)
            // console.log(responseJson);
            if (responseJson.type === 'success') {
              // console.log(responseJson)
              const val = responseJson
              console.log(val);
              await AsyncStorage.setItem('token', JSON.stringify(val))
              await AsyncStorage.setItem('IsSignedIn', 'true').then(() => {
                login()
              })

            }
            else {
              alert('Email or Password not exist')
            }
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
    else {
      alert('Please fill all fields')
    }
    // login()
  }

  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <View style={{ flex: 1 }}>

          <ImageBackground style={{ height: 140, width: 180, marginTop: height(3), alignSelf: 'center' }} source={splas}>

          </ImageBackground>

          <View style={{ width: width(80), alignSelf: 'center' }}>

            <TextInput
              onChangeText={(text) => setemail(text)}
              placeholder='EMAIL'
              style={{ width: width(80), marginTop: height(10), fontSize: totalSize(2.5), borderWidth: 1, borderRadius: 5 }}
            />

            <TextInput
              // onChangeText={(text)=>{if(text.length>0){setspassword(true)}
              //   else{setspassword(false)}
              //   setpassword(text)}}
              onChangeText={(text) => setpassword(text)}
              secureTextEntry={true}
              placeholder='PASSWORD'
              style={{ width: width(80), marginTop: height(2), fontSize: totalSize(2.5), borderWidth: 1, borderRadius: 5 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <TouchableOpacity
              >

                <Text style={{ fontSize: totalSize(2.5), color: '#898', fontFamily: 'BebasNeue-Regular' }}>

                  forget password

                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('signup')}
              >

                <Text style={{ fontSize: totalSize(2.5), color: '#898', fontFamily: 'BebasNeue-Regular' }}>

                  sign up

                </Text>

              </TouchableOpacity>

            </View>


            <TouchableHighlight
              onPress={() => log()}
              underlayColor='#242527'
              style={{
                height: height(5), width: width(40), marginTop: height(5), alignSelf: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#fabb47', borderRadius: 5, justifyContent: 'center'
              }}
            >

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#fabb47', alignSelf: 'center' }}>
                login
              </Text>

            </TouchableHighlight>

            <Text style={{ fontSize: totalSize(2.5), marginTop: height(4), alignSelf: 'center', color: '#898', fontFamily: 'BebasNeue-Regular' }}>
              or login using
            </Text>

            <View style={{ width: width(50), marginTop: height(2), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

              <TouchableOpacity
                // onPress={() => this.facebook()}
                style={{ padding: 10, borderRadius: 30, backgroundColor: '#597099', justifyContent: 'center' }}
              >
                <Image
                  style={{ height: 30, width: 30, alignSelf: 'center' }}
                  source={facebook}
                />

              </TouchableOpacity>

              <View style={{ width: width(5) }} />

              <TouchableOpacity
                // onPress={() => this.google()}
                style={{ padding: 10, borderRadius: 30, backgroundColor: '#be5153', justifyContent: 'center' }}
              >
                <Image
                  style={{ height: 30, width: 30, alignSelf: 'center' }}
                  source={goole}
                />

              </TouchableOpacity>

            </View>

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