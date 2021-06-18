import React, { Component, Fragment, useEffect, useRef, useState } from 'react'
import { View, ImageBackground, LayoutAnimation, UIManager, PermissionsAndroid, Image, ActivityIndicator, Alert, Modal, FlatList, TextInput, Text, TouchableOpacity, TouchableHighlight, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { useDispatch } from 'react-redux'

import AsyncStorage from '@react-native-community/async-storage'

import DocumentPicker from 'react-native-document-picker';

import ModalDropdown from 'react-native-modal-dropdown';

import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps'
import Header from '../header/header'
import Slider from '@react-native-community/slider';

import { link, apikey } from '../links/links'
import cl from '../../assets/cl.png'

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Placeadd({ navigation }) {

  const [type, settype] = useState()
  const [pics, setpics] = useState([])
  const [title, settitle] = useState()
  const [titleLenght, settitleLenght] = useState(0)
  const [name, setname] = useState()
  const [phone, setphone] = useState()
  const [email, setemail] = useState()
  const [age, setage] = useState()
  const [address, setaddress] = useState()
  const [addressLatlon, setaddressLatlon] = useState({
    lat: 0,
    lon: 0
  })
  const [discription, setdiscription] = useState()
  const [hiringType, sethiringType] = useState(null)
  const [hiringValue, sethiringValue] = useState(0)
  const [sellertype, setsellertype] = useState()
  const [make, setmake] = useState()
  const [makearray, setmakearray] = useState([])
  const [model, setmodel] = useState()
  const [modelarray, setmodelarray] = useState([])
  const [year, setyear] = useState()
  const [yeararray, setyeararray] = useState([])
  const [color, setcolor] = useState()
  const [pricetype, setpricetype] = useState('$')
  const [priceValue, setpriceValue] = useState()
  const [door, setdoor] = useState()
  const [millage, setmillage] = useState()
  const [minseats, setminseats] = useState()
  const [bodytype, setbodytype] = useState()
  const [fuel, setfuel] = useState()
  const [gear, setgear] = useState()
  const [engineType, setenginType] = useState('L')
  const [engine, setengine] = useState()
  //dwedhjwd
  const [mapsearch, setmapsearch] = useState('')
  const [mapsearcharray, setmapsearcharray] = useState([])
  const [loc, setloc] = useState(null)
  const [cord, setcord] = useState({
    lat: 0,
    lng: 0
  })
  const [city, setcity] = useState('yyyyyyy')
  const [slider, setslider] = useState(5)
  // const [visible, setvisible] = useState(false)
  const [slocation, setslocation] = useState(false)
  const [applylocationS, setapplylocationS] = useState(false)

  const [user, setuser] = useState({ userDetails: { phone: '' } })

  const [visible, setvisible] = useState(false)

  const dispatch = useDispatch();
  const map = useRef()
  const [scale, setscale] = useState(width(30))

  useEffect(() => {
    Geocoder.init(apikey);
    console.log('dfddddd', addressLatlon);
    asyncFunction()

    makearrayF()

    var date = new Date()
    var year = []

    for (let index = date.getFullYear(); index >= 1980; index--) {

      year.push(index)

      if (index == 1980) {
        setyeararray(year)
      }

    }

  }, [])

  const asyncFunction = async () => {
    const val = JSON.parse(await AsyncStorage.getItem('token'))
    setuser(val)
    setname(val.userDetails.name)
    setemail(val.userDetails.email)
    if (val.userDetails.phone) {
      setphone(val.userDetails.phone)
    }
    // console.log(val);
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
    setmodel()
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
        setmodelarray(response.result.length === 1 ? ['select make type'] : response.result)
        setmake(item)
      }
      )
  }

  const uploadcarpics = async () => {

    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      results.map(q => {
        setpics((prev) => {
          return [
            ...prev, { uri: q.uri, name: q.name, type: q.type }
          ]
        })
      })
      // console.log(pics);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }

  }

  const removecarpic = (item) => {
    let pic = pics.filter((e) => {
      return e !== item
    })
    setpics(pic)
  }

  const validation = async () => {
    // if (!type) {
    //   return 'Hiring Type missing'
    // }
    if (!pics[0]) {
      return 'Please upload at least 1 image'
    }
    else if (!title) {
      return 'Title missing'
    }
    else if (!name) {
      return 'Name missing'
    }
    else if (!phone) {
      return 'Phone no missing'
    }
    // else if (!email) {
    //   return 'Email missing'
    // }
    else if (!mapsearch) {
      return 'Address missing'
    }
    else if (!discription) {
      return 'Discription missing'
    }
    else if (!sellertype) {
      return 'Seller Type missing'
    }
    else if (!make) {
      return 'Make missing'
    }
    else if (!model) {
      return 'Model missing'
    }
    else if (!year) {
      return 'Year missing'
    }
    else if (!color) {
      return 'Color missing'
    }
    else if (!priceValue) {
      return 'Price missing'
    }
    else if (!door) {
      return 'No of door missing'
    }
    else if (!millage) {
      return 'Millage missing'
    }
    else if (!minseats) {
      return 'No of seats missing'
    }
    else if (!bodytype) {
      return 'Body type missing'
    }
    else if (!fuel) {
      return 'Fuel type missing'
    }
    // else if (!gear) {
    //   return 'Gear type missing'
    // }
    else if (!engine) {
      return 'Engine type missing'
    }
    return true
  }

  const Placead = async () => {
    // let addre=''
    // addre= addre.split(',')

    let valid = await validation()
    console.log(valid)

    if (valid == true) {

      if (pics.length > 8) {
        return alert('Maximum 8 Images')
      }
      setvisible(true)

      var data = new FormData()
      data.append('user', user.id)
      data.append("hiringType", hiringType)
      data.append("title", title)
      data.append("name", name)
      data.append("phone", String(phone))
      data.append("email", email)
      data.append("address", address)
      data.append("description", discription)
      data.append("sellerType", sellertype)
      data.append("color", color)
      data.append("priceCurrency", pricetype)
      data.append("priceValue", priceValue)
      data.append("doors", door)
      data.append("millage", millage)
      data.append("seats", minseats)
      data.append("bodyType", bodytype)
      data.append("fuel", fuel)
      data.append("gear", gear)
      data.append("city", city)
      console.log('append cuty', city);
      console.log('append', addressLatlon);
      data.append("latitude", addressLatlon.lat)
      data.append("longitude", addressLatlon.lon)
      data.append("make", make)
      data.append("model", model)
      data.append("year", year)
      data.append("engineType", engineType)
      data.append("engineValue", engine)
      pics.map(q => {

        data.append("images", {
          name: q.name,
          type: q.type,
          uri: q.uri
        })

      })

      try {
        fetch(link + '/ad/insertAd', {
          method: 'POST',
          headers: {
            Authorization: "Bearer " + user.token,
            Accept: 'multipart/form-data',
            'Content-Type': 'multipart/form-data'
          },
          body: data
        })
          .then((response) => response.json())
          .then((Data) => {
            if (Data.type == 'success') {

              console.log('data', Data)
              Alert.alert(
                'Post',
                Data.result
              )
              setvisible(false)
              navigation.goBack()
            }
            else {
              setvisible(false)
              Alert.alert(
                'Post',
                Data.result
              )
            }
          })
          .catch((err) => {
            alert('Failed')
            console.log("Error132" + JSON.stringify(err));
            setvisible(false)
          })
      } catch (error) {
        alert('two' + error)
        setvisible(false)
      }

    }
    else {
      alert(valid)
    }

  }

  const _Flatlist = ({ item }) => {
    return (
      <View style={{ margin: width(1) }}>
        <View style={{ height: 60, width: 90 }}>

          <Image
            style={{ height: 50, width: 80, marginTop: 5, borderWidth: 1, borderColor: '#000', backgroundColor: '#bbb', borderRadius: 5 }}
            source={{ uri: item.uri }} />

          <TouchableOpacity
            onPress={() => removecarpic(item)}
            style={{ height: 20, width: 20, alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 1, backgroundColor: '#aaa', borderRadius: 10 }}
          >
            <Text style={{ fontSize: totalSize(1.5), fontWeight: 'bold', color: '#fff' }}>
              X
            </Text>

          </TouchableOpacity>

        </View>
      </View>
    )
  }


  const _Geocoding = (lat, lon) => {
    console.log(lat, lon)
    Geocoder.from(lat, lon)
      .then(json => {
        console.log('kkkk', json.results[3].formatted_address);
        var addressComponent = json.results[0].address_components[0];
        console.log(addressComponent);
        setmapsearch(json.results[0].formatted_address)
        console.log(mapsearch);
        setcity(json.results[3].formatted_address)
      })
      .catch(error => console.warn(error));

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
        setaddressLatlon({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        _Geocoding(pos.coords.latitude, pos.coords.longitude)
        // setaddressLatlon({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        // setaddressLatlon({ city: pos.coords.heading })
        console.log(addressLatlon);
      }, (err) => {
        console.log(err);
        alert("turn on current location")
      })

    }
    else {
      console.log("Location permission denied");
    }


  }

  const mapsearchlocation = async (text) => {
    setmapsearch(text)

    try {

      const mapurl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=
    ${apikey}&input=${text}`
      const result = await fetch(mapurl)
      const json = await result.json()

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
          console.log(location);
          setloc({ lat: location.lat, lon: location.lng })
          setaddressLatlon({ lat: location.lat, lon: location.lng })
          setcity(item)
          map.current.animateToRegion({
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,

          }, 1500)

          // console.log('setloc', addressLatlon.city);
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
    setslider(0)
    setapplylocationS(false)
  }

  const apply = () => {
    if (mapsearch != '') {
      setapplylocationS(true)
      setslocation(false)
      setaddress(mapsearch)

      console.log('cityyyy', city);


      console.log('city', city);
    }
    else {
      alert('Choose location')
    }
  }

  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <View style={{ flex: 1 }}>

          <Header text='SELL MENU' back={() => navigation.goBack()} />

          <ScrollView
            onScroll={(e) => {

              let high = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height

              if (e.nativeEvent.contentOffset.y > high * 0.96) {
                if (scale != width(40)) {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                  setscale(width(40))
                }
              }
              else {
                if (scale != width(30)) {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                  setscale(width(30))
                }
              }
            }}
            style={{ flex: 1 }}>
            <TouchableHighlight
              underlayColor='#242527'
              onPress={() => uploadcarpics()}
              style={{ height: height(7), width: width(85), marginTop: height(2), alignSelf: 'center', borderWidth: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}
            >

              <View
                style={{ height: height(7), width: width(85), alignSelf: 'center', borderWidth: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}
              >

                <MaterialCommunityIcons name='image-plus' size={30} />

                <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                  Upload car pictures
                </Text>

                <View style={{ width: width(10) }} />

              </View>

            </TouchableHighlight>


            <FlatList
              style={{ marginTop: height(2) }}
              data={pics}
              horizontal={true}
              renderItem={_Flatlist}
              showsHorizontalScrollIndicator={false}
            />

            <TouchableHighlight
              underlayColor='#242527'
              onPress={() => setslocation(true)}
              style={{
                height: height(5), shadowColor: "#000",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,

                elevation: 5, width: width(70), marginTop: height(2),
                borderRadius: 5, backgroundColor: '#fff', flexDirection: 'row',
                justifyContent: 'space-around', alignItems: 'center', alignSelf: 'center'
              }}
            >

              <View
                style={{ height: height(5), width: width(70), borderWidth: 1, borderColor: '#931a25', borderRadius: 5, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}
              >

                <View style={{ width: width(3) }} />

                <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#a2a2a2' }}>
                  set location
                </Text>

                <MaterialIcons name='my-location' size={30} color='#a2a2a2' />

              </View>

            </TouchableHighlight>
            <View style={{
              paddingVertical: 0, maxHeight: height(12),
              width: width(70), marginLeft: 4,
              marginTop: height(2),
              borderBottomWidth: 1, borderBottomColor: '#a2a2a2'
            }}>
              <Text style={{
                fontFamily: 'BebasNeue-Regular', fontSize: totalSize(3)
              }}>
                {mapsearch}
              </Text>

            </View>
            <Text style={{
              fontFamily: 'BebasNeue-Regular', fontSize: totalSize(2),
              color: '#a2a2a2', marginLeft: 4
            }}>
              Address
            </Text>


            <View style={{ width: width(95), alignSelf: 'center' }}>

              <View style={{ height: height(12), alignItems: 'center', flexDirection: 'row' }}>

                <TextInput
                  onChangeText={(text) => {
                    if (text.length <= 50) {
                      settitleLenght(text.length)
                      settitle(text)
                    }
                  }}
                  value={title}
                  placeholder='title'
                  multiline
                  style={{ paddingVertical: 0, width: width(70), fontSize: totalSize(3.5), fontFamily: 'BebasNeue-Regular', borderBottomWidth: 1, borderBottomColor: '#a2a2a2' }}
                />

                {titleLenght < 50 ?

                  <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                    {titleLenght} / 50

                  </Text>
                  :
                  <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#ff6666' }}>

                    {titleLenght} / 50

                  </Text>}

              </View>

              <TextInput
                onChangeText={(text) => setname(text)}
                value={name}
                editable={false}
                placeholder='Name'
                style={{ paddingVertical: 0, width: width(70), fontSize: totalSize(3), marginTop: height(2), fontFamily: 'BebasNeue-Regular', borderBottomWidth: 1, borderBottomColor: '#a2a2a2' }}
              />

              <TextInput
                onChangeText={(text) => setphone(text)}
                value={phone}
                editable={user.userDetails.phone ? false : true}
                keyboardType='phone-pad'
                placeholder='phone'
                style={{ paddingVertical: 0, width: width(70), fontSize: totalSize(3), marginTop: height(2), fontFamily: 'BebasNeue-Regular', borderBottomWidth: 1, borderBottomColor: '#a2a2a2' }}
              />

              <TextInput
                onChangeText={(text) => setemail(text)}
                value={email}
                editable={false}
                placeholder='email'
                style={{ paddingVertical: 0, width: width(70), fontSize: totalSize(3), marginTop: height(2), fontFamily: 'BebasNeue-Regular', borderBottomWidth: 1, borderBottomColor: '#a2a2a2' }}
              />



              {/* <TextInput
                placeholder='age'
                style={{ paddingVertical: 0, width: width(70), fontSize: totalSize(3), marginTop: height(2), fontFamily: 'BebasNeue-Regular', borderBottomWidth: 1, borderBottomColor: '#a2a2a2' }}
              /> */}

              {/* <TextInput
                onChangeText={(text) => setaddress(text)}
                value={address}
                placeholder='address'
                multiline
             
              /> */}


              <TextInput
                multiline
                placeholder='description'
                onChangeText={(text) => setdiscription(text)}
                style={{ paddingVertical: 0, maxHeight: height(12), width: width(70), fontSize: totalSize(3.5), marginTop: height(2), fontFamily: 'BebasNeue-Regular', borderBottomWidth: 1, borderBottomColor: '#a2a2a2' }}
              />

            </View>

            <View style={styles.Boldtextview}>

              <Text style={{
                fontSize: totalSize(3),
                fontFamily: 'BebasNeue-Regular',

              }}>
                Car type
              </Text>

              <ModalDropdown
                defaultValue={sellertype}
                onSelect={(index, value) => {
                  sethiringType(value)
                  sethiringValue(index)
                }}
                dropdownTextStyle={{
                  fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular',
                  paddingBottom: height(2)
                }}
                dropdownStyle={{ flex: 1, width: 200, borderWidth: 2 }}
                options={['unlisted', 'taxi & Private hire', 'cars']}>

                <View
                  style={{
                    width: 200, flexDirection: 'row',
                    justifyContent: 'flex-end', alignItems: 'center',
                    paddingBottom: height(2)
                  }}>

                  <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                    {hiringType}

                  </Text>

                  <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                </View>


              </ModalDropdown>

            </View>

            <View style={styles.Boldtextview}>

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                seller type
              </Text>

              <ModalDropdown

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

            <View style={styles.Boldtextview}>

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                make
              </Text>

              <ModalDropdown
                onSelect={(index, value) => {
                  modelarrayF(value)
                  // if (value == 'unlisted') {
                  //   alert('Select other option please')
                  // }
                }}
                dropdownTextStyle={{ fontSize: totalSize(2.5), fontFamily: 'BebasNeue-Regular' }}
                dropdownStyle={{ flex: 1, width: 150, borderWidth: 2 }}
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

            <View style={styles.Boldtextview}>

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                model
              </Text>

              <ModalDropdown
                onSelect={(index, value) => setmodel(value)}
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

            <View style={styles.Boldtextview}>

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                year
              </Text>

              <ModalDropdown
                onSelect={(index, value) => setyear(value)}
                dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                dropdownStyle={{ flex: 1, width: width(25), borderWidth: 2 }}
                options={yeararray}>

                <View
                  style={{ width: 90, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                  <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                    {year}

                  </Text>

                  <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                </View>


              </ModalDropdown>

            </View>


            <View style={styles.Boldtextview}>

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                color
              </Text>

              <ModalDropdown
                onSelect={(index, value) => setcolor(value)}
                dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                dropdownStyle={{ flex: 1, width: 120, borderWidth: 2 }}
                options={['unlisted', 'Aquamarine', 'Aqua', 'Blue', 'Black', 'Brown', 'Cyan', 'Gold', 'Green', 'Gray',
                  'Indigo', 'Lime', 'Magenta', 'Orange', 'Purple', 'Pink', 'Red', 'Silver', 'Sky Blue', 'Violet', 'White',
                  'Yellow', ' Zucchini']}>

                <View
                  style={{ width: 120, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                  <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                    {color}

                  </Text>

                  <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                </View>


              </ModalDropdown>

            </View>

            <View style={styles.Boldtextview}>

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
                    { width: 95, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }
                    : { width: 50, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                  <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                    {door}

                  </Text>

                  <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                </View>


              </ModalDropdown>

            </View>

            <View style={styles.Boldtextview}>

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                seats
              </Text>

              <ModalDropdown

                onSelect={(index, value) => setminseats(value)}
                dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                dropdownStyle={{ flex: 1, width: width(20), borderWidth: 2 }}
                options={[2, 4, 5, 6, 7, 8, 9, 10, 11, 12]}>

                <View
                  style={{ width: 50, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                  <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                    {minseats}

                  </Text>

                  <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                </View>


              </ModalDropdown>

            </View>

            <View style={styles.Boldtextview}>

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                body type
              </Text>

              <ModalDropdown
                onSelect={(index, value) => setbodytype(value)}
                dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                dropdownStyle={{ flex: 1, width: width(28), borderWidth: 2 }}
                options={['Coupe', 'Converted', 'saloon', 'hatchback', 'estate', 'mpv', 'minibus', 'suv', 'van', 'unlisted']}>

                <View
                  style={{ width: 100, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                  <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                    {bodytype}

                  </Text>

                  <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                </View>


              </ModalDropdown>

            </View>

            <View style={styles.Boldtextview}>

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

            <View style={styles.Boldtextview}>

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

            <View style={styles.Boldtextview}>

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                millage's
              </Text>

              <TextInput
                keyboardType='number-pad'
                onChangeText={(text) => setmillage(text)}
                style={{ fontSize: totalSize(3), textAlign: 'right', width: width(30), borderWidth: 1, paddingVertical: 0, fontFamily: 'BebasNeue-Regular' }}
              />

            </View>

            <View style={styles.Boldtextview}>

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                engine
              </Text>

              <View style={{ height: height(5), width: width(43.5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                <ModalDropdown
                  defaultIndex={0}
                  onSelect={(index, value) => setenginType(value)}
                  dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                  dropdownStyle={{ height: 100, width: 40, borderWidth: 2 }}
                  options={['L', 'CC']}>

                  <View
                    style={{
                      height: height(5), width: width(13), paddingLeft: 2,
                      borderWidth: 1, flexDirection: 'row', justifyContent: 'flex-end',
                      alignItems: 'center'
                    }}>

                    <Text style={{
                      fontSize: totalSize(3),
                      fontFamily: 'BebasNeue-Regular', color: '#000'
                    }}>

                      {engineType}

                    </Text>

                    <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                  </View>


                </ModalDropdown>

                <View style={{ width: width(30), borderWidth: 1 }}>

                  <TextInput
                    keyboardType='numeric'
                    onChangeText={(text) => setengine(text)}
                    style={{ fontSize: totalSize(3), textAlign: 'right', paddingVertical: 0, marginLeft: width(2), fontFamily: 'BebasNeue-Regular' }}
                  />

                </View>

              </View>

            </View>

            < View style={styles.Boldtextview}>

              <Text style={{
                fontSize: totalSize(3),
                fontFamily: 'BebasNeue-Regular'
              }}>
                Price
              </Text>

              <View style={{
                height: height(5), width: width(43.5),
                flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center'
              }}>

                <ModalDropdown
                  defaultIndex={0}
                  onSelect={(index, value) => setpricetype(value)}
                  dropdownTextStyle={{
                    fontSize: totalSize(3),
                    fontFamily: 'BebasNeue-Regular'
                  }}
                  dropdownStyle={{ height: 150, width: 40, borderWidth: 2 }}
                  options={['Rs', '$', '£', '€', '¥', '₹', 'د.إ', '৳', 'Rp',
                    'RM', '₩']}>

                  <View
                    style={{
                      height: height(5), width: width(13), borderWidth: 1,
                      flexDirection: 'row', justifyContent: 'flex-end',
                      alignItems: 'center', paddingLeft: 5
                    }}>

                    <Text style={{
                      fontSize: totalSize(3),
                      fontFamily: 'BebasNeue-Regular', color: '#000'
                    }}>

                      {pricetype}

                    </Text>

                    <MaterialIcons name='arrow-drop-down' size={25} color='#868887'
                      style={{
                        // borderWidth: 1,
                        width: 20
                      }} />

                  </View>


                </ModalDropdown>

                <View style={{ width: width(30), borderWidth: 1 }}>

                  <TextInput
                    keyboardType='numeric'
                    onChangeText={(text) => setpriceValue(text)}
                    style={{ fontSize: totalSize(3), textAlign: 'right', paddingVertical: 0, fontFamily: 'BebasNeue-Regular' }}
                  />

                </View>

              </View>

            </View>

            <View style={{ height: height(20) }} />

            <Modal
              animationType={'fade'}
              transparent={true}
              visible={visible}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ height: height(20), width: width(50), backgroundColor: '#fff', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#000" />
                  <Text style={{ marginTop: height(3), fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>
                    Posting add
                  </Text>
                </View>

              </View>
            </Modal>

          </ScrollView>


          <TouchableHighlight
            underlayColor='#242527'
            style={{
              height: height(5), shadowColor: "#000",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.20,
              shadowRadius: 1.41,
              elevation: 2, width: scale, marginTop: height(85), position: 'absolute', zIndex: 1, alignSelf: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#fabb47', borderRadius: 10, justifyContent: 'center'
            }}
            onPress={() => Placead()}
          >

            <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#fabb47', alignSelf: 'center' }}>
              place ad
            </Text>

          </TouchableHighlight>

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
                style={{ height: height(40), marginTop: 2 }}
                onMapReady={() => {

                }}
                showsUserLocation provider="google"
                showsMyLocationButton={true}
                followsUserLocation={true}
                initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 100,
                  longitudeDelta: 100,
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
                      radius={slider * 1000}
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
                onPress={() => {
                  apply()

                }}
                style={{ height: height(5), width: width(40), marginTop: height(5), alignSelf: 'center', borderWidth: 1.5, borderColor: '#fabb47', borderRadius: 10, justifyContent: 'center' }}>

                <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#fabb47', alignSelf: 'center' }}>
                  apply
                </Text>

              </TouchableHighlight>


            </View>

          </Modal>
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
  Boldtextview: {
    height: height(9),
    marginTop: height(2),
    borderBottomWidth: 1,
    padding: width(2.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})