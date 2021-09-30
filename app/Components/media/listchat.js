import React, { Component, Fragment, useEffect, useRef, useState } from 'react'
import { View, ImageBackground, Image, Text, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StyleSheet, Modal } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'
import { useFocusEffect } from '@react-navigation/native'

import Header from '../header/header'

import { link } from '../links/links'
import Loader from '../loader/loader'

import AsyncStorage from '@react-native-community/async-storage'

import moment from 'moment-timezone'


export default function Chat({ navigation }) {
  const [list, setlist] = useState([])
  const [loader, setloader] = useState(true)
  const [user, setuser] = useState('')

  useFocusEffect(
    React.useCallback(() => {
      open()
      return () => true;
    }, [])
  );

  const open = async () => {

    const val = JSON.parse(await AsyncStorage.getItem('token'))

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + val.token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    try {

      fetch(link + '/room/getRooms?userId=' + val.id, requestOptions)
        .then((response) => response.json())
        .then(async (responseJson) => {

          console.log('tttttrrrrr', responseJson.result)

          if (responseJson.type === 'success') {
            setlist(responseJson.result)
            setuser(val)
            setloader(false)
          }

        }).catch((e) => {
          console.log(e);
          setloader(false)
        })

    }
    catch (e) {
      console.log(e)
      setloader(false)
    }
  }

  const getOtherUserObject = (users) => {
    if (users[0]._id === user.id) {
      return users[1];
    } else {
      return users[0];
    }
  }

  const _Flatlist = ({ item }) => {
    { console.log('lklklklklklklkl', item) }
    return (

      <TouchableOpacity
        onPress={() => navigation.navigate('chat', {
          data: item,
          name: getOtherUserObject(item.users).name,
          title:item.titleAd,
          room: true,
          user: false,
          profileflag: true
        })}
        style={{ height: height(12), width: '100%', borderBottomWidth: 1, justifyContent: 'center' }}>

        <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

          <Image
            source={item.users ? { uri: link + '/' + getOtherUserObject(item.users).image } : ''}
            style={{ height: 50, width: 50, borderRadius: 25 }}
          />

          <View style={{ width: '60%', marginLeft: width(2) }}>
<View style={{
  flexDirection:'row',
  // justifyContent:'space-around',
  alignItems:'center',
  // justifyContent:'center'
}}>
            <Text style={{ fontSize: totalSize(3.5), fontFamily: 'BebasNeue-Regular', }}>

              {item.users ? getOtherUserObject(item.users).name : item.name} 
            </Text>
            {
              item.titleAd ?
            
            <Text style={{
              left:10
            }}>---</Text>
            :
            null
            }
            <Text style={{
                fontSize:totalSize(2.5), fontFamily: 'BebasNeue-Regular' ,left:width(5),
              }}>{item.titleAd} </Text>
           
</View>
            <Text
              numberOfLines={1}
              style={{ fontSize: totalSize(2) }}>

              {item.lastMessage.text}

            </Text>

          </View>

          <Text style={{ fontSize: totalSize(2), color: '#aaa' }}>

            {moment(item.lastMessage.createdAt).format('hh:mm a').toUpperCase()}

          </Text>

        </View>

      </TouchableOpacity>
    )
  }

  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <View style={{ flex: 1 }}>

          <Header text='MESSAGE'
            back={() => navigation.goBack()}
          />

          {loader == true ?

            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fff' }}>


              <Loader
                color='#000'
              />

            </View>

            : list.length > 0 ?

              <FlatList
                data={list}
                renderItem={_Flatlist}
              />

              :
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>

                <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                  let's start new conversation
                </Text>

              </View>
          }

        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('groupstack')}

          style={{
            borderWidth: 1, width: 60,
            height: 60,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end',
            marginRight: 15,
            bottom: height(8),
            backgroundColor: '#000',
            position: 'absolute',
            zIndex: 1

          }}>
          <Text style={{
            color: '#fff',
            textAlign: 'center'
          }}>
            Group chat
          </Text>
        </TouchableOpacity>

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