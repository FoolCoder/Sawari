import React, { Component, Fragment, useEffect, useState } from 'react'
import { View, ImageBackground, Text, TextInput, TouchableOpacity, TouchableHighlight, SafeAreaView, StyleSheet, Modal, ScrollView } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'
import ModalDropdown from 'react-native-modal-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import Header from '../header/header'
import Taxi from './tabs/taxi'
import Private from './tabs/private'

const tab = createMaterialTopTabNavigator()

export default function Buymenu({ navigation }) {


  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <View style={{ flex: 1 }}>

          <Header text='BUY MENU' back={() => navigation.goBack()} />

          <tab.Navigator
            tabBarOptions={{ labelStyle: { fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }, indicatorStyle: { backgroundColor: '#fabb47' }, style: { backgroundColor: '#242527' }, activeTintColor: '#fabb47', inactiveTintColor: '#fff' }}>

            <tab.Screen name='TAXI HIRE' component={Taxi} />
            <tab.Screen name='PRIVATE HIRE' component={Private} />

          </tab.Navigator>

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
