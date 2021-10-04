import React, { Component, Fragment, useEffect, useState, useCallback } from 'react'
import { View, ImageBackground, Image, Modal, ScrollView, Text, TouchableHighlight, RefreshControl, TouchableOpacity, ActivityIndicator, SafeAreaView, FlatList, StyleSheet, Alert, Share } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import AsyncStorage from '@react-native-community/async-storage'

import dynamicLinks from '@react-native-firebase/dynamic-links'

import Header from '../header/header'

import { link } from '../links/links'
import FastImage from 'react-native-fast-image'
import car from '../../assets/car.png'
import ads from '../../assets/ADS.png'

export default function Sellmenu({ navigation }) {
  const [adds, setadds] = useState([])
  const [city, setcity] = useState()
  const [load, setload] = useState(true)
  const [modalloader, setmodalloader] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const select = useSelector((state) => state.cardetails)

  useFocusEffect(
    React.useCallback(() => {
      open()
      return () => true;
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      open()
      setRefreshing(false)
    }, 3000);
  }, []);


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
      fetch(link + '/ad/getAdsByUser?userId=' + val.id, requestOptions)
        .then((response) => response.json())
        .then(async (responseJson) => {
          console.log('responseJso');
          if (responseJson.type === 'success') {
            var val = responseJson.result
            val.reverse()
            setadds(val)
            setload(false)
            setmodalloader(false)
          }
          else {
            alert('Check your Internet Connection')
            setload(false)
            setmodalloader(false)
          }
        }).catch(e => {
          alert('Check your Internet Connection')
          setmodalloader(false)
        })
    } catch (e) {

    }

  }

  const status = async (item, index) => {
    try {
      setmodalloader(true)

      const val = JSON.parse(await AsyncStorage.getItem('token'))

      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + val.token);

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(link + '/ad/changeSoldStatus?adID=' + item._id + '&sold=' + !item.sold, requestOptions)
      open()
    } catch (e) {
      alert('Check your Internet Connection')
      setmodalloader(false)
    }
  }

  const onShare = async (item) => {
    try {
      const link = await dynamicLinks().buildShortLink({
        link: 'https://SCDDY/' + item._id,
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
        'Turn on internet to share'
      )
    }
  }


  const _Flatlist = ({ item, index }) => {
    return (
      <View style={{ height: height(15), width: width(95), marginTop: height(3), alignSelf: 'center', borderWidth: 2, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>

        <FastImage
          source={{
            uri: link + '/' + item.images[0],
            priority: FastImage.priority.high
          }}
          style={{ height: '100%', width: width(45), backgroundColor: 'gray', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }} />

        <View style={{ marginLeft: width(2) }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            <View>

              <Text
                numberOfLines={1}
                style={{ fontSize: totalSize(3.5), width: width(30), fontFamily: 'BebasNeue-Regular' }}>
                {item.title}
              </Text>

              <Text style={{ fontSize: totalSize(2), color: '#931a25', fontFamily: 'BebasNeue-Regular' }}>
                {item.priceCurrency} {item.priceValue}
              </Text>

            </View>

            <TouchableOpacity
              onPress={() => onShare(item)}
            >

              <MaterialIcons name='share' size={30} />

            </TouchableOpacity>

          </View>

          <View style={{ marginTop: height(2), flexDirection: 'row', alignItems: 'center' }}>

            <TouchableOpacity
              onPress={() => navigation.navigate('editadd', { data: item })}
              style={{ height: height(3.5), width: width(20), justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderRadius: 5 }}>

              <Text style={{ fontSize: totalSize(2), fontFamily: 'BebasNeue-Regular' }}>
                edit
              </Text>

            </TouchableOpacity>

            {item.sold == false ?

              <TouchableOpacity
                onPress={() => status(item, index)}
                style={{ height: height(3.5), width: width(20), marginLeft: width(2), justifyContent: 'center', alignItems: 'center', backgroundColor: '#B83C3C', borderWidth: 1.5, borderRadius: 5 }}>

                <Text style={{ fontSize: totalSize(2), color: '#fff', fontFamily: 'BebasNeue-Regular' }}>
                  available
                </Text>

              </TouchableOpacity>


              :
              <TouchableOpacity
                onPress={() => status(item, index)}
                style={{ height: height(3.5), width: width(20), marginLeft: width(2), justifyContent: 'center', alignItems: 'center', backgroundColor: '#219653', borderWidth: 1.5, borderRadius: 5 }}>

                <Text style={{ fontSize: totalSize(2), color: '#fff', fontFamily: 'BebasNeue-Regular' }}>
                  sold
                </Text>

              </TouchableOpacity>

            }

          </View>

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

          <Header text='SELL MENU' back={() => navigation.goBack()} />

          <TouchableHighlight
            underlayColor='#242527'
            onPress={() => navigation.navigate('placeadd')}
            style={{ height: height(7), width: width(85), marginTop: height(4), alignSelf: 'center', borderWidth: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}
          >

            <View
              style={{ height: height(7), width: width(85), alignSelf: 'center', borderWidth: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}
            >

              <Image style={{ height: 25, width: 30 }} source={car} />

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                place an ad
              </Text>

              <View style={{ width: width(10) }} />

            </View>

          </TouchableHighlight>

          {load == true
            ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

              <ActivityIndicator size="large" color="#000" />

            </View>
            :

            adds.length < 1 ?

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <Image style={{ height: 100, width: 80 }} source={ads} />

              </View>

              :
              <ScrollView
                // contentContainerStyle={styles.scrollView}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                <FlatList
                  data={adds}
                  renderItem={_Flatlist}
                />
              </ScrollView>
          }

          <Modal
            animationType={'fade'}
            transparent={true}
            visible={modalloader}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size='large' color='#fff' />
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