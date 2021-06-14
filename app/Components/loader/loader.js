import React from 'react';
import { View, ActivityIndicator } from 'react-native'

export default Loader = props => {

  return (
    <ActivityIndicator
      size='large'
      color={props.color}

    />
  )
}