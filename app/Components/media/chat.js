import React, { Component, Fragment, useEffect, useRef, useState } from 'react'
import { View, ImageBackground, Image, Text, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StyleSheet, Modal, Alert } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import Header from '../header/header'

import AsyncStorage from '@react-native-community/async-storage'

import { link } from '../links/links'
import Loader from '../loader/loader'

import addimage from '../../assets/image-add.png'
import firstarrow from '../../assets/firstarrow.png'
import secarrow from '../../assets/secarrow.png'
import { useSelector } from 'react-redux'

var chatLocal = []
let r = ''
let c = ''

export default function Chat({ navigation, route }) {
  const [load, setload] = useState(true)
  const [chat, setchat] = useState([])
  const [message, setmessage] = useState('')
  const [room, setroom] = useState('')
  const [user, setuser] = useState('')
  const [chatUser, setchatUser] = useState('')

  const socket = useSelector((state) => state.socket)


  useEffect(() => {

    open()

    return (() => {
      socket.removeAllListeners()
    })

  }, [])

  const open = async () => {

    chatLocal = []
    r = ''
    c = ''

    try {

      let val = JSON.parse(await AsyncStorage.getItem('token'))

      setchatUser(route.params.data)
      c = route.params.data

      setuser(val)

      try {
        if (route.params.room == null) {
          setroom(route.params.room)
          r = route.params.room
        }
        else {
          setroom(route.params.room[0]._id)
          r = route.params.room[0]._id
        }
      }
      catch (e) {
        console.log(e)
      }

      console.log('rrrrr', r, 'cccccccccc', c)

      apiCall(val)

      socket.on('messageRecieved', (data) => {

        if (r == data.message.room || c._id == data.message.room) {

          if (data.received == true) {

            chatLocal = [data.message, ...chatLocal]

            setchat(chatLocal)

          }
        }

      })

      socket.on('messageSentAck', (data) => {
        console.log(data)

        if (data.sent == true) {
          try {
            if (route.params.room == null) {
              route.params.roomF(data.message.room)
            }
          }
          catch (e) {
            console.log(e)
          }

          setroom(data.message.room)

          chatLocal = [data.message, ...chatLocal]

          setchat(chatLocal)

        }
        else {
          Alert.alert(
            'Message',
            'Failed to send message'
          )
        }
      })

    }
    catch (e) {
      console.log(e)
    }
  }

  const apiCall = (val) => {

    if (route.params.room != null) {

      console.log(route.params.room)

      let api = ''

      if (route.params.user == false) {
        api = route.params.data._id
      }
      else {
        api = route.params.room[0]._id
      }

      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + val.token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      try {

        fetch(link + '/room/getRoom?roomId=' + api, requestOptions)
          .then((response) => response.json())
          .then(async (responseJson) => {

            // console.log(responseJson.result)

            if (responseJson.type === 'success') {
              chatLocal = responseJson.result
              setchat(responseJson.result)
              setload(false)

            }

          }).catch((e) => {
            console.log(e);
          })

      }
      catch (e) {
        console.log(e)
      }

    }
    else {
      setload(false)
    }

  }

  const sendMessage = () => {

    if (message !== '') {

      try {

        var data = {}
        if (route.params.user == false) {
          data = {
            room:
            {
              group: false,
              name: null,
              users: [user.id, chatUser.users[1]._id]    // Your ID and Other User ID .......... if Group Only Your ID
            },
            message: {
              author: user.id,
              room: chatUser._id,
              text: message,
              attachments: null
            }
          }
        }
        else {
          data = {
            room:
            {
              group: false,
              name: null,
              users: [user.id, route.params.data.user._id]    // Your ID and Other User ID .......... if Group Only Your ID
            },
            message: {
              author: user.id,
              room: room,
              text: message,
              attachments: null
            }
          }
        }

        socket.emit('sendMessage', data)

        setmessage('')

      }
      catch (e) {
        console.log(e)
      }

    }
    else {
      Alert.alert(
        'Message',
        'Write something'
      )
    }

  }

  const _Flatlist = ({ item }) => {
    return (
      user.id !== item.author._id ?

        <View style={{ width: width(95), alignSelf: 'center', flexDirection: 'row', marginTop: height(4) }}>

          <Image
            source={{ uri: link + '/' + item.author.image }}
            style={{ height: 40, width: 40, marginRight: width(2), borderRadius: 20 }}
          />

          <Image
            source={firstarrow}
            style={{ height: 30, width: 50, marginRight: -40, zIndex: -1 }}
          />

          <View style={{ maxWidth: width(60), borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffbb41' }}>

            <Text style={{ fontSize: totalSize(2.3), padding: 10 }}>
              {item.text}
            </Text>

          </View>

        </View>


        :
        <View style={{ width: width(95), alignSelf: 'center', marginTop: height(4) }}>

          <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>

            <View style={{ maxWidth: width(60), borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#c9cbcc' }}>

              <Text style={{ fontSize: totalSize(2.3), padding: 10 }}>
                {item.text}
              </Text>

            </View>

            <Image
              source={secarrow}
              style={{ height: 30, width: 30, marginLeft: -20, zIndex: -1 }}
            />

            <Image
              source={{ uri: link + '/' + item.author.image }}
              style={{ height: 40, width: 40, marginLeft: width(2), borderRadius: 20 }}
            />

          </View>

        </View>
    )
  }

  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <View style={{ flex: 1 }}>

          <Header
            text={route.params.name}
            back={() => navigation.goBack()}
          />

          {load == true ?

            <View style={{ flex: 1, justifyContent: 'center' }}>

              <Loader
                color='#000'
              />
            </View>

            :
            <FlatList
              data={chat}
              inverted
              keyExtractor={(item, index) => { return index.toString() }}
              renderItem={_Flatlist}
            />

          }

          <View style={{
            width: width(95), marginVertical: height(1),
            borderRadius: 5, alignSelf: 'center', flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center'

          }}>

            <TouchableOpacity
              onPress={() => alert('this is imag picker')}
            >

              <Image
                source={addimage}
                style={{ height: 40, width: 40 }}
              />

            </TouchableOpacity>

            <View style={{ backgroundColor: '#d9d9d9', borderRadius: 5 }}>

              <TextInput
                placeholder='Send The message'
                multiline
                value={message}
                onChangeText={(text) => setmessage(text)}
                style={{ maxHeight: height(20), width: width(68), fontSize: totalSize(2.2) }}
              />

            </View>

            <TouchableOpacity
              onPress={() => sendMessage()}
              style={{ borderRadius: 50, backgroundColor: '#ffbb41' }}
            >

              <MaterialIcons name='send' size={25} style={{ padding: 12 }} />

            </TouchableOpacity>

          </View>

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