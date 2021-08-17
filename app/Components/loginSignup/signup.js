import React, { Component, Fragment, useEffect, useState } from 'react'
import { View, ImageBackground, Image, Text, TouchableOpacity, TouchableHighlight, TextInput, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import { link } from '../links/links'

import splas from '../../assets/splash1.png'
import facebook from '../../assets/facebook.png'
import goole from '../../assets/google.png'

export default function Signup({ navigation }) {
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [cpassword, setcpassword] = useState('')
  const [spassword, setspassword] = useState(false)

  const signup = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email !== '' && password != '' && name != '' && cpassword != '') {
      if (reg.test(email) === true) {

        if (password == cpassword) {
          let data = { name: name, email: email.toLowerCase(), password: password }
          try {
            fetch(link + '/user/signup', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
              .then((response) => response.json())
              .then((Data) => {
                if (Data.type == 'failure') {
                  alert(Data.result)
                }
                else {
                  alert(Data.result)
                  navigation.goBack()
                }

              })
              .catch((err) => {
                console.log("Error" + err);
              })
          } catch (error) {
            alert('two' + error)
          }

        }
        else {
          alert('Password not match')
        }
      }
      else {
        alert('Invalid Email')
      }
    }
    else {
      alert('Please fill all fields')
    }
  }


  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <ScrollView style={{ flex: 1 }}>

          <ImageBackground style={{ height: 140, width: 180, marginTop: height(3), alignSelf: 'center' }} source={splas}>

          </ImageBackground>

          <View style={{ width: width(80), alignSelf: 'center' }}>

            <TextInput
              onChangeText={(text) => setname(text)}
              placeholder='NAME'
              style={{ width: width(80), marginTop: height(7), fontSize: totalSize(2.5), borderWidth: 1, borderRadius: 5 }}
            />

            <TextInput
              onChangeText={(text) => setemail(text)}
              placeholder='EMAIL'
              style={{ width: width(80), marginTop: height(2), fontSize: totalSize(2.5), borderWidth: 1, borderRadius: 5 }}
            />

            <TextInput
              // onChangeText={(text) => {if(text.length>0){setspassword(true)}
              // else{setspassword(false)}
              //   setpassword(text)}}
              onChangeText={(text) => setpassword(text)}
              secureTextEntry={true}
              placeholder='PASSWORD'
              style={{ width: width(80), marginTop: height(2), fontSize: totalSize(2.5), borderWidth: 1, borderRadius: 5 }}
            />

            <TextInput
              // onChangeText={(text) => {if(text.length>0){setspassword(true)}
              // else{setspassword(false)}
              //   setcpassword(text)}}
              onChangeText={(text) => setcpassword(text)}
              secureTextEntry={true}
              placeholder='CONFIRM PASSWORD'
              style={{ width: width(80), marginTop: height(2), fontSize: totalSize(2.5), borderWidth: 1, borderRadius: 5 }}
            />

            <TouchableHighlight
              onPress={() => signup()}
              underlayColor='#242527'
              style={{
                height: height(5), width: width(40), marginTop: height(5), alignSelf: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#fabb47', borderRadius: 5, justifyContent: 'center'
              }}
            >

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#fabb47', alignSelf: 'center' }}>
                sign up
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

          <View style={{ height: height(10) }} />

        </ScrollView>

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