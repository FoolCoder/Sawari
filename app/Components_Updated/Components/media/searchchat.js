import React, { Component, Fragment, useEffect, useRef, useState } from 'react'
import { View, ImageBackground, Image, Text, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StyleSheet, Modal } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import Geocoder from 'react-native-geocoding';

import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import Header from '../header/header'

import { link } from '../links/links'

import addimage from '../../assets/image-add.png'
import comment from '../../assets/comment.png'
import carpic from '../../assets/carpic.png'
import profile from '../../assets/profile.png'
import chat from '../../assets/chatt.png'

const apikey = 'AIzaSyAsWnoehO1p8crLXkH2QjsdxJvJiZYCCbo'

export default function Searchchat({ navigation }) {
  const [newsfeed, setnewsfeed] = useState([{
    name: 'james charles', time: '9:32 pm'
  }, { name: 'james charles', time: '9:32 pm' },
  { name: 'james charles', time: '9:32 pm' }])
  const [name, setname] = useState('james charles')
  const [mapsearch, setmapsearch] = useState('')
  const [mapsearcharray, setmapsearcharray] = useState([])
  const [loc, setloc] = useState()
  const [slider, setslider] = useState(5)

  const map = useRef(null)

  useEffect(() => {
    Geocoder.init("AIzaSyAsWnoehO1p8crLXkH2QjsdxJvJiZYCCbo");
  }, [])

  const mapsearchlocation = async (text) => {
    setmapsearch(text)

    try {

      const mapurl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=
    ${apikey}&input=${text}&types=(cities)`
      const result = await fetch(mapurl)
      const json = await result.json()

      setmapsearcharray(json.predictions)
    }
    catch (e) {
      console.log(e);
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

  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <View style={{ flex: 1 }}>

          <Header text='CHAT'
            back={() => navigation.goBack()}
            image={profile}
          />

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

              </View>
            }
          </MapView>

          <TouchableHighlight
            underlayColor='#000'
            onPress={() => apply()}
            style={{ height: height(5), width: width(40), marginTop: height(5), alignSelf: 'center', borderWidth: 1.5, borderColor: '#fabb47', borderRadius: 10, justifyContent: 'center' }}>

            <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#fabb47', alignSelf: 'center' }}>
              apply
              </Text>

          </TouchableHighlight>

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
    height: height(60),
    width: '100%',
    marginTop: height(5)
  }
})