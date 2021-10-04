import React, { Component, Fragment, useEffect, useState, useRef } from 'react'
import { View, ImageBackground, Image, Text, PermissionsAndroid, TextInput, TouchableOpacity, TouchableHighlight, SafeAreaView, FlatList, StyleSheet, Modal, ScrollView, ActivityIndicator, Alert, Share } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import Slider from '@react-native-community/slider';

import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service'
import AsyncStorage from '@react-native-community/async-storage'
import dynamicLinks from '@react-native-firebase/dynamic-links'

import { link, apikey } from '../links/links'

import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps'

import ModalDropdown from 'react-native-modal-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import cl from '../../assets/cl.png'
import ads from '../../assets/ADS.png'

export default function Buymenu({ navigation }) {

  const [user, setuser] = useState({})

  const [city, setcity] = useState('city')
  const [distance, setdistance] = useState('distance')
  const [make, setmake] = useState(null)
  const [model, setmodel] = useState(null)

  const [makearray, setmakearray] = useState([])
  const [modelarray, setmodelarray] = useState([true])

  const [yeararray, setyeararrey] = useState([])

  const [sortBy, setsortBy] = useState(null)
  const [sortByText, setsortByText] = useState()
  const [hiringType, sethiringType] = useState(null)
  const [hiringValue, sethiringValue] = useState(0)
  const [sellertype, setsellertype] = useState(null)
  const [minyear, setminyear] = useState('min')
  const [maxyear, setmaxyear] = useState('max')
  const [color, setcolor] = useState(null)
  const [pricetype, setpricetype] = useState('$')
  const [minprice, setminprice] = useState(null)
  const [maxprice, setmaxprice] = useState(null)
  const [door, setdoor] = useState(null)
  const [millagemin, setmillagemin] = useState(null)
  const [millagemax, setmillagemax] = useState(null)
  const [minseats, setminseats] = useState(null)
  const [maxseats, setmaxseats] = useState(null)
  const [bodytype, setbodytype] = useState(null)
  const [fuel, setfuel] = useState(null)
  const [gear, setgear] = useState(null)
  const [engineType, setenginType] = useState('L')
  const [minengine, setminengine] = useState(null)
  const [maxengine, setmaxengine] = useState(null)

  const [mapsearch, setmapsearch] = useState('')
  const [mapsearcharray, setmapsearcharray] = useState([])
  const [loc, setloc] = useState({ lat: 0, lon: 0 })
  const [cord, setcord] = useState({ lat: 0, lng: 0 })

  const [slider, setslider] = useState(5)

  const [visible, setvisible] = useState(false)
  const [slocation, setslocation] = useState(false)
  const [applylocationS, setapplylocationS] = useState(false)

  const map = useRef(null)

  const [cars, setcars] = useState([])
  const [flagState, setFlagState] = useState(false)
  const [load, setload] = useState(true)

  // const reload = useSelector((state) => state.reload)

  useEffect(() => {

    search(true)

    Geocoder.init(apikey);

    var date = new Date()
    var year = []

    for (let index = date.getFullYear(); index >= 1980; index--) {

      year.push(index)

      if (index == 1980) {
        setyeararrey(year)
      }

    }

    makearrayF()

  }, [])

  const reloadF = () => {
    search(false)
  }

  const search = (val) => {

    if (val == true) {
      setload(true)
    }

    var data = {}
    data.priceCurrency = pricetype
    data.engineType = engineType
    if (applylocationS == true) {
      data.currentLat = loc.lat
      data.currentLon = loc.lon
      data.distance = slider
    }
    if (city !== 'city') {
      data.city = city
    }
    // if (distance !== 'distance') {
    //   data.distance = distance
    // }
    if (make !== null) {
      data.make = make
    }
    if (model !== null) {
      data.model = model
    }
    if (hiringValue !== 0) {
      data.hiringType = hiringValue
    }
    if (sellertype !== null) {
      data.sellerType = sellertype
    }
    if (minyear !== 'min') {
      data.minYear = minyear
    }
    if (maxyear !== 'max') {
      data.maxYear = maxyear
    }
    if (color !== null) {
      data.color = color
    }
    if (minprice !== null) {
      data.minprice = minprice
    }
    if (maxprice !== null) {
      data.maxprice = maxprice
    }
    if (door !== null) {
      data.doors = door
    }
    if (millagemin !== null) {
      data.minmillage = millagemin
    }
    if (millagemax !== null) {
      data.maxmillage = millagemax
    }
    if (minseats !== null) {
      data.minseats = minseats
    }
    if (maxseats !== null) {
      data.maxseats = maxseats
    }
    if (bodytype !== null) {
      data.bodyType = bodytype
    }
    if (fuel !== null) {
      data.fuel = fuel
    }
    if (gear !== null) {
      data.gear = gear
    }
    if (minengine !== null) {
      data.minengine = minengine
    }
    if (maxengine !== null) {
      data.maxengine = maxengine
    }

    openD(data)

  }

  const openD = async (data) => {
    console.log(sortBy)

    try {
      var sort = {}
      if (sortBy == null) {
        sort = null
      }
      else if (sortBy == 0) {
        sort.column = 'date'
        sort.sort = 'd'
      }
      else if (sortBy == 1) {
        sort.column = 'price'
        sort.sort = 'a'
      }
      else if (sortBy == 2) {
        sort.column = 'price'
        sort.sort = 'd'
      }
      else if (sortBy == 3) {
        sort.column = 'make'
        sort.sort = 'a'
      }
      else if (sortBy == 4) {
        sort.column = 'model'
        sort.sort = 'a'
      }
      else if (sortBy == 5) {
        sort.column = 'millage'
        sort.sort = 'a'
      }

      const val = JSON.parse(await AsyncStorage.getItem('token'))

      setuser(val)

      console.log(val)

      fetch(link + '/ad/getFilteredAds', {
        method: 'POST',
        headers: {
          Authorization: "Bearer " + val.token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filter: data, sortBy: sort, user: val.id })
      }).then((response) => response.json())
        .then(async (responseJson) => {
          console.log('tttttttkkk', responseJson[0].result);
          if (responseJson.type === 'success') {
            if (responseJson.result) {
              var val = responseJson.result
              // val.reverse()
              setcars(val)
              setload(false)
            }
            else {
              alert('server error')
            }
          }
          else {
            setload(false)
          }
        })

    } catch (e) {
      console.log(e);
    }
  }

  const makearrayF = async () => {
    const val = JSON.parse(await AsyncStorage.getItem('token'))

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + val.token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(link + '/car/getMakes', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response.result.length)
        setmakearray(response.result)
      }
      )
  }

  const modelarrayF = async (item) => {
    setmodelarray([])
    setmodel(null)
    const val = JSON.parse(await AsyncStorage.getItem('token'))

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + val.token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(link + '/car/getModelsByMake?make=' + item, requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response.result.length)
        setmodelarray(response.result)
        setmake(item)
      }
      )
  }

  const mapsearchlocation = async (text) => {
    setmapsearch(text)

    try {

      const mapurl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=
    ${apikey}&input=${text}&types=(cities)`
      const result = await fetch(mapurl)
      const json = await result.json()

      console.log(json)

      setmapsearcharray(json.predictions)
    }
    catch (e) {
      alert('Network Problem')
    }

  }

  const setlocmap = (item) => {

    setmapsearch(item)
    setmapsearcharray([])

    try {
      Geocoder.from(item)
        .then(json => {
          var location = json.results[0].geometry.location;
          setloc({ lat: location.lat, lon: location.lng })

          map.current.animateToRegion({
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,

          }, 1500)

        })
        .catch(error => console.warn(error));
    }
    catch (e) {
      alert('loc error')
    }

  }

  const maplocationModal = () => {
    setslocation(false)
    setmapsearch('')
    setmapsearcharray([])
    setslider(5)
    setloc(null)
    setapplylocationS(false)
  }

  const apply = () => {
    if (mapsearch != '') {
      setloc(cord)
      setapplylocationS(true)
      setslocation(false)
    }
    else {
      alert('Choice location')
    }
  }

  const clearFilter = () => {
    setmake(null)
    setmodel(null)
    setsortBy(null)
    setsortByText()
    sethiringType(null)
    sethiringValue(0)
    setsellertype(null)
    setminyear('min')
    setmaxyear('max')
    setcolor(null)
    setminprice(null)
    setmaxprice(null)
    setdoor(null)
    setmillagemin(null)
    setmillagemax(null)
    setminseats(null)
    setmaxseats(null)
    setbodytype(null)
    setfuel(null)
    setgear(null)
    setminengine(null)
    setmaxengine(null)
    setvisible(false)
  }

  const Favourite = (item, index) => {
    try {

      let api = ''
      let data = cars

      if (item.isfavourite == false) {
        api = '/ad/makeFavourite?userId=' + user.id + '&adId=' + item._id
        data[index].isfavourite = !data[index].isfavourite
      }
      else if (item.isfavourite == true) {
        api = '/ad/removeFavourite?userId=' + user.id + '&adId=' + item._id
        data[index].isfavourite = !data[index].isfavourite
      }

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
          console.log(responseJson)
          if (responseJson.type == 'success') {

            setcars(data)
            // dispatch(newsFeedR(!reload))
          }
        })
        .catch((e) => {

        })

    }
    catch (e) {

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
      <TouchableOpacity
        onPress={() => navigation.navigate('SCD', { data: item, reloadF: reloadF })}
        style={{
          height: height(20), width: width(95), marginVertical: height(1), alignSelf: 'center',
          borderWidth: 2, borderColor: '#FFBB41', borderRadius: 10, flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center'
        }}>

        <View style={{ height: height(18), marginHorizontal: width(2) }}>

          <Text
            numberOfLines={1}
            style={{ fontSize: totalSize(3), width: width(40), fontFamily: 'BebasNeue-Regular' }}>
            {item.title}
          </Text>

          <Text style={{ fontSize: totalSize(2.5), color: '#B83C3C', fontFamily: 'BebasNeue-Regular' }}>
            {item.priceCurrency} {item.priceValue}
          </Text>

          <Text
            numberOfLines={3}
            style={{ fontSize: totalSize(1), height: height(5), width: width(45), marginTop: height(0.5) }}>
            {item.description}
          </Text>

          {/* <View style={{ marginTop: height(1.5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

            <View style={{ width: width(19), flexDirection: 'row', justifyContent: 'space-between' }}>

              {item.isfavourite == true ?
                <TouchableOpacity
                  onPress={() => Favourite(item, index)}
                  style={{ borderWidth: 1, borderRadius: 3, borderColor: '#555' }}
                >

                  <MaterialCommunityIcons name='heart' size={15} color='#FFBB41'
                    style={{ paddingVertical: 5, paddingHorizontal: 7 }} />

                </TouchableOpacity>
                :
                <TouchableOpacity
                  onPress={() => Favourite(item, index)}
                  style={{ borderWidth: 1, borderRadius: 3, borderColor: '#555' }}
                >

                  <MaterialCommunityIcons name='heart' size={15} color='#777'
                    style={{ paddingVertical: 5, paddingHorizontal: 7 }} />

                </TouchableOpacity>

              }

              <TouchableOpacity
                onPress={() => onShare(item)}
                style={{ borderWidth: 1, borderRadius: 3, borderColor: '#555' }}
              >

                <MaterialCommunityIcons name='share' size={25} color='#777'
                  style={{ paddingHorizontal: 3 }} />

              </TouchableOpacity>

            </View>

            {item.sold == false ?


              <Text style={{ fontSize: totalSize(1.7), color: '#219653', fontFamily: 'BebasNeue-Regular' }}>
                available
              </Text>
              :

              <Text style={{ fontSize: totalSize(1.7), color: '#B83C3C', fontFamily: 'BebasNeue-Regular' }}>
                sold
              </Text>

            }

          </View> */}

        </View>

        <ImageBackground
          source={{ uri: link + '/' + item.images[0] }}
          style={{ height: '100%', width: width(45) }}
          imageStyle={{ borderTopRightRadius: 8, borderBottomRightRadius: 8, backgroundColor: 'gray' }}
        >

        </ImageBackground>

      </TouchableOpacity>
    )
  }
  const location = async () => {

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition((pos) => {

        // setspeed((pos.coords.speed * 3.6).toFixed(0))

        map.current.animateToRegion({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          // nameee: pos.coords.heading,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,

        }, 1500)

        setcord({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setloc(cord)
        console.log('lllll', loc);

      }, (err) => {
        console.log(err);
        alert("turn on current location")
      })

    }
    else {
      console.log("Location permission denied");
    }


  }

  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <View style={{ flex: 1 }}>

          <Header text='BUY MENU' back={() => navigation.goBack()} />

          <View style={{ width: width(95), marginTop: height(2), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>

            <View style={{ width: width(40) }}>

              <TouchableOpacity
                onPress={() => setslocation(true)}
                style={{ height: height(5), borderWidth: 1, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
              >

                <MaterialIcons name='location-on' size={15} />

                <Text style={{ fontSize: totalSize(1.7), marginLeft: width(3), fontFamily: 'BebasNeue-Regular' }}>
                  Search Location
                </Text>

                <View style={{ width: width(5) }} />

              </TouchableOpacity>

              {applylocationS == false ?

                <Text style={{ fontSize: totalSize(0.85), marginTop: height(1), alignSelf: 'center', color: '#FF0000' }}>
                  Select City and distance
                </Text>
                :

                <View style={{ marginTop: height(0.7), width: width(39), alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >

                  <Text style={{ fontSize: totalSize(1.2), width: width(30) }}>

                    {mapsearch}

                  </Text>

                  <Text style={{ fontSize: totalSize(1.2) }}>

                    {slider}mi

                  </Text>

                </View>

              }

            </View>

            <View style={{ width: width(30) }}>

              <TouchableOpacity
                onPress={() => setvisible(true)}
                style={{ height: height(5), borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
              >

                <Text style={{ fontSize: totalSize(1.7), fontFamily: 'BebasNeue-Regular' }}>
                  More Filter
                </Text>

              </TouchableOpacity>

              <Text style={{ marginTop: height(1), alignSelf: 'center', fontSize: totalSize(0.8) }}>

                Tap{' '}

                <Text style={{ color: '#FF0000', fontWeight: 'bold' }}>

                  SEARCH

                </Text>

                {' '}Button to apply filters

              </Text>

            </View>

            <TouchableHighlight
              onPress={() => search(true)}
              underlayColor='#242527'
              style={{ height: height(5), width: width(20), borderWidth: 1, borderRadius: 5, backgroundColor: '#FFBB41', justifyContent: 'center', alignItems: 'center' }}
            >

              <Text style={{ fontSize: totalSize(1.7), fontFamily: 'BebasNeue-Regular' }}>
                Search
              </Text>

            </TouchableHighlight>

          </View>

          <View style={{ marginTop: height(1), borderWidth: 0.5, borderColor: '#aaa' }} />

          {load == true
            ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

              <ActivityIndicator size="large" color="#000" />

            </View>
            :
            cars.length < 1 ?

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <Image style={{ height: 100, width: 80 }} source={ads} />

              </View>

              :
              <View style={{ flex: 1 }}>

                <View style={{ width: width(95), marginTop: height(1.5), alignSelf: 'center', alignItems: 'flex-end' }}>

                  <Text style={{ fontSize: totalSize(1.7), fontFamily: 'BebasNeue-Regular' }}>

                    {(cars.length).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} cars found

                  </Text>

                </View>

                <FlatList
                  data={cars}
                  keyExtractor={(item, index) => { return index.toString() }}
                  renderItem={_Flatlist}
                />

              </View>
          }

          <Modal
            animationType={'slide'}
            transparent={true}
            visible={visible}
          >
            <View
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>

              <View style={{ height: height(71), width: width(95), marginTop: height(20), alignSelf: 'center', backgroundColor: 'white', borderRadius: 10 }}>

                <View style={{ height: height(7), width: width(90), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                  <TouchableHighlight
                    onPress={() => clearFilter()}
                    underlayColor='#000'
                    style={{ height: height(4), width: width(20), alignSelf: 'center', borderWidth: 1, backgroundColor: '#aaa', borderRadius: 5, justifyContent: 'center' }}
                  >

                    <Text style={{ fontSize: totalSize(2), fontFamily: 'BebasNeue-Regular', color: '#fff', alignSelf: 'center' }}>
                      Clear
                    </Text>

                  </TouchableHighlight>

                  <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#a2a2a2' }}>
                    filter options
                  </Text>

                  <TouchableHighlight
                    onPress={() => setvisible(false)}
                    underlayColor='#222'
                    style={{ height: height(4), width: width(20), alignSelf: 'center', borderWidth: 1, backgroundColor: '#FFBB41', borderRadius: 5, justifyContent: 'center' }}
                  >

                    <Text style={{ fontSize: totalSize(2), fontFamily: 'BebasNeue-Regular', alignSelf: 'center' }}>
                      apply
                    </Text>

                  </TouchableHighlight>

                </View>

                <View style={{ borderWidth: 0.7 }} />

                <ScrollView
                  style={{ width: width(90), alignSelf: 'center' }}>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      Sortby
                    </Text>

                    <ModalDropdown
                      defaultValue={sortByText}
                      onSelect={(index, value) => {
                        setsortBy(index)
                        setsortByText(value)
                      }}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ height: height(38), width: width(55), borderWidth: 2 }}
                      options={['most recently listed', 'Price (lowest)', 'Price (hightest)', 'make (a-z)', 'model (a-z)', 'millage (low to high)']}>

                      <View
                        style={{ width: width(55), flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {sortByText}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      Car type
                    </Text>

                    <ModalDropdown
                      defaultValue={sellertype}
                      onSelect={(index, value) => {
                        sethiringType(value)
                        sethiringValue(index)
                      }}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ flex: 1, width: 200, borderWidth: 2 }}
                      options={['unlisted', 'taxi & Private hire', 'cars']}>

                      <View
                        style={{ width: 200, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {hiringType}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      seller type
                    </Text>

                    <ModalDropdown
                      defaultValue={sellertype}
                      onSelect={(index, value) => setsellertype(value)}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ flex: 1, width: width(25), borderWidth: 2 }}
                      options={['unlisted', 'private', 'trade']}>

                      <View
                        style={{ width: 90, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {sellertype}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      make
                    </Text>

                    <ModalDropdown
                      onSelect={(index, value) => {
                        modelarrayF(value)
                        // if (value == 'unlisted') {
                        //   alert('Select otheer option please')
                        // }
                      }}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ width: 150 }}
                      options={makearray}>

                      <View
                        style={{ width: 150, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {make}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      model
                    </Text>

                    <ModalDropdown
                      onSelect={(index, value) => {
                        setmodel(value)
                        console.log(makearray[0]);
                      }}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ flex: 1, width: 150, borderWidth: 2 }}
                      options={modelarray}>

                      <View
                        style={{ width: 150, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {model}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      color
                    </Text>

                    <ModalDropdown
                      onSelect={(index, value) => setcolor(value)}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ flex: 1, width: 120, borderWidth: 2 }}
                      options={['unlisted', 'Aquamarine', 'Aqua', 'Blue', 'Black', 'Brown', 'Cyan', 'Gold', 'Green', 'Gray',
                        'Indigo', 'Lime', 'Magenta', 'Orange', 'Purple', 'Pink', 'Red', 'Silver', 'Sky Blue', 'Violet', 'White',
                        'Yellow', ' Zucchini'
                      ]}>

                      <View
                        style={{ width: 120, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {color}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      door
                    </Text>

                    <ModalDropdown
                      onSelect={(index, value) => setdoor(value)}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ flex: 1, width: width(25), borderWidth: 2 }}
                      options={[2, 4, 5, 6, 'Unlisted']}>

                      <View
                        style={door == 'Unlisted' ?
                          { width: 95, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
                          : { width: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {door}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      minseats
                    </Text>

                    <ModalDropdown
                      onSelect={(index, value) => setminseats(value)}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ flex: 1, width: width(20), borderWidth: 2 }}
                      options={[2, 4, 5, 6, 7, 8, 9, 10, 11, 12]}>

                      <View
                        style={{ width: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {minseats}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      maxseats
                    </Text>

                    <ModalDropdown
                      onSelect={(index, value) => setmaxseats(value)}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ flex: 1, width: width(20), borderWidth: 2 }}
                      options={[2, 4, 5, 6, 7, 8, 9, 10, 11, 12]}>

                      <View
                        style={{ width: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {maxseats}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      body type
                    </Text>

                    <ModalDropdown
                      onSelect={(index, value) => setbodytype(value)}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ flex: 1, width: width(28), borderWidth: 2 }}
                      options={['Coupe', 'converted', 'saloon', 'hatchback', 'estate', 'mpv', 'minibus', 'suv', 'van', 'unlisted']}>

                      <View
                        style={{ width: 100, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {bodytype}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      fuel
                    </Text>

                    <ModalDropdown
                      onSelect={(index, value) => setfuel(value)}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ flex: 1, width: width(80), borderWidth: 2 }}
                      options={['petrol', 'bi fuel', 'diesel', 'electric', 'hybrid - diesel/electric', 'hybrid - diesel/electric plug-in', 'hybrid - petrol/electric', 'hybrid - petrol/electric plug-in', 'unlisted']}>

                      <View
                        style={{ width: width(80), flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {fuel}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      gear
                    </Text>

                    <ModalDropdown
                      onSelect={(index, value) => setgear(value)}
                      dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ flex: 1, width: width(27), borderWidth: 2 }}
                      options={['auto', 'manual', 'unlisted']}>

                      <View
                        style={{ width: 90, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                          {gear}

                        </Text>

                        <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                      </View>


                    </ModalDropdown>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      millage's
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                      <TextInput
                        placeholder='min'
                        keyboardType='number-pad'
                        value={millagemin}
                        onChangeText={(text) => setmillagemin(text)}
                        style={{ fontSize: totalSize(3), width: width(18), borderWidth: 1, paddingVertical: 0, fontFamily: 'BebasNeue-Regular' }}
                      />

                      <Text style={{ marginLeft: width(1), fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                        -
                      </Text>

                      <TextInput
                        placeholder='max'
                        keyboardType='number-pad'
                        value={millagemax}
                        onChangeText={(text) => setmillagemax(text)}
                        style={{ fontSize: totalSize(3), marginLeft: width(1), width: width(18), borderWidth: 1, paddingVertical: 0, fontFamily: 'BebasNeue-Regular' }}
                      />

                    </View>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      year
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                      <ModalDropdown
                        onSelect={(index, value) => setminyear(value)}
                        dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                        dropdownStyle={{ flex: 1, width: width(25), borderWidth: 2 }}
                        options={yeararray}>

                        <View
                          style={{ fontSize: totalSize(3), width: width(18), borderWidth: 1, paddingVertical: 0, fontFamily: 'BebasNeue-Regular' }}
                        >

                          <Text style={minyear == 'min' ? { fontSize: totalSize(3), marginLeft: width(1), fontFamily: 'BebasNeue-Regular', color: '#a2a2a2' }
                            : { fontSize: totalSize(3), marginLeft: width(1), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                            {minyear}

                          </Text>

                        </View>

                      </ModalDropdown>

                      <Text style={{ marginLeft: width(1), fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                        -
                      </Text>

                      <ModalDropdown
                        onSelect={(index, value) => setmaxyear(value)}
                        dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                        dropdownStyle={{ flex: 1, width: width(25), borderWidth: 2 }}
                        options={yeararray}>

                        <View
                          style={{ fontSize: totalSize(3), width: width(18), marginLeft: width(1), borderWidth: 1, paddingVertical: 0, fontFamily: 'BebasNeue-Regular' }}
                        >

                          <Text style={maxyear == 'max' ? { fontSize: totalSize(3), marginLeft: width(1), fontFamily: 'BebasNeue-Regular', color: '#a2a2a2' }
                            : { fontSize: totalSize(3), marginLeft: width(1), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                            {maxyear}

                          </Text>

                        </View>


                      </ModalDropdown>

                    </View>

                  </View>

                  <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      engine
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                      <ModalDropdown
                        defaultIndex={0}
                        onSelect={(index, value) => setenginType(value)}
                        dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                        dropdownStyle={{ height: 100, width: 40, borderWidth: 2 }}
                        options={['L', 'CC']}>

                        <View
                          style={{
                            height: height(5), width: width(12), borderWidth: 1, flexDirection: 'row',
                            justifyContent: 'flex-end', alignItems: 'center'
                          }}>

                          <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                            {engineType}

                          </Text>

                          <MaterialIcons name='arrow-drop-down' size={25} color='#868887'
                            style={{
                              // borderWidth: 1,
                              width: 20,
                              alignSelf: 'center',

                            }} />

                        </View>


                      </ModalDropdown>

                      <TextInput
                        placeholder='min'
                        keyboardType='number-pad'
                        value={minengine}
                        onChangeText={(text) => setminengine(text)}
                        style={{ fontSize: totalSize(3), marginLeft: width(2), width: width(18), borderWidth: 1, paddingVertical: 0, fontFamily: 'BebasNeue-Regular' }}
                      />

                      <Text style={{ marginLeft: width(1), fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                        -
                      </Text>

                      <TextInput
                        placeholder='max'
                        keyboardType='number-pad'
                        value={maxengine}
                        onChangeText={(text) => setmaxengine(text)}
                        style={{ fontSize: totalSize(3), marginLeft: width(1), width: width(18), borderWidth: 1, paddingVertical: 0, fontFamily: 'BebasNeue-Regular' }}
                      />

                    </View>

                  </View>

                  <View style={{
                    marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      Price type
                    </Text>

                    <View style={{
                      flexDirection: 'row', alignItems: 'center',
                      justifyContent: 'center'
                    }}>

                      <ModalDropdown
                        defaultIndex={0}
                        onSelect={(index, value) => setpricetype(value)}
                        dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                        dropdownStyle={{ height: 150, width: 40, borderWidth: 2 }}
                        options={['Rs', '$', '£', '€', '¥', '₹', 'د.إ', '৳', 'Rp',
                          'RM', '₩']}>

                        <View
                          style={{
                            height: height(5), width: width(13),
                            borderWidth: 1, paddingLeft: 5,
                            flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'
                          }}>

                          <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                            {pricetype}

                          </Text>

                          <MaterialIcons name='arrow-drop-down' size={25} color='#868887'
                            style={{
                              // borderWidth: 1,
                              width: 20,
                              alignSelf: 'center',

                            }} />

                        </View>


                      </ModalDropdown>

                      <TextInput
                        placeholder='min'
                        keyboardType='number-pad'
                        value={minprice}
                        onChangeText={(text) => setminprice(text)}
                        style={{ fontSize: totalSize(3), marginLeft: width(2), width: width(18), borderWidth: 1, paddingVertical: 0, fontFamily: 'BebasNeue-Regular' }}
                      />

                      <Text style={{ marginLeft: width(1), fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                        -
                      </Text>

                      <TextInput
                        placeholder='max'
                        keyboardType='number-pad'
                        value={maxprice}
                        onChangeText={(text) => setmaxprice(text)}
                        style={{ fontSize: totalSize(3), marginLeft: width(1), width: width(18), borderWidth: 1, paddingVertical: 0, fontFamily: 'BebasNeue-Regular' }}
                      />

                    </View>

                  </View>

                  <View style={{ height: height(2) }} />

                </ScrollView>

              </View>

            </View>

          </Modal>

          <Modal
            animationType={'slide'}
            visible={slocation}
            onRequestClose={() => maplocationModal()}
          >
            <View style={{ height: height(100), backgroundColor: '#fff' }}>

              <Header text='location' back={() => maplocationModal()} />

              <View style={{ height: height(6), width: width(95), marginTop: height(5), alignSelf: 'center', borderBottomWidth: 0.5, flexDirection: 'row', justifyContent: 'space-between' }}>

                <TextInput
                  placeholder='search by location'
                  value={mapsearch}
                  onChangeText={(text) => mapsearchlocation(text)}
                  style={{ width: width(85), fontSize: totalSize(3.5), paddingVertical: 0, fontFamily: 'BebasNeue-Regular' }}
                />

                <TouchableOpacity
                  onPress={() => {
                    setmapsearch('')
                    setmapsearcharray([])
                  }}
                  style={{ width: width(10), justifyContent: 'center', alignItems: 'center' }}
                >

                  <Text style={{ fontSize: totalSize(2.7), fontWeight: 'bold', color: '#fabb47' }}>
                    X
                  </Text>

                </TouchableOpacity>

              </View>



              {mapsearcharray.length < 1 ?
                null :

                <ScrollView style={{ maxHeight: height(20), width: width(95), marginTop: height(22), borderWidth: 1, borderRadius: 5, position: 'absolute', zIndex: 1, alignSelf: 'center', backgroundColor: '#fff' }}>

                  {mapsearcharray.map(item => {
                    return (
                      <TouchableOpacity
                        onPress={() => setlocmap(item.description)}
                        style={{ borderBottomWidth: 0.5 }}>

                        <Text style={{ fontSize: totalSize(2.5), fontFamily: 'BebasNeue-Regular', padding: 5 }}>
                          {item.description}
                        </Text>

                      </TouchableOpacity>
                    )
                  })
                  }

                </ScrollView>

              }


              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                ref={map}
                style={styles.map}

                showsUserLocation
                initialRegion={{
                  latitude: loc != null ? loc.lat : 37.7882,
                  longitude: loc != null ? loc.lon : -122.4324,
                  latitudeDelta: loc != null ? 0.5 : 100,
                  longitudeDelta: loc != null ? 0.5 : 100,
                }}
              >
                {loc == null ? null
                  :
                  <View>

                    <Marker
                      coordinate={{
                        latitude: loc.lat,
                        longitude: loc.lon
                      }}
                    >
                    </Marker>

                    <Circle
                      center={{
                        latitude: loc.lat,
                        longitude: loc.lon
                      }}
                      radius={slider * 500}
                      fillColor='#00000060'
                      strokeWidth={0}
                    />

                  </View>
                }
                {

                  cord == null ? null :

                    <Circle
                      center={{
                        latitude: cord.lat,
                        longitude: cord.lng
                      }}
                      radius={slider * 200}
                      fillColor='#00000060'
                      strokeWidth={0}
                    />
                }
              </MapView>

              <View style={{ width: width(95), marginTop: height(4), alignSelf: 'center' }}>

                <View style={{
                  width: width(90),

                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'center'
                }}>

                  <Text style={{
                    fontSize: totalSize(3), width: width(50),
                    fontFamily: 'BebasNeue-Regular',
                  }}>
                    custom radius
                  </Text>
                  <TouchableOpacity
                    onPress={() => location()}
                  >
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 8
                      }}
                      source={cl}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={{ fontSize: totalSize(2.2), width: width(90), alignSelf: 'center', color: '#b8b8b8', fontFamily: 'BebasNeue-Regular' }}>
                  show listing at specfied distance
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                  <Slider
                    style={{ marginTop: height(1), height: 40, width: width(80) }}
                    minimumValue={5}
                    maximumValue={100}
                    minimumTrackTintColor="#005CE7"
                    maximumTrackTintColor="#C4C4C4"
                    thumbTintColor='#005CE7'
                    value={slider}
                    onValueChange={(slide) => setslider(parseInt(slide))}
                  />

                  <Text style={{ fontSize: totalSize(3), width: width(90), color: '#b8b8b8', fontFamily: 'BebasNeue-Regular' }}>
                    {slider} mi
                  </Text>

                </View>

              </View>

              <TouchableHighlight
                underlayColor='#000'
                onPress={() => apply()}
                style={{ height: height(5), width: width(40), marginTop: height(5), alignSelf: 'center', borderWidth: 1.5, borderColor: '#fabb47', borderRadius: 10, justifyContent: 'center' }}>

                <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#fabb47', alignSelf: 'center' }}>
                  apply
                </Text>

              </TouchableHighlight>


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
  },
  map: {
    height: height(35),
    width: width(100),
    marginTop: height(5)
  }
})