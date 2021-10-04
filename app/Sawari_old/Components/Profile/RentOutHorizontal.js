import React from 'react'
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native'
import {width, height, totalSize} from 'react-native-dimension';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

	const Data = [
		{
			id: '1',
			img: require('../../assets/SavariImages/HondaCivic.png'),
			title: 'Honda Civic',
			price: '$250',

		},
		{
			id: '2',
			img: require('../../assets/SavariImages/Bugati.png'),
			title: 'Bugati',
			price: '$250',

		},
		{
			id: '3',
			img: require('../../assets/SavariImages/Mustang.png'),
			title: 'Mustang',
			price: '$250',

		},
		{
			id: '4',
			img: require('../../assets/SavariImages/Porsche.png'),
			title: 'Porsche',
			price: '$250',

		},
		{
			id: '5',
			img: require('../../assets/SavariImages/5.png'),
			title: '5',
			price: '$250',

		},
		{
			id: '6',
			img: require('../../assets/SavariImages/6.png'),
			title: 'Foxy',
			price: '$250',

		},
		{
			id: '7',
			img: require('../../assets/SavariImages/6.png'),
			title: 'Foxy',
			price: '$250',

		},
	];

export default function RentoutHorizontal(){

	const Item = ({ title, price, img }) => (
	  <View style={{ borderWidth: 2, borderRadius: 7, marginLeft: width(3), height: height(18), width: width(45)}}>

	  	<Image style={{width: width(44), borderRadius: 7}} source={img} />

	  	<View style={{flexDirection: 'row', justifyContent: 'space-between', width: width(40), alignItems: 'center', alignSelf: 'center'}}>
	  		
	  		<Text style={{fontFamily: "BebasNeue-Regular", fontSize: totalSize(2.5)}}>{title}</Text>

	  		<View style={{backgroundColor: '#219653', width: width(11), height: height(2.1), alignItems: 'center'}}>
	  			<Text style={{fontFamily: "BebasNeue-Regular", fontSize: totalSize(1.5), color: 'white'}}>Sold</Text>
	  		</View>

	  	</View>

	  	<View style={{flexDirection: 'row', justifyContent: 'space-between', width: width(39), alignItems: 'center', alignSelf: 'center' }}>
	  		<Text>{price}</Text>
	  		<TouchableOpacity style={{borderWidth: 1, width: width(11), height: height(2.1), alignItems: 'center'}}>
	  			<Text style={{fontFamily: "BebasNeue-Regular", fontSize: totalSize(1.5)}}>Edit</Text>
	  		</TouchableOpacity>
	  	</View>
	  </View>
	);

	 const renderItem = ({ item }) => (
	 	<View style={{alignSelf: 'center', marginTop: height(2)}}>
	    	<Item img={item.img} title={item.title} price={item.price} />
	    </View>
	  );


	return(
			<FlatList
		        data={Data}
		        renderItem={renderItem}
		        keyExtractor={item => item.id}
		        horizontal
		      />
		)
}

const styles = StyleSheet.create({

});