import React, { Component, Fragment, useEffect, useRef, useState } from 'react'
import { View, ImageBackground, Image, Text, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView, ScrollView, Alert, StyleSheet, Modal } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import ImagePicker from 'react-native-image-picker/lib/commonjs';

import Header from '../header/header'
import Loader from '../loader/loader';

import AsyncStorage from '@react-native-community/async-storage'

import profile from '../../assets/profile.png'
import { useDispatch, useSelector } from 'react-redux'
import { link } from '../links/links'
import { newsFeedR, userP } from '../Store/action'

export default function Editprofile({ navigation }) {

  const [loader, setloader] = useState(false)
  const [user, setuser] = useState({})
  const [fullname, setfullname] = useState('')
  const [phone, setphone] = useState('')
  const [email, setemail] = useState('')
  const [image, setimage] = useState(null)
  const [imageChange, setimageChange] = useState(null)

  const dispatch = useDispatch()
  const userProfile = useSelector((state) => state.user)
  const reload = useSelector((state) => state.reload)

  useEffect(() => {
    console.log(userProfile)
    setuser(userProfile)
    setimage(link + '/' + userProfile.userDetails.image)
    setfullname(userProfile.userDetails.name)
    setphone(userProfile.userDetails.phone)
    setemail(userProfile.userDetails.email)
  }, [])

  imagepicker = () => {
    const options = {
      title: 'Set Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        setimageChange(response)
        setimage(response.uri)
        // console.log(response.fileName)
      }
    });
  }

  const updateProfile = async () => {

    setloader(true)

    var data = new FormData()
    data.append("name", fullname)
    data.append('phone', phone)

    if (imageChange !== null) {

      data.append("image", {
        name: imageChange.fileName,
        type: imageChange.type,
        uri: imageChange.uri
      })

    }

    try {
      fetch(link + '/user/updateProfile?userId=' + user.id, {
        method: 'PUT',
        headers: {
          Authorization: "Bearer " + user.token,
          Accept: 'multipart/form-data',
          'Content-Type': 'multipart/form-data'
        },
        body: data
      })
        .then((response) => response.json())
        .then(async (Data) => {

          console.log(Data)

          if (Data.type === 'success') {
            let profile = userProfile
            // console.log(profile)
            profile.userDetails = Data.user
            // console.log(profile)

            await AsyncStorage.setItem('token', JSON.stringify(profile))

            dispatch(userP(profile))

            dispatch(newsFeedR(!reload))

            setloader(false)

            Alert.alert(
              'Profile',
              'Profile update successfully'
            )

          }

        }).catch((e) => {
          console.log(e)
          setloader(false)
        })
    }
    catch (e) {
      console.log(e)
      setloader(false)
    }

  }

  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <View style={{ flex: 1 }}>

          <Header text='EDIT PROFILE'
            back={() => navigation.goBack()}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width: width(90), alignSelf: 'center' }}>

            <Image
              source={{ uri: image }}
              style={{ height: 130, width: 130, alignSelf: 'center', marginTop: height(3), borderRadius: 65 }}
            />

            <TouchableOpacity
              onPress={() => imagepicker()}
              style={{ height: height(6), width: width(40), alignSelf: 'center', marginTop: height(2), justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#242527', borderColor: '#ffc55d', borderWidth: 1 }}
            >

              <Text style={{ fontSize: totalSize(3), color: '#ffc55d', fontFamily: 'BebasNeue-Regular' }}>
                upload image
              </Text>

            </TouchableOpacity>

            <Text style={styles.text}>
              Full name
            </Text>

            <TextInput
              value={fullname}
              onChangeText={(text) => setfullname(text)}
              style={styles.textinput}
            />

            <Text style={styles.text}>
              phone no
            </Text>

            <TextInput
              value={phone}
              onChangeText={(text) => setphone(text)}
              keyboardType='phone-pad'
              style={styles.textinput}
            />

            <Text style={styles.text}>
              email
            </Text>

            <TextInput
              editable={false}
              value={email}
              style={styles.textinput}
            />

            <TouchableOpacity
              onPress={() => updateProfile()}
              style={{ height: height(6), width: width(40), marginVertical: height(4), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#242527', borderColor: '#ffc55d', borderWidth: 1 }}
            >

              <Text style={{ fontSize: totalSize(3), color: '#ffc55d', fontFamily: 'BebasNeue-Regular' }}>
                save
              </Text>

            </TouchableOpacity>

          </ScrollView>

          <Modal
            visible={loader}
            transparent={true}
          >

            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ height: height(20), width: width(50), backgroundColor: '#fff', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Loader color="#000" />
                <Text style={{ marginTop: height(3), fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>
                  Updating Profile
                </Text>
              </View>

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
  text: {
    fontSize: totalSize(3.5),
    marginTop: height(4),
    fontFamily: 'BebasNeue-Regular'
  },
  textinput: {
    fontSize: totalSize(3.2),
    marginTop: height(1),
    color: '#676767',
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontFamily: 'BebasNeue-Regular',
    borderBottomWidth: 1
  }
})