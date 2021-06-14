import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, TouchableHighlight, ScrollView } from 'react-native'
import { width, height, totalSize } from 'react-native-dimension';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import AsyncStorage from '@react-native-community/async-storage'

import { link } from '../links/links'
import Header from '../header/header'
import Loader from '../loader/loader'
import { useSelector } from 'react-redux';

// import RentOut from './RentOut'
// import SellingAdsHorizontal from './SellingAdsHorizontal'
// import RentoutHorizontal from './RentOutHorizontal'


export default function MyProfile({ navigation, route }) {

  const [sellLoader, setsellLoader] = useState(true)
  const [rentLoader, setrentLoader] = useState(true)
  const [NLoader, setNLoader] = useState(true)
  const [frameType, setFrameType] = useState(1);
  const [user, setuser] = useState({})
  const [selladds, setselladds] = useState([])
  const [rentadds, setrentadds] = useState([])
  const [favouriteSell, setfavouriteSell] = useState([])
  const [notification, setnotification] = useState([])
  const [selladdFlat, setselladdFlat] = useState(false)
  const [rentaddFlat, setrentaddFlat] = useState(false)
  const [FSaddFlat, setFSaddFlat] = useState(false)

  const userdetail = useSelector((state) => state.user)
  const reload = useSelector((state) => state.reload)


  useEffect(() => {
    openSell()
    openRent()
    openFavouriteSell()
    openNotification()
  }, [reload])

  const openSell = async () => {
    const val = JSON.parse(await AsyncStorage.getItem('token'))

    setuser(val)

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
          // console.log(responseJson);
          if (responseJson.type === 'success') {
            var val = responseJson.result
            val.reverse()
            setselladds(val)
            setsellLoader(false)
            // setload(false)
            // setmodalloader(false)
          }
          else {
            alert('Check your Internet Connection')
            setsellLoader(false)
            // setload(false)
            // setmodalloader(false)
          }
        }).catch(e => {
          alert('Check your Internet Connection')
          setsellLoader(false)
          // setmodalloader(false)
        })
    } catch (e) {

    }

  }

  const openRent = async () => {
    const val = JSON.parse(await AsyncStorage.getItem('token'))

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + val.token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };


    try {
      fetch(link + '/rent/getRentByUser?userId=' + val.id, requestOptions)
        .then((response) => response.json())
        .then(async (responseJson) => {
          // console.log('responseJso');
          if (responseJson.type === 'success') {
            var val = responseJson.result
            val.reverse()
            setrentadds(val)
            setrentLoader(false)
            // setload(false)
            // setmodalloader(false)
          }
          else {
            alert('Check your Internet Connection')
            setrentLoader(false)
            // setload(false)
            // setmodalloader(false)
          }
        }).catch(e => {
          alert('Check your Internet Connection')
          setrentLoader(false)
          // setmodalloader(false)
        })
    } catch (e) {
      alert('Check your Internet Connection')
    }

  }

  const openFavouriteSell = async () => {
    const val = JSON.parse(await AsyncStorage.getItem('token'))

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + val.token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };


    try {
      fetch(link + '/ad/getFavouritedAds?userId=' + val.id, requestOptions)
        .then((response) => response.json())
        .then(async (responseJson) => {
          // console.log(responseJson);
          if (responseJson.type === 'success') {
            var val = responseJson.result
            val.reverse()
            setfavouriteSell(val)
            // setrentLoader(false)
            // setload(false)
            // setmodalloader(false)
          }
          else {
            alert('Check your Internet Connection')
            setrentLoader(false)
            // setload(false)
            // setmodalloader(false)
          }
        }).catch(e => {
          alert('Check your Internet Connection')
          setrentLoader(false)
          // setmodalloader(false)
        })
    } catch (e) {
      alert('Check your Internet Connection')
    }

  }

  const openNotification = async () => {

    const val = JSON.parse(await AsyncStorage.getItem('token'))

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + val.token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };


    try {
      fetch(link + '/notifications/getNotifcationsByUser?userId=' + val.id, requestOptions)
        .then((response) => response.json())
        .then(async (responseJson) => {
          // console.log(responseJson);
          if (responseJson.type === 'success') {
            var val = responseJson.result
            // console.log(val)
            val.reverse()
            setnotification(val)
            setNLoader(false)
            // setload(false)
            // setmodalloader(false)
          }
          else {
            alert('Check your Internet Connection')
            setNLoader(false)
            // setload(false)
            // setmodalloader(false)
          }
        }).catch(e => {
          alert('Check your Internet Connection')
          setNLoader(false)
          // setmodalloader(false)
        })
    } catch (e) {
      alert('Check your Internet Connection')
    }

  }


  const statusSell = async (item, index) => {
    try {

      const val = JSON.parse(await AsyncStorage.getItem('token'))

      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + val.token);

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(link + '/ad/changeSoldStatus?adID=' + item._id + '&sold=' + !item.sold, requestOptions)
        .then((response) => response.json())
        .then(async (responseJson) => {

          selladds.map((e, i) => {
            if (i == index) {
              e.sold = !e.sold
            }
          })
          setselladds(selladds)
          setselladdFlat(!selladdFlat)
        }
        )
    } catch (e) {
      alert('Check your Internet Connection')
    }
  }

  const statusRent = async (item, index) => {
    try {

      const val = JSON.parse(await AsyncStorage.getItem('token'))

      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + val.token);

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(link + '/rent/changeRentOutStatus?rentID=' + item._id + '&rentOuted=' + !item.rentOuted, requestOptions)
        .then((response) => response.json())
        .then(async (responseJson) => {

          rentadds.map((e, i) => {
            if (i == index) {
              e.sold = !e.sold
            }
          })
          setrentadds(rentadds)
          setrentaddFlat(!rentaddFlat)
        }
        )
    } catch (e) {
      alert('Check your Internet Connection')
    }
  }

  const statusFS = (item, index) => {
    try {

      let api = ''
      // let data = favouriteSell

      // if (item.isfavourite == false) {
      //   api = '/ad/makeFavourite?userId=' + user.id + '&adId=' + item._id
      //   data[index].isfavourite = !data[index].isfavourite
      // }
      // else if (item.isfavourite == true) {
      api = '/ad/removeFavourite?userId=' + user.id + '&adId=' + item._id
      // data[index].isfavourite = !data[index].isfavourite
      // }

      favouriteSell.splice(index, 1)

      setFSaddFlat(!FSaddFlat)

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
          if (responseJson.type == 'success') {

            setfavouriteSell(favouriteSell)

            // dispatch(newsFeedR(!reload))
          }
        })
        .catch((e) => {

        })

    }
    catch (e) {

    }
  }


  const FlatListSell = ({ item, index }) => (
    <View style={{ alignSelf: 'center', marginTop: height(2) }}>

      <View style={{ borderWidth: 2, borderRadius: 7, marginHorizontal: width(1.5), height: height(18), width: width(45) }}>

        <Image
          style={{ height: height(11), borderRadius: 5.7 }}
          source={{ uri: link + '/' + item.images[0] }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width(40), alignItems: 'center', alignSelf: 'center' }}>

          <Text
            numberOfLines={1}
            style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(2.5), width: width(20) }}>{item.title}</Text>

          {item.sold == true ?

            <TouchableOpacity
              onPress={() => statusSell(item, index)}
              style={{ backgroundColor: '#219653', width: width(11), height: height(2.1), justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(1.5), color: 'white' }}>Sold</Text>
            </TouchableOpacity>

            :

            <TouchableOpacity
              onPress={() => statusSell(item, index)}
              style={{ backgroundColor: '#B83C3C', width: width(11), height: height(2.1), justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(1.2), color: 'white' }}>Available</Text>
            </TouchableOpacity>

          }

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width(40), alignItems: 'center', alignSelf: 'center' }}>

          <View style={{ flexDirection: 'row', width: width(20) }}>

            <Text style={{ color: '#B83C3C', fontFamily: "BebasNeue-Regular" }}>{item.priceCurrency}</Text>

            <Text style={{ color: '#B83C3C', marginLeft: width(1), fontFamily: "BebasNeue-Regular" }}>{item.priceValue}</Text>

          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('editadd', { data: item })}
            style={{ borderWidth: 1, width: width(11), height: height(2.1), alignItems: 'center' }}>
            <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(1.5) }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );

  const FlatListRent = ({ item, index }) => (
    <View style={{ alignSelf: 'center', marginTop: height(2) }}>

      <View style={{ borderWidth: 2, borderRadius: 7, marginHorizontal: width(1.5), height: height(18), width: width(45) }}>

        <Image
          style={{ height: height(11), borderRadius: 5.7 }}
          source={{ uri: link + '/' + item.images[0] }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width(40), alignItems: 'center', alignSelf: 'center' }}>

          <Text
            numberOfLines={1}
            style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(2.5), width: width(20) }}>{item.title}</Text>

          {item.sold == true ?

            <TouchableOpacity
              onPress={() => statusRent(item, index)}
              style={{ backgroundColor: '#219653', width: width(11), height: height(2.1), justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(1.5), color: 'white' }}>Sold</Text>
            </TouchableOpacity>

            :

            <TouchableOpacity
              onPress={() => statusRent(item, index)}
              style={{ backgroundColor: '#B83C3C', width: width(11), height: height(2.1), justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(1.2), color: 'white' }}>Available</Text>
            </TouchableOpacity>

          }

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width(40), alignItems: 'center', alignSelf: 'center' }}>

          <View style={{ flexDirection: 'row', width: width(20) }}>

            <Text style={{ color: '#B83C3C', fontFamily: "BebasNeue-Regular" }}>{item.priceCurrency}</Text>

            <Text style={{ color: '#B83C3C', marginLeft: width(1), fontFamily: "BebasNeue-Regular" }}>{item.priceValue}</Text>

          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('roeditadd', { data: item })}
            style={{ borderWidth: 1, width: width(11), height: height(2.1), alignItems: 'center' }}>
            <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(1.5) }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );

  const FlatListFS = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('SCD', { data: item })}
      style={{ alignSelf: 'center', marginTop: height(2) }}>

      <View style={{ borderWidth: 2, borderRadius: 7, marginHorizontal: width(1.5), height: height(18), width: width(45) }}>

        <Image
          style={{ height: height(11), borderRadius: 5.7 }}
          source={{ uri: link + '/' + item.images[0] }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width(40), alignItems: 'center', alignSelf: 'center' }}>

          <Text
            numberOfLines={1}
            style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(2.5), width: width(20) }}>{item.title}</Text>

          {item.sold == true ?

            <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(1.7), color: '#219653' }}>Sold</Text>

            :
            <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(1.4), color: '#B83C3C' }}>Available</Text>

          }

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width(40), alignItems: 'center', alignSelf: 'center' }}>

          <View style={{ flexDirection: 'row', width: width(20) }}>

            <Text style={{ color: '#B83C3C', fontFamily: "BebasNeue-Regular" }}>{item.priceCurrency}</Text>

            <Text style={{ color: '#B83C3C', marginLeft: width(1), fontFamily: "BebasNeue-Regular" }}>{item.priceValue}</Text>

          </View>

          {/* {item.isfavourite == true ? */}
          <TouchableOpacity
            onPress={() => statusFS(item, index)}
            style={{ borderWidth: 1, borderRadius: 3, borderColor: '#555' }}
          >

            <MaterialCommunityIcons name='heart' size={10} color='#FFBB41' style={{ paddingVertical: 2, paddingHorizontal: 4 }} />

          </TouchableOpacity>
          {/* :
            <TouchableOpacity
              onPress={() => Favourite(item, index)}
              style={{ borderWidth: 1, borderRadius: 3, borderColor: '#555' }}
            >

              <MaterialCommunityIcons name='heart' size={10} color='#777' style={{ paddingVertical: 2, paddingHorizontal: 4 }} />

            </TouchableOpacity>

          } */}

        </View>
      </View>

    </TouchableOpacity>
  );

  const FlatListNotification = ({ item, index }) => (

    <TouchableOpacity
      onPress={() => navigation.navigate('chatStack', {
        screen: 'chat',
        params: {
          data: item,
          name: item.user.name,
          room: [item.room],
          user: true
        }
      })}
      style={{ width: width(90), marginVertical: height(1.5), alignSelf: 'center', backgroundColor: '#FFBB4190', borderRadius: 10 }}>

      <View style={{ width: width(85), marginVertical: height(1), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>

        <Image
          source={{ uri: link + '/' + item.user.image }}
          style={{ height: totalSize(6), width: totalSize(6), borderRadius: totalSize(3), marginTop: height(0.5) }}
        />

        <View style={{ width: width(68) }}>

          <Text
            numberOfLines={1}
            style={{ fontSize: totalSize(3) }}>

            {item.user.name}

          </Text>

          <Text
            numberOfLines={3}
            style={{ fontSize: totalSize(1.5) }}>

            {item.message.text}

          </Text>

        </View>

      </View>

    </TouchableOpacity>
  )


  return (
    <View style={styles.conatiner}>

      <Header text='My Profile' back={() => navigation.goBack()} />

      <View style={styles.containerBottom}>

        <View style={styles.profileStyle}>

          <Image
            style={{ width: 90, height: 90, borderRadius: 45 }}
            source={{ uri: link + '/' + userdetail.userDetails.image }} />

          <View style={{ alignSelf: 'center', marginLeft: width(3.5) }}>

            <Text
              style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(3.2) }}>
              {userdetail.userDetails.name}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('editprofile')}
              style={{ borderWidth: 1, alignItems: 'center', width: width(26), borderRadius: 2.9, marginTop: height(1.5) }}>
              <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(1.9) }}>Edit Profile</Text>
            </TouchableOpacity>

          </View>
        </View>

        <View style={{ flexDirection: 'row', width: width(90), justifyContent: 'space-between', marginTop: height(5) }}>

          <TouchableOpacity
            onPress={() => setFrameType(1)}
            style={[(frameType === 1) ? styles.activeButtonLayout : styles.btn3Layout]}>

            <Text style={[(frameType === 1) ? styles.btn3TextDesignChange : styles.btn3TextDesign]}>Selling Ads</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFrameType(2)}
            style={[(frameType === 2) ? styles.activeButtonLayout : styles.btn3Layout]}>

            <Text style={[(frameType === 2) ? styles.btn3TextDesignChange : styles.btn3TextDesign]}>Rent Out Ads</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFrameType(3)}
            style={[(frameType === 3) ? styles.activeButtonLayout : styles.btn3Layout]}>

            <View style={{ flexDirection: 'row' }}>

              <MaterialCommunityIcons name="heart" color={(frameType === 3) ? '#FFBB41' : '#000'} size={totalSize(1.4)} />

              <Text style={[(frameType === 3) ? styles.btn3TextDesignChange : styles.btn3TextDesign]}>{' '}Favourites</Text>
            </View>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFrameType(4)}
            style={[(frameType === 4) ? styles.activeButtonLayout : styles.btn3Layout]}>

            <View style={{ flexDirection: 'row' }}>

              <MaterialCommunityIcons name="bell" color={(frameType === 4) ? '#FFBB41' : '#000'} size={totalSize(1.4)} />

              <Text style={[(frameType === 4) ? styles.btn3TextDesignChange : styles.btn3TextDesign]}>{' '}Notification</Text>
            </View>

          </TouchableOpacity>

        </View>



        {(() => {
          if (frameType == 1) {
            return (
              sellLoader == true ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Loader
                    color='#000'
                  />
                </View>
                :
                <View style={{ flex: 1, width: width(96), borderTopWidth: 1.4, borderColor: '#C4C4C4', marginTop: height(3.5) }}>
                  <FlatList
                    numColumns={2}
                    data={selladds}
                    renderItem={FlatListSell}
                    ListFooterComponent={<View style={{ height: height(4) }} />}
                    extraData={selladdFlat}
                    keyExtractor={(item, index) => { return index.toString() }}
                  />
                </View>
            )
          } else if (frameType == 2) {
            return (
              rentLoader == true ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Loader
                    color='#000'
                  />
                </View>
                :
                <View style={{ flex: 1, width: width(96), borderTopWidth: 1.4, borderColor: '#C4C4C4', marginTop: height(3.5) }}>
                  <FlatList
                    numColumns={2}
                    data={rentadds}
                    renderItem={FlatListRent}
                    ListFooterComponent={<View style={{ height: height(4) }} />}
                    extraData={rentaddFlat}
                    keyExtractor={(item, index) => { return index.toString() }}
                  />
                </View>
            )
          }
          else if (frameType == 3) {
            return (
              <View style={{ borderTopWidth: 1.4, borderColor: '#C4C4C4', marginTop: height(3.5), width: width(100) }}>
                <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(2.5), marginTop: height(2), alignSelf: 'center', width: width(93) }}>Selling Ads</Text>

                <FlatList
                  data={favouriteSell}
                  renderItem={FlatListFS}
                  extraData={FSaddFlat}
                  keyExtractor={(item, index) => { return index.toString() }}
                  ListHeaderComponent={<View style={{ width: width(2) }} />}
                  ListFooterComponent={<View style={{ width: width(2) }} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />

                <Text style={{ fontFamily: "BebasNeue-Regular", fontSize: totalSize(2.5), marginTop: height(4), alignSelf: 'center', width: width(93) }}>Rent Out</Text>
                {/* <RentoutHorizontal /> */}
              </View>
            )
          }
          else if (frameType == 4) {
            return (
              NLoader == true ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Loader
                    color='#000'
                  />
                </View>
                :
                <View style={{ flex: 1, width: width(96), borderTopWidth: 1.4, borderColor: '#C4C4C4', marginTop: height(3.5) }}>

                  <FlatList
                    key={'$'}
                    data={notification}
                    keyExtractor={(item, index) => { return '$' + index.toString() }}
                    renderItem={FlatListNotification}
                  />

                </View>
            )
          }
        })()}


      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  conatiner: {
    width: width(100),
    height: height(100),
    backgroundColor: '#232526',
    alignItems: 'center',
  },

  headerStyle: {
    height: height(10),
    flexDirection: 'row',
    width: width(90),
    alignItems: 'center',
  },

  nameStyle: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 25,
    color: '#A3A3A3',
    fontWeight: '400',
    fontStyle: 'normal',
  },

  containerBottom: {
    backgroundColor: '#ffffff',
    width: width(100),
    height: height(90),
    alignItems: 'center',
  },

  profileStyle: {
    flexDirection: 'row',
    width: width(80),
    alignSelf: 'center',
    marginTop: height(3),
  },

  btn3Layout: {
    justifyContent: 'space-between',
    borderWidth: 1,
    width: width(20),
    height: height(4),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3.8,
  },

  activeButtonLayout: {
    justifyContent: 'space-between',
    borderWidth: 1,
    width: width(20),
    height: height(4),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3.8,
    backgroundColor: '#000',
  },

  btn3TextDesign: {
    fontFamily: "BebasNeue-Regular",
    fontSize: totalSize(1.4),
    color: '#000',
  },
  btn3TextDesignChange: {
    fontFamily: "BebasNeue-Regular",
    fontSize: totalSize(1.4),
    color: '#FFBB41',
  },
});