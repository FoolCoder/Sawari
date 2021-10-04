import React, { Component, Fragment, useEffect, useState, useRef } from 'react'
import { View, ImageBackground, Text, TextInput, TouchableOpacity, TouchableHighlight, SafeAreaView, FlatList, StyleSheet, Modal, ScrollView } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import Slider from '@react-native-community/slider';

import Geocoder from 'react-native-geocoding';

import AsyncStorage from '@react-native-community/async-storage'

import { link, apikey } from '../../links/links'

import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps'

import ModalDropdown from 'react-native-modal-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { set } from 'react-native-reanimated';


export default function Rprivate({ navigation }) {
  const [city, setcity] = useState('city')
  const [distance, setdistance] = useState('distance')
  const [make, setmake] = useState(null)
  const [model, setmodel] = useState(null)

  const [makearray, setmakearray] = useState([])
  const [modelarray, setmodelarray] = useState([])

  const [yeararray, setyeararrey] = useState([])

  const [sellertype, setsellertype] = useState(null)
  const [minyear, setminyear] = useState('min')
  const [maxyear, setmaxyear] = useState('max')
  const [color, setcolor] = useState(null)
  const [rentType, setrentType] = useState(null)
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
  const [loc, setloc] = useState(null)
  const [slider, setslider] = useState(5)

  const [visible, setvisible] = useState(false)
  const [slocation, setslocation] = useState(false)
  const [applylocationS, setapplylocationS] = useState(false)

  const map = useRef(null)

  useEffect(() => {
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
    setslider(0)
    setapplylocationS(false)
  }

  const apply = () => {
    if (mapsearch != '') {
      setapplylocationS(true)
      setslocation(false)
    }
    else {
      alert('Choice location')
    }
  }

  const search = () => {
    var data = {}
    data.hiringType = 2
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
    if (rentType !== null) {
      data.rentType = rentType
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


    navigation.navigate('rcarslist', { data: data })

  }

  return (
    <View style={{ flex: 1 }}>

      <TouchableOpacity
        onPress={() => setslocation(true)}
        style={{ height: height(5), width: width(70), marginTop: height(3), alignSelf: 'center', borderWidth: 1.5, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>

        <View style={{ width: width(5) }} />

        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
          select location
           </Text>


      </TouchableOpacity>

      <View style={{ marginTop: height(3), borderWidth: 0.3 }} />

      {applylocationS == false ?

        <Text style={{ fontSize: totalSize(1.4), marginTop: height(1), alignSelf: 'center', color: '#FF0000' }}>
          City and distance will fill on select location section
        </Text>
        :

        <View style={{ width: width(95), marginTop: height(1), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >

          <View>

            <View style={{ width: width(30), borderBottomWidth: 0.5 }}>

              <Text
                numberOfLines={1}
                style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                {mapsearch}
              </Text>

            </View>

            <Text style={{ fontSize: totalSize(1.4), fontFamily: 'BebasNeue-Regular' }}>
              city
          </Text>

          </View>

          <View>

            <View style={{ width: width(30), borderBottomWidth: 0.5 }}>

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                {slider}
              </Text>

            </View>

            <Text style={{ fontSize: totalSize(1.4), fontFamily: 'BebasNeue-Regular' }}>
              distance
          </Text>

          </View>

        </View>

      }

      <TouchableOpacity
        onPress={() => setvisible(true)}
        style={{ height: height(5), width: width(70), marginTop: height(5), alignSelf: 'center', borderWidth: 1.5, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

        <View style={{ width: width(5) }} />

        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
          MORE FILTERS
           </Text>

        <MaterialIcons name='arrow-drop-down' size={25} />


      </TouchableOpacity>

      <TouchableHighlight
        underlayColor='#000'
        onPress={() => search()}
        style={{ height: height(5), width: width(40), marginTop: height(35), alignSelf: 'center', borderWidth: 1.5, borderColor: '#fabb47', borderRadius: 10, justifyContent: 'center' }}>

        <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#fabb47', alignSelf: 'center' }}>
          SEARCH
    </Text>

      </TouchableHighlight>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visible}
        onRequestClose={() => setvisible(false)}
      >
        <ScrollView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>

          <View style={{ height: height(71), width: width(95), marginTop: height(20), alignSelf: 'center', backgroundColor: 'white', borderRadius: 10 }}>

            <View style={{ height: height(7), width: width(90), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <TouchableOpacity
                onPress={() => setvisible(false)}>

                <MaterialIcons name='arrow-drop-up' size={40} color='#a2a2a2' />

              </TouchableOpacity>

              <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#a2a2a2' }}>
                filter options
               </Text>

              <View style={{ width: width(10) }} />

            </View>

            <View style={{ borderWidth: 0.7 }} />

            <ScrollView style={{ width: width(90), alignSelf: 'center' }}>

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
                  onSelect={(index, value) => modelarrayF(value)}
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
                  color
                  </Text>

                <ModalDropdown
                  onSelect={(index, value) => setcolor(value)}
                  dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                  dropdownStyle={{ flex: 1, width: 120, borderWidth: 2 }}
                  options={['unlisted', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Brown', 'Magenta', 'Tan', 'Cyan', 'Olive', 'Maroon', 'Navy', 'Aquamarine', 'Turquoise', 'Silver', 'Lime', 'Teal', 'Indigo', 'Violet', 'Pink', 'Black', 'White', 'Gray']}>

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
                  rent type
                  </Text>

                <ModalDropdown
                  onSelect={(index, value) => setrentType(value)}
                  dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                  dropdownStyle={{ flex: 1, width: width(25), borderWidth: 2 }}
                  options={['P/D', 'P/W', 'P/M', 'P/Q', 'P/Y']}>

                  <View
                    style={{ width: 90, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                      {rentType}

                    </Text>

                    <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

                  </View>


                </ModalDropdown>

              </View>

              <View style={{ marginTop: height(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                  rent
                   </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                  <ModalDropdown
                    defaultIndex={0}
                    onSelect={(index, value) => setpricetype(value)}
                    dropdownTextStyle={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}
                    dropdownStyle={{ height: 150, width: 40, borderWidth: 2 }}
                    options={['$', '£', '€']}>

                    <View
                      style={{ height: height(5), width: 40, borderWidth: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                      <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                        {pricetype}

                      </Text>

                      <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

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
                  dropdownStyle={{ flex: 1, width: width(27), borderWidth: 2 }}
                  options={['saloon', 'hatchback', 'estate', 'mvp', 'minibus', 'suv', 'van', 'unlisted']}>

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
                      style={engineType == 'L' ?
                        { height: height(5), width: 40, borderWidth: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }
                        :
                        { height: height(5), width: 50, borderWidth: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                      <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>

                        {engineType}

                      </Text>

                      <MaterialIcons name='arrow-drop-down' size={25} color='#868887' />

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

              <View style={{ height: height(2) }} />

            </ScrollView>

          </View>

        </ScrollView>
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
          </MapView>

          <View style={{ width: width(95), marginTop: height(4), alignSelf: 'center' }}>

            <Text style={{ fontSize: totalSize(3), width: width(90), alignSelf: 'center', fontFamily: 'BebasNeue-Regular' }}>
              custom radius
          </Text>

            <Text style={{ fontSize: totalSize(2.2), width: width(90), alignSelf: 'center', color: '#b8b8b8', fontFamily: 'BebasNeue-Regular' }}>
              show listing at specfied distance
          </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              <Slider
                style={{ marginTop: height(1), height: 40, width: width(80) }}
                minimumValue={5}
                maximumValue={30}
                minimumTrackTintColor="#005CE7"
                maximumTrackTintColor="#C4C4C4"
                thumbTintColor='#005CE7'
                value={slider}
                onValueChange={(slide) => setslider(parseInt(slide))}
              />

              <Text style={{ fontSize: totalSize(3), width: width(90), color: '#b8b8b8', fontFamily: 'BebasNeue-Regular' }}>
                {slider} km
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

    </View >
  )
}
const styles = StyleSheet.create({
  map: {
    height: height(35),
    width: width(100),
    marginTop: height(5)
  },
});