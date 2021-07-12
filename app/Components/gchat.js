import React, { useEffect, useState } from 'react'
import {
    View, Text, Button, TextInput, TouchableOpacity,
    Image, FlatList, SafeAreaView, StyleSheet, ActivityIndicator,
    KeyboardAvoidingView, Alert
} from 'react-native'
import Header from '../Components/header/header'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { height, width, totalSize } from 'react-native-dimension'
import pic from '../assets/image-add.png'
import { link } from './links/links'
import AsyncStorage from '@react-native-community/async-storage'

import { useSelector } from 'react-redux'

var chatLocal = []
export default function Groupchat({ navigation, route }) {

    const [token, settoken] = useState()
    const [massege, setmassege] = useState([])
    const [message, setMessage] = useState()
    const [loader, setloader] = useState(true)
    const [reload, setreload] = useState(false);
    const socket = useSelector((state) => state.socket)

    useEffect(() => {
        Groupapicall()
        return (() => {
            socket.removeAllListeners()
        })
    }, [])


    const sendMessage = () => {
        if (message) {
            let data = {
                room:
                {
                    group: true,   // Your ID and Other User ID .......... if Group Only Your ID
                },
                message: {
                    author: token.userDetails._id,
                    text: message,
                }
            }
            socket.emit('sendMessage', data)
        } else {
            console.log("No message to send");
            //show alert no message
            Alert.alert(
                'Message',
                'Write something'
            )
        }

    }

    const Groupapicall = async () => {

        let api = ''
        // var myHeaders = new Headers();
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        settoken(token);

        //receiving message

        socket.on("messageRecieved", (data) => {
            if (data.group) {
                console.log('message recieved ', data);
                chatLocal = [data.message, ...chatLocal];
                setmassege(chatLocal);
            }
            // });
        });
        socket.on('messageSentAck', (data) => {
            console.log("Acknowledged Response", data)
            console.log('sent')
            if (data.sent && data.group) {
                chatLocal = [data.message, ...chatLocal]
                setmassege(chatLocal)
                setloader(false)
            }
            //     if (data.sent == true) {
            //       try {
            //         if (route.params.room == null) {
            //           route.params.roomF(data.message.room)
            //         }
            //       }
            //       catch (e) {
            //         console.log(e)
            //       }

            //       setroom(data.message.room)

            //       chatLocal = [data.message, ...chatLocal]

            //       setchat(chatLocal)

            //     }
            //     else {
            //       Alert.alert(
            //         'Message',
            //         'Failed to send message'
            //       )
            //     }
            //   })

        });
        try {
            var requestOptions = {
                method: 'GET',
                // headers: myHeaders,
                redirect: 'follow'
            };

            fetch(link + '/room/getGroupMessages' + api, requestOptions)
                .then((response) => response.json())
                .then(async (responseJson) => {
                    if (responseJson.type === 'success') {
                        setmassege(responseJson.result)
                        setreload(!reload);
                        setloader(false)
                        chatLocal = responseJson.result;
                    }

                }).catch((e) => {
                    console.log(e);
                })

        }
        catch (e) {
            console.log(e)
        }

    }



    const renderMassege = ({ item, index }) => {
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
                    text='Global Chat'
                    back={() => navigation.goBack()}
                />
                {
                    loader ?
                        <View style={{ flex: 1, justifyContent: 'center' }}>

                            <Loader
                                color='#000'
                            />
                        </View>
                        :
                        <FlatList
                            style={{
                                // borderWidth: 1,
                                // height:  height(80)
                            }}
                            inverted
                            data={massege}
                            extraData={massege}
                            renderItem={renderMassege}
                            keyExtractor={(item, index) => index.toString()}
                        />}

                <View style={{
                    width: width(95), marginVertical: height(1),
                    borderRadius: 5, alignSelf: 'center', flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center'
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
                            value={message}
                            onChangeText={(text) => setMessage(text)}
                            style={{
                                maxHeight: height(20), width: width(68),
                                fontSize: totalSize(2.2)
                            }}
                        />

                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            sendMessage()
                            setMessage('')
                        }}
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