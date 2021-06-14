import React, { Component, Fragment, useEffect, useState } from 'react'
import { View, ImageBackground, Image, Text, TouchableHighlight, TouchableOpacity, ActivityIndicator, SafeAreaView, FlatList, StyleSheet } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'
import { useSelector } from 'react-redux'

import Header from '../header/header'

import { link } from '../links/links'

import ModalDropdown from 'react-native-modal-dropdown'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import AsyncStorage from '@react-native-community/async-storage'

import car from '../../assets/car.png'
import ads from '../../assets/ADS.png'

let sortBy = null

export default function Sellmenu({ navigation, route }) {
  const [city, setcity] = useState()
  const [cars, setcars] = useState([])
  const [load, setload] = useState(true)
  const select = useSelector((state) => state.cardetails)

  useEffect(() => {
    sortBy = null

    openD()

    console.log(route.params.data);

  }, [])

  const openD = async () => {
    console.log('Sortby', sortBy)

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

      console.log(val)

      fetch(link + '/ad/getFilteredAds', {
        method: 'POST',
        headers: {
          Authorization: "Bearer " + val.token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filter: route.params.data, sortBy: sort })
      }).then((response) => response.json())
        .then(async (responseJson) => {
          console.log(responseJson);
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

  const changeSort = (index, value) => {
    sortBy = index
    openD()
  }

  const _Flatlist = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('SCD', { data: item })}
        style={{ height: height(15), width: width(95), marginTop: height(3), alignSelf: 'center', borderWidth: 2, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

        <View style={{ marginLeft: width(2) }}>

          <Text
            numberOfLines={1}
            style={{ fontSize: totalSize(3.5), width: width(33), fontFamily: 'BebasNeue-Regular' }}>
            {item.title}
          </Text>

          <Text style={{ fontSize: totalSize(3.5), color: '#931a25', fontFamily: 'BebasNeue-Regular' }}>
            {item.priceCurrency} {item.priceValue}
          </Text>

        </View>

        <ImageBackground
          source={{ uri: link + '/' + item.images[0] }}
          style={{ height: '100%', width: width(55) }}
          imageStyle={{ borderTopRightRadius: 8, borderBottomRightRadius: 8, backgroundColor: 'gray' }}
        >

          {item.sold == false ?

            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }}>

              <View style={{ height: height(5), width: width(25), position: 'absolute', zIndex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderTopLeftRadius: 8, borderBottomRightRadius: 8 }}>

                <Text style={{ fontSize: totalSize(3), color: '#219653', fontFamily: 'BebasNeue-Regular' }}>
                  available
              </Text>

              </View>

            </View>

            :
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }}>

              <View style={{ height: height(5), width: width(25), position: 'absolute', zIndex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderTopLeftRadius: 8, borderBottomRightRadius: 8 }}>

                <Text style={{ fontSize: totalSize(3), color: '#B83C3C', fontFamily: 'BebasNeue-Regular' }}>
                  sold
              </Text>

              </View>

            </View>
          }
        </ImageBackground>

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

          <Header text='BUY MENU' back={() => navigation.goBack()} />

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

                <View style={{ height: height(8), width: '100%', marginTop: height(2), backgroundColor: '#AAAAAA50', justifyContent: 'center' }}>

                  <View style={{ height: height(6), width: '90%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                      Cars found
                    </Text>

                    <ModalDropdown
                      onSelect={(index, value) => changeSort(index, value)}
                      dropdownTextStyle={{ fontSize: totalSize(2.5), fontFamily: 'BebasNeue-Regular' }}
                      dropdownStyle={{ height: height(38), width: width(55), borderWidth: 2 }}
                      options={['most recently listed', 'Price (lowest)', 'Price (hightest)', 'make', 'model', 'millage']}>

                      <View style={{ height: height(5), width: width(30), backgroundColor: '#fff', justifyContent: 'center', borderWidth: 1, borderRadius: 10 }}>

                        <View style={{ width: width(22), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                          <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>

                            sort by

                          </Text>

                          <MaterialIcons name='arrow-drop-down' size={25} color='#000' />

                        </View>

                      </View>

                    </ModalDropdown>

                  </View>

                </View>

                <FlatList
                  data={cars}
                  renderItem={_Flatlist}
                />

              </View>
          }

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