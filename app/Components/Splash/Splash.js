import React, { Component, Fragment, useEffect } from 'react'
import { View, ImageBackground,Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'


import splas from '../../assets/splash.png'

export default function Splash({navigation}) {
  
    return (
      <Fragment>
        <SafeAreaView
          style={(styles.container, { backgroundColor: '#2ca0df' })}
        />
        <SafeAreaView style={styles.container}>

          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

            <ImageBackground style={{ height:250,width:300 }} source={splas}>
            
          </ImageBackground>

          <Text style={{fontSize:totalSize(2.5)}}>

            A market place for

          </Text>

          <Text style={{fontSize:totalSize(2.5)}}>

            taxi's private hire and executive cars
            
          </Text>

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