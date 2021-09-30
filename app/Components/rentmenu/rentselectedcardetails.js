import React, { Component, Fragment, useEffect, useState } from 'react'
import { View, ImageBackground, Image, Text, TouchableHighlight, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StyleSheet, Modal, Platform, Linking, Alert, Share } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'
import { useDispatch, useSelector } from 'react-redux'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import AsyncStorage from '@react-native-community/async-storage'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps'
import { Pages } from 'react-native-pages'
import { newsFeedR } from '../Store/action'

import Header from '../header/header'

import { link } from '../links/links'
import Loader from '../loader/loader'
import chat from '../../assets/chatt.png'
import car from '../../assets/car.png'
import ads from '../../assets/ADS.png'
import { set } from 'react-native-reanimated'

export default function Rsellmenu({ navigation, route }) {
  const [loader, setloader] = useState(true)
  const [item, setitem] = useState([])
  const [visible, setvisible] = useState(false)
  const [pic, setpic] = useState('')
  const [ownerD, setownerD] = useState(false)
  const [room, setroom] = useState('')
  const [chatDisable, setchatDisable] = useState(false)
  const [chatBColor, setchatBColor] = useState('#000')
  const [favour, setfavour] = useState()
  const reload = useSelector((state) => state.reload)
  const [flagState, setFlagState] = useState(false)
  const [user, setuser] = useState('')

  useEffect(() => {
    try {

      setitem(route.params.data)

      setfavour(route.params.data.isfavourite)
      console.log('iiiiiiiiiiiiuuuuuuuu', route.params.data.user[0]._id)


      open()

    } catch (e) {
      // console.log(e);
    }
  }, [])

  const open = async () => {
    try {
      const val = JSON.parse(await AsyncStorage.getItem('token'))

      setuser(val)
      // const val = JSON.parse(await AsyncStorage.getItem('token'))

      if (val.id == route.params.data.user[0]._id) {
        setchatDisable(true)
        setchatBColor('#ccc')
      }

      if (val.token == 'guest') {
        setchatDisable(true)
        setchatBColor('#ccc')
      }

      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + val.token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(link + '/room/checkRoom?userId=' + val.id + '&otherUserId=' + route.params.data.user[0]._id + '&titleAd='+ route.params.data.title , requestOptions)
        .then(response => response.json())
        .then(response => {

          if (response.type === 'success') {
            console.log(response)
            setroom(response.result)
            setloader(false)
          }

        })
        .catch((e) => {
          console.log(e)
          setloader(false)
          setchatDisable(true)
          setchatBColor('#ccc')
        })

    } catch (e) {
      console.log(e)
      setloader(false)
      setchatDisable(true)
      setchatBColor('#ccc')
    }
  }
  const Favourite = (item) => {
    try {

      let api = ''

      // console.log('dddddddd', item)

      if (item.isfavourite == false) {
        api = '/rent/makeFavourite?userId=' + user.id + '&rentId=' + item._id
      } else if (item.isfavourite == true) {
        api = '/rent/removeFavourite?userId=' + user.id + '&rentId=' + item._id
      }
      console.log(api)
      setFlagState(!flagState)

      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + user.token);

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(link + api, requestOptions)
        .then((response) => response.json())
        .then(async (responseJson) => {
          console.log('respooooone', responseJson)
          if (responseJson.type == 'success') {

            setfavour(!favour)

            dispatch(newsFeedR(!reload))

            if (route.params.reloadF) {
              route.params.reloadF()
            }
          }
        })
        .catch((e) => {
          console.log(e)
        })

    }
    catch (e) {
      console.log(e);
    }
  }
  const roomFunc = (val) => {
    let data = [{ _id: val }]
    setroom(data)
  }
  const email = () => {
    let email = item.email
    Linking.openURL(`mailto:${email}`)
  }
  const showpic = (item) => {
    setpic(item)
    setvisible(true)
  }

  const dialCall = () => {

    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${' + item.phone + '}';
    }
    else {
      phoneNumber = 'telprompt:${' + item.phone + '}';
    }

    Linking.openURL(phoneNumber);
  };

  const sms = () => {
    let plat = Platform.OS === 'ios' ? '&' : '?'
    let phoneNumber = 'sms:' + item.phone + plat
    Linking.openURL(phoneNumber)
  }

  const onShare = async () => {
    console.log('iiiiiittttem', item);
    try {
      const link = await dynamicLinks().buildShortLink({
        link: 'https://RSCDDY/' + item._id,
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

  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <ScrollView style={{ flex: 1 }}>

          <Header text='RENT MENU' back={() => navigation.goBack()} />

          {item.length < 1
            ? null
            :
            <View style={{ height: height(27) }}>

              <Pages
                indicatorColor='#000'
              >
                {item.images.map((i, index) => {
                  if (index == 0) {
                    return (

                      <TouchableOpacity
                        onPress={() => showpic(i)}
                      >

                        <ImageBackground
                          source={{ uri: link + '/' + i }}
                          style={{
                            height: height(20), width: width(90)
                            , justifyContent: 'center', alignItems: 'center', marginTop: height(3), backgroundColor: 'gray', alignSelf: 'center', borderRadius: 10
                          }}
                          imageStyle={{ borderRadius: 10 }}
                        >
                          {/* 
                          <Text style={{ fontSize: totalSize(8), fontFamily: 'BebasNeue-Regular', color: '#60f159' }}>
                            {item.priceCurrency} {item.priceValue} {item.rentType}
                          </Text>

                          <Text style={{ fontSize: totalSize(8), fontFamily: 'BebasNeue-Regular', color: '#ec5fef' }}>
                            {item.year}
                          </Text> */}

                        </ImageBackground>

                      </TouchableOpacity>

                    )
                  }
                  else {

                    return (

                      <TouchableOpacity
                        onPress={() => showpic(i)}
                      >

                        <ImageBackground
                          source={{ uri: link + '/' + i }}
                          style={{
                            height: height(20), width: width(90)
                            , justifyContent: 'center', alignItems: 'center', marginTop: height(3), backgroundColor: 'gray', alignSelf: 'center', borderRadius: 10
                          }}
                          imageStyle={{ borderRadius: 10 }}
                        >

                          <Text>

                          </Text>

                        </ImageBackground>

                      </TouchableOpacity>

                    )

                  }
                })}

              </Pages>

            </View>

          }
          <View style={{ flex: 1 }}>

            <View style={{ width: width(90), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <Text style={{ fontSize: totalSize(4), marginTop: height(2), fontFamily: 'BebasNeue-Regular' }}>
                {item.title}
              </Text>
              <View style={{ width: width(22), flexDirection: 'row', justifyContent: 'space-between' }}>

                {favour == true ?
                  <TouchableOpacity
                    onPress={() => Favourite(item)}
                    style={{ borderWidth: 1, borderRadius: 3, borderColor: '#555' }}
                  >

                    <MaterialCommunityIcons name='heart' size={20} color='#FFBB41' style={{ paddingVertical: 5, paddingHorizontal: 7 }} />

                  </TouchableOpacity>
                  :
                  <TouchableOpacity
                    onPress={() => Favourite(item)}
                    style={{ borderWidth: 1, borderRadius: 3, borderColor: '#555' }}
                  >

                    <MaterialCommunityIcons name='heart' size={20} color='#777' style={{ paddingVertical: 5, paddingHorizontal: 7 }} />

                  </TouchableOpacity>
                }

                <TouchableOpacity
                  onPress={() => onShare()}
                  style={{ borderWidth: 1, borderRadius: 3, borderColor: '#555' }}
                >

                  <MaterialCommunityIcons name='share' size={30} color='#777' style={{ paddingHorizontal: 3 }} />

                </TouchableOpacity>

              </View>
            </View>
            <View
              style={{
                width: width(100),
                height: 1,
                backgroundColor: '#000'
              }}
            />
            <Text style={{ fontSize: totalSize(4), marginTop: height(3), alignSelf: 'center', fontFamily: 'BebasNeue-Regular' }}>
              car details
            </Text>

            {/* <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                car
              </Text>

              <Text style={styles.detailsTextView}>
                {item.title}
              </Text>

            </View> */}

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                price
              </Text>

              <Text style={{ fontSize: totalSize(3), color: '#931a25', fontFamily: 'BebasNeue-Regular' }}>
                {item.priceCurrency} {item.priceValue}
              </Text>

            </View>

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                sellerType
              </Text>

              <Text style={styles.detailsTextView}>
                {item.sellerType}
              </Text>

            </View>

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                make
              </Text>

              <Text style={styles.detailsTextView}>
                {item.make}
              </Text>

            </View>

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                model
              </Text>

              <Text style={styles.detailsTextView}>
                {item.model}
              </Text>

            </View>
            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                insurance
              </Text>

              <Text style={styles.detailsTextView}>
                {item.insurence ? "With" : "With Out"}
              </Text>

            </View>
            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                year
              </Text>

              <Text style={styles.detailsTextView}>
                {item.year}
              </Text>

            </View>

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                color
              </Text>

              <Text style={styles.detailsTextView}>
                {item.color}
              </Text>

            </View>

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                doors
              </Text>

              <Text style={styles.detailsTextView}>
                {item.doors}
              </Text>

            </View>

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                millage
              </Text>

              <Text style={styles.detailsTextView}>
                {item.millage}
              </Text>

            </View>

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                seats
              </Text>

              <Text style={styles.detailsTextView}>
                {item.seats}
              </Text>

            </View>

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                bodyType
              </Text>

              <Text style={styles.detailsTextView}>
                {item.bodyType}
              </Text>

            </View>

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                fuel
              </Text>

              <Text style={styles.detailsTextView}>
                {item.fuel}
              </Text>

            </View>

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                gear
              </Text>

              <Text style={styles.detailsTextView}>
                {item.gear}
              </Text>

            </View>

            <View style={styles.detailsView}>

              <Text style={styles.detailsTextView}>
                engine
              </Text>

              <Text style={styles.detailsTextView}>
                {item.engineValue} {item.engineType}
              </Text>

            </View>
            <View style={{
              width: width(95),
              height: height(0.2),
              backgroundColor: '#000',
              marginTop: 8,
              alignSelf: 'center'
            }
            } />
            <Text style={{
              fontSize: totalSize(3),
              marginTop: height(1), fontFamily: 'BebasNeue-Regular',
              marginLeft: width(2.5)
            }}>
              description
            </Text>

            <Text style={{
              fontSize: totalSize(1.7),
              marginLeft: width(2.5)
            }}>
              {item.description}
            </Text>
            <View style={{
              width: width(95),
              height: height(0.2),
              backgroundColor: '#000',
              marginTop: 8,
              alignSelf: 'center'
            }
            } />

            <TouchableOpacity
              onPress={() => setownerD(!ownerD)}
              style={ownerD == false ?

                {
                  height: height(7), width: width(75), marginTop: height(4),
                  alignSelf: 'center', borderRadius: 5,
                  borderWidth: 1, justifyContent: 'center',
                  alignItems: 'center', marginBottom: height(1.5)

                }

                :
                {
                  height: height(7), width: width(75),
                  marginTop: height(4), alignSelf: 'center',
                  borderRadius: 5, backgroundColor: '#000',
                  borderWidth: 1, justifyContent: 'center',
                  alignItems: 'center', marginBottom: height(1.5)
                }}
            >

              {
                ownerD == false ?
                  < Text style={{
                    fontSize: totalSize(4),
                    fontFamily: 'BebasNeue-Regular',
                    color: '#000'
                  }}
                  >

                    show owner details
                  </Text>
                  :
                  <Text style={{
                    fontSize: totalSize(4),
                    color: '#FFBB41',
                    fontFamily: 'BebasNeue-Regular'
                  }}
                  >
                    Hide owner details
                  </Text>}

            </TouchableOpacity>

            {ownerD == true ?

              <View>

                <Text style={{ fontSize: totalSize(4), marginTop: height(3), alignSelf: 'center', fontFamily: 'BebasNeue-Regular' }}>
                  owner details
                </Text>

                <Text style={{
                  fontSize: totalSize(4), marginTop: height(3), fontFamily: 'BebasNeue-Regular',
                  marginLeft: width(3.5)
                }}>
                  name
                </Text>

                <Text style={{ fontSize: totalSize(3), marginLeft: width(3.5), fontFamily: 'BebasNeue-Regular' }}>
                  {item.name}
                </Text>

                <View style={[styles.map, { overflow: 'hidden' }]}>

                  <MapView

                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={{ height: '100%', }}
                    showsUserLocation={true}
                    initialRegion={{
                      latitude: parseFloat(item.latitude),
                      longitude: parseFloat(item.longitude),
                      latitudeDelta: 0.1,
                      longitudeDelta: 0.1,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                  >

                    <Circle
                      center={{
                        latitude: parseFloat(item.latitude),
                        longitude: parseFloat(item.longitude)
                      }}
                      radius={2000}
                      fillColor='#0fa4ec60'
                      strokeWidth={1}
                      strokeColor='#0fa4ec'
                    />

                  </MapView>

                </View>

                <View style={{ height: height(3) }} />

              </View>

              : null}

          </View>

          <Modal
            animationType={'fade'}
            transparent={true}
            visible={visible}
            onRequestClose={() => setvisible(false)}
          >

            <View style={{ flex: 1, backgroundColor: '#000' }}>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <ImageBackground
                  source={{ uri: link + '/' + pic }}
                  style={{ height: height(50), width: '100%' }}
                  imageStyle={{ resizeMode: 'contain' }}
                />

              </View>

              <TouchableOpacity
                onPress={() => setvisible(false)}
                style={{ marginTop: height(2), position: 'absolute', alignSelf: 'flex-end' }}
              >

                <MaterialIcons name='close' size={35} color='#fff' />

              </TouchableOpacity>



            </View>

          </Modal>

        </ScrollView>
        <View style={{ height: height(0.2), marginTop: height(1), backgroundColor: '#000' }} />

        <View style={{
          height: height(7),
          width: width(94),
          alignSelf: 'center'
        }}>
          {


            loader == true ?

              <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fff' }}>


                <Loader
                  color='#000'
                />

              </View>

              :
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                <TouchableOpacity
                  disabled={chatDisable}
                  onPress={() => navigation.navigate('chatStack', {
                    screen: 'chat',
                    params: {
                      data: route.params.data,
                      name: route.params.data.user[0].name,
                      room: room,
                      user: true,
                      rentflag: true,
                      roomF: roomFunc
                    }
                  })}
                  style={{ borderRadius: 3, borderColor: chatBColor }}>

                  <Image source={chat}
                    style={{
                      paddingVertical: 5, paddingHorizontal: 10,
                      height: 40, width: 50
                    }}
                  />
                  {/* <MaterialCommunityIcons name='message-text-outline' size={40} color={chatBColor}
      style={{ paddingVertical: 5, paddingHorizontal: 10 }} /> */}

                </TouchableOpacity>
                <View
                  style={{
                    width: 0.5,
                    height: height(7),
                    backgroundColor: '#000'
                  }}
                />

                <TouchableOpacity
                  onPress={() => dialCall()}
                  style={{}}>

                  <MaterialIcons name='call' size={40} style={{ paddingVertical: 5, paddingHorizontal: 10 }} />

                </TouchableOpacity>
                <View
                  style={{
                    width: 0.5,
                    height: height(7),
                    backgroundColor: '#000'
                  }}
                />
                <TouchableOpacity
                  onPress={() => sms()}
                  style={{}}>

                  <FontAwesome5 name='sms' size={40} style={{ paddingVertical: 5, paddingHorizontal: 10 }} />

                </TouchableOpacity>
                <View
                  style={{
                    width: 0.5,
                    height: height(7),
                    backgroundColor: '#000'
                  }}
                />
                <TouchableOpacity
                  onPress={() => email()}
                  style={{}}>

                  <MaterialCommunityIcons name='email' size={40} style={{ paddingVertical: 5, paddingHorizontal: 10 }} />

                </TouchableOpacity>

              </View>
          }

        </View>
      </SafeAreaView>
    </Fragment >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height(3),
    alignItems: 'center',

    width: width(95),
    alignSelf: 'center'
  },
  detailsTextView: {
    fontSize: totalSize(3),
    fontFamily: 'BebasNeue-Regular'
  },
  map: {
    height: height(35),
    marginTop: height(3),
    borderRadius: 10,
    borderWidth: 1,
    width: width(90),
    alignSelf: 'center'
  }
})