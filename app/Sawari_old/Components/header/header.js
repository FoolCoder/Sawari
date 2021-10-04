import React, { Component, Fragment } from 'react'
import { View, ImageBackground, Image, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default Header = props => {



  return (

    <View style={{ backgroundColor: '#242527' }}>

      <View style={{ height: height(10), width: width(95), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

        <TouchableOpacity
          onPress={props.back}
        >
          <MaterialIcons name='arrow-back' size={25} color='#fff' />
        </TouchableOpacity>


        <Text style={{ fontSize: totalSize(4), fontFamily: 'BebasNeue-Regular', color: '#a2a2a2' }}>
          {props.text}
        </Text>

        {props.image == null ?

          <View style={{ width: width(10) }} />

          :
          <TouchableOpacity
            onPress={props.profile}
          >

            <Image
              source={{ uri: props.image }}
              style={{ height: 40, width: 40, borderRadius: 20, borderWidth: 1, borderColor: '#fff' }}
            />

          </TouchableOpacity>

        }

      </View>


    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  }
})