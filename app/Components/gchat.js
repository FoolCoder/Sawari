import React, { useEffect } from 'react'
import {
    View, Text, Button, TextInput, TouchableOpacity,
    Image, FlatList, SafeAreaView, StyleSheet
} from 'react-native'
import Header from '../Components/header/header'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { height, width, totalSize } from 'react-native-dimension'
import pic from '../assets/image-add.png'

const massege = [
    {
        _id: 1,
        text: 'Hello developer',

        user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
        }
    },

]

export default function Groupchat({ navigation, route }) {
    useEffect(() => {

        // open()

        // return (() => {
        //   socket.removeAllListeners()
        // })

    }, [])


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
            <View style={{

            }}>
                <Text style={{
                    fontSize: totalSize(2)
                }}>
                    {item.text}
                </Text>
                <Text>
                    {item.user.name}
                </Text>
                <Image
                    source={item.user.avatar}
                />

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
                        // height: height(80)
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