import React, { useEffect, useState } from 'react'
import {
    View, Text, Button, TextInput, TouchableOpacity,
    Image, FlatList, SafeAreaView, StyleSheet
} from 'react-native'
import Header from '../Components/header/header'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { height, width, totalSize } from 'react-native-dimension'
import pic from '../assets/image-add.png'
import { link } from './links/links'
import AsyncStorage from '@react-native-community/async-storage'


export default function Groupchat({ navigation, route }) {
    const [flag, setflag] = useState(false)
    const [token, settoken] = useState()
    const [massege, setmassege] = useState([])
    var groupchat = []
    useEffect(() => {



        Groupapicall()


    }, [])

    const Groupapicall = async () => {
        let api = ''
        // var myHeaders = new Headers();
        settoken(JSON.parse(await AsyncStorage.getItem('token')))
        console.log('ttttttttt', token.userDetails._id);
        try {
            var requestOptions = {
                method: 'GET',
                // headers: myHeaders,
                redirect: 'follow'
            };

            fetch(link + '/room/getGroupMessages' + api, requestOptions)
                .then((response) => response.json())
                .then(async (responseJson) => {
                    console.log(responseJson.result[0])
                    // console.log('kkkkkkkkkkkkkk', responseJson.result)

                    if (responseJson.type === 'success') {
                        groupchat = responseJson.result

                    }

                }).catch((e) => {
                    console.log(e);
                })

        }
        catch (e) {
            console.log(e)
        }
        setmassege(groupchat)
    }

    const open = async () => {

        chatLocal = []
        r = ''
        c = ''

        try {

            let val = JSON.parse(await AsyncStorage.getItem('token'))

            setchatUser(route.params.data)
            c = route.params.data

            setuser(val)

            try {
                if (route.params.room == null) {
                    setroom(route.params.room)
                    r = route.params.room
                }
                else {
                    setroom(route.params.room[0]._id)
                    r = route.params.room[0]._id
                }
            }
            catch (e) {
                console.log(e)
            }

            console.log('rrrrr', r, 'cccccccccc', c)

            apiCall(val)

            socket.on('messageRecieved', (data) => {

                if (r == data.message.room || c._id == data.message.room) {

                    if (data.received == true) {

                        chatLocal = [data.message, ...chatLocal]

                        setchat(chatLocal)

                    }
                }

            })

            socket.on('messageSentAck', (data) => {
                console.log(data)

                if (data.sent == true) {
                    try {
                        if (route.params.room == null) {
                            route.params.roomF(data.message.room)
                        }
                    }
                    catch (e) {
                        console.log(e)
                    }

                    setroom(data.message.room)

                    chatLocal = [data.message, ...chatLocal]

                    setchat(chatLocal)

                }
                else {
                    Alert.alert(
                        'Message',
                        'Failed to send message'
                    )
                }
            })

        }
        catch (e) {
            console.log(e)
        }
    }

    const renderMassege = ({ item }) => {
        return (
            token.userDetails._id !== item.author._id ?

                <View style={{ width: width(95), alignSelf: 'center', flexDirection: 'row', marginTop: height(4) }}>

                    <Image
                        source={{ uri: link + '/' + item.author.image }}
                        style={{ height: 40, width: 40, marginRight: width(2), borderRadius: 20 }}
                    />
                    {/* <Image
                        source={firstarrow}
                        style={{ height: 30, width: 50, marginRight: -40, zIndex: -1 }}
                    /> */}

                    <View style={{ maxWidth: width(60), borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffbb41' }}>

                        <Text style={{ fontSize: totalSize(2.3), padding: 10 }}>
                            {item.text}
                        </Text>

                    </View>

                </View>


                :
                <View style={{ width: width(95), alignSelf: 'center', marginTop: height(4) }}>

                    <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>

                        <View style={{ maxWidth: width(60), borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#c9cbcc' }}>

                            <Text style={{ fontSize: totalSize(2.3), padding: 10 }}>
                                {item.text}
                            </Text>

                        </View>

                        {/* <Image
                            source={secarrow}
                            style={{ height: 30, width: 30, marginLeft: -20, zIndex: -1 }}
                        />   */}
                        <Image
                            source={{ uri: link + '/' + item.author.image }}
                            style={{ height: 40, width: 40, marginLeft: width(2), borderRadius: 20 }}
                        />

                    </View>

                </View>
        )
    }
    return (
        <SafeAreaView
            style={(styles.container)}
        >
            <View style={{

                width: width(98),
                height: height(98),


                alignSelf: 'center'
            }}>
                <Header
                    text='Gorup Chat'
                    back={() => navigation.goBack()}
                />
                <FlatList
                    style={{
                        // borderWidth: 1,
                        // height:  height(80)
                    }}
                    data={massege}

                    renderItem={renderMassege}
                    keyExtractor={(item, index) => item._id}
                />


                <View style={{
                    flexDirection: 'row',
                    width: width(95),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignSelf: 'center'
                }}>
                    <TouchableOpacity>
                        <Image style={{
                            width: 40,
                            height: 40
                        }}
                            source={pic}
                        />
                    </TouchableOpacity>
                    <View style={{ backgroundColor: '#d9d9d9', borderRadius: 5, width: width(65) }}>

                        <TextInput
                            placeholder='Send The message'
                            multiline
                            // value={message}
                            // onChangeText={(text) => setmessage(text)}
                            style={{
                                maxHeight: height(20), width: width(68),
                                fontSize: totalSize(2.2)
                            }}
                        />

                    </View>
                    <TouchableOpacity
                        // onPress={() => sendMessage()}
                        style={{ borderRadius: 40, backgroundColor: '#ffbb41' }}
                    >

                        <MaterialIcons name='send' size={25} style={{ padding: 12 }} />

                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
})