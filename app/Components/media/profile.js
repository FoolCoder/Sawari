import React, { Component, Fragment, useEffect, useState, useRef } from 'react'
import { View, ImageBackground, Image, Text, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StyleSheet, Modal, Alert } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { Pages } from 'react-native-pages'

import moment from 'moment-timezone';
import millify from 'millify'
import Header from '../header/header'

import AsyncStorage from '@react-native-community/async-storage'
import FastImage from 'react-native-fast-image'

import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video'
import VideoPlayer from 'react-native-video-player'
import { link } from '../links/links'
import Loader from '../loader/loader'

import addimage from '../../assets/image-add.png'
import commentp from '../../assets/comment.png'
import Cload from '../../assets/Cload.gif'
import carpic from '../../assets/carpic.png'
import profile from '../../assets/profile.png'
import chat from '../../assets/chat.png'
import { useDispatch, useSelector } from 'react-redux'
import { newsFeedR } from '../Store/action'

export default function Profile({ navigation }) {

  const [name, setname] = useState('james charles')
  const [user, setuser] = useState()
  const [msg, setmsg] = useState('')
  const [pics, setpics] = useState([])
  const [videos, setvideos] = useState([])

  const [newsfeed, setnewsfeed] = useState([])
  const [commentV, setcommentV] = useState(false)
  const [commentL, setcommentL] = useState(true)
  const [comment, setcomment] = useState([])
  const [replyV, setreplyV] = useState(false)
  const [replysC, setreplysC] = useState([])
  const textin = useRef(null)
  const [paused, setpaused] = useState(true);

  const [loader, setloader] = useState(true)
  const [Mloader, setMloader] = useState(false)
  const [textflag, settextflag] = useState(false)

  const [commmet1, setcomment1] = useState('')
  const [commmet2, setcomment2] = useState('')

  const [pic, setpic] = useState('')
  const [video, setvideo] = useState('')
  const [videoV, setvideoV] = useState(false)

  const [picV, setpicV] = useState(false)
  const [flagState, setFlagState] = useState(false);
  const [postObject, setpostObject] = useState({})

  const reload = useSelector((state) => state.reload)
  const userProfile = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {

    open()
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      onPlayPausePress()
    });
    return unsubscribe
  }, [reload, navigation])
  const onPlayPausePress = () => {
    setpaused(!paused)

  }
  const open = async () => {

    const val = JSON.parse(await AsyncStorage.getItem('token'))
    setuser(val)
    getNewsFeed(val)
  }

  const getNewsFeed = async (item) => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + item.token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };


    try {
      fetch(link + '/post/getPostsByUser?userId=' + item.id, requestOptions)
        .then((response) => response.json())
        .then(async (responseJson) => {

          if (responseJson.type === 'success') {
            setnewsfeed(responseJson.result)
            // console.log(responseJson.result)
          }
          setTimeout(() => {
            setloader(false)
          }, 500);


        }).catch((e) => {
          console.log(e);
          // setloader(false)
        })
    }
    catch (e) {
      console.log(e);
      setloader(false)
    }

  }

  const uploadpics = async () => {

    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });

      results.map(q => {
        console.log(q.type);
        if (q.type == 'image/jpeg' || q.type == 'image/jpg' || q.type == 'image/png' || q.type == 'image/webp') {
          setpics((prev) => {
            return [
              ...prev, { uri: q.uri, name: q.name, type: q.type }
            ]
          })
        }
        else if (q.type === 'video/mp4' || q.type === 'video/mov' || q.type === 'video/avi' || q.type === 'video/mkv') {
          if (q.size <= 5242880) {
            setvideos((prev) => {
              return [
                ...prev, { uri: q.uri, name: q.name, type: q.type }
              ]
            })

          }
          else {
            alert('video file size out of limit,Max Size limit 5mb')
          }
        }
        else {
          alert('Please select image or video')
        }
      })
      console.log('jjjjjj', results);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }

  }

  const removecarpic = (item) => {
    let pic = pics.filter((e) => {
      return e !== item
    })
    setpics(pic)
  }
  const removevideo = (item) => {
    let video = videos.filter((e) => {
      return e != item
    })
    setvideos(video)
  }
  const addPostFeed = async () => {

    if (pics.length > 0 && pics.length <= 4 && videos.length <= 1) {

      setMloader(true)

      var data = new FormData()
      data.append("user", user.id)
      data.append("text", msg)

      pics.map(q => {

        data.append("images", {
          name: q.name,
          type: q.type,
          uri: q.uri
        })

      })



      try {
        fetch(link + '/post/addPost', {
          method: 'POST',
          headers: {
            Authorization: "Bearer " + user.token,
            Accept: 'multipart/form-data',
            'Content-Type': 'multipart/form-data'
          },
          body: data
        })
          .then((response) => response.json())
          .then((Data) => {

            console.log('assssssssssssssssssss', Data)

            if (Data.type === 'success') {
              setMloader(false)
              setmsg('')
              setpics([])
              setvideos([])
              Alert.alert(
                'Post',
                'Posted Successfully'
              )
              dispatch(newsFeedR(!reload))
            }

          }).catch((e) => {
            console.log(e)
            setMloader(false)
          })
      }
      catch (e) {
        console.log(e)
        setMloader(false)
      }

    }
    else if (videos.length > 0 && videos.length <= 1 && pics.length <= 4) {

      setMloader(true)

      var data = new FormData()
      data.append("user", user.id)
      data.append("text", msg)


      videos.map(q => {

        data.append("images", {
          name: q.name,
          type: q.type,
          uri: q.uri
        })

      })

      try {
        fetch(link + '/post/addPost', {
          method: 'POST',
          headers: {
            Authorization: "Bearer " + user.token,
            Accept: 'multipart/form-data',
            'Content-Type': 'multipart/form-data'
          },
          body: data
        })
          .then((response) => response.json())
          .then((Data) => {

            console.log('assssssssssssssssssss', Data)

            if (Data.type === 'success') {
              setMloader(false)
              setmsg('')
              setpics([])
              setvideos([])
              Alert.alert(
                'Post',
                'Posted Successfully'
              )
              dispatch(newsFeedR(!reload))
            }

          }).catch((e) => {
            console.log(e)
            setMloader(false)
          })
      }
      catch (e) {
        console.log(e)
        setMloader(false)
      }

    }
    else {
      console.log(pics.length);
      console.log(videos.length);

      if (pics.length >= 5) {

        Alert.alert(
          'Post',
          'Maximum 4 images allowed',

        )
      }
      else if (videos.length >= 2) {
        Alert.alert(
          'Post',
          'Maximum 1 video allowed to post'
        )
      }

      else {
        Alert.alert(
          'Post',
          'write something'
        )
      }
    }


  }

  const likeAPI = (item, index) => {
    try {

      let api = ''
      let data = newsfeed

      if (item.isliked == false) {
        api = '/post/liked?userId=' + user.id + '&postId=' + item._id
        data[index].totalLikes = data[index].totalLikes + 1
      }
      else if (item.isliked == true) {
        api = '/post/unliked?userId=' + user.id + '&postId=' + item._id
        data[index].totalLikes = data[index].totalLikes - 1
      }

      data[index].isliked = !data[index].isliked

      setnewsfeed(data)
      setFlagState(!flagState)

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
            dispatch(newsFeedR(!reload))
          }
        })
        .catch((e) => {

        })

    }
    catch (e) {

    }
  }

  const commentsAPI = (item) => {
    try {
      setcommentV(true)
      setpostObject(item)

      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + user.token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(link + '/post/getComments?postId=' + item._id, requestOptions)
        .then((response) => response.json())
        .then(async (responseJson) => {

          if (responseJson.type === 'success') {
            // console.log(responseJson.result[1].replies)
            setcomment(responseJson.result)
            setcommentL(false)

            responseJson.result.map((q) => {
              // q.replies.map(e => {
              //   console.log(e)
              // })
              if (q._id === replysC[0]._id) {
                setreplysC([q])
                // console.log('true')
              }
            })
          }

        }).catch((e) => {
          console.log(e)
          setcommentL(false)
        })

    } catch (e) {
      console.log(e)
      setcommentL(false)
    }
  }

  const commentsAPIPost = () => {
    try {

      if (commmet1 !== '') {

        var val = {
          post: postObject._id,
          text: commmet1,
          user: user.id
        }

        fetch(link + '/post/addComment', {
          method: 'POST',
          headers: {
            Authorization: "Bearer " + user.token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(val)
        })
          .then((response) => response.json())
          .then((Data) => {
            console.log(Data)

            if (Data.type === 'success') {

              setcomment1('')
              commentsAPI(postObject)
            }

          }).catch((e) => {
            console.log(e)
            Alert.alert(
              'Network',
              'Network failed'
            )
          })
      }
      else {
        Alert.alert(
          'Comment',
          'Write something'
        )
      }

    }
    catch (e) {
      console.log(e)
    }

  }

  const repliesAPIPost = () => {

    try {

      if (commmet2 !== '') {

        var val = {
          text: commmet2,
          user: user.id
        }

        fetch(link + '/post/addReply?commentId=' + replysC[0]._id, {
          method: 'PUT',
          headers: {
            Authorization: "Bearer " + user.token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(val)
        })
          .then((response) => response.json())
          .then((Data) => {
            console.log(Data)

            if (Data.type === 'success') {

              setcomment2('')
              commentsAPI(postObject)
            }

          }).catch((e) => {
            console.log(e)
            Alert.alert(
              'Network',
              'Network failed'
            )
          })
      }
      else {
        Alert.alert(
          'Comment',
          'Write something'
        )
      }

    }
    catch (e) {
      console.log(e)
    }

  }

  const _FlatlistP = ({ item }) => {
    return (
      <View style={{ margin: width(1), height: 60 }}>
        <View style={{ height: 60, width: 90 }}>

          <Image
            style={{ height: 50, width: 80, marginTop: 5, borderWidth: 1, borderColor: '#000', backgroundColor: '#bbb', borderRadius: 5 }}
            source={{ uri: item.uri }} />

          <TouchableOpacity
            onPress={() => removecarpic(item)}
            style={{ height: 20, width: 20, alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 1, backgroundColor: '#aaa', borderRadius: 10 }}
          >
            <Text style={{ fontSize: totalSize(1.5), fontWeight: 'bold', color: '#fff' }}>
              X
            </Text>

          </TouchableOpacity>

        </View>
      </View>
    )
  }
  const _FlatlistV = ({ item }) => {
    return (
      <View style={{
        margin: width(1), height: 60,
      }}>
        <View style={{ height: 60, width: 90, alignSelf: 'flex-start', justifyContent: 'flex-start', alignItems: 'flex-start' }}>

          {/* <Image
            style={{ height: 50, width: 80, marginTop: 5, borderWidth: 1, borderColor: '#000', backgroundColor: '#bbb', borderRadius: 5 }}
            source={{ uri: item.uri }} /> */}
          <Video source={{ uri: item.uri }}   // Can be a URL or a local file.
            autoPlay={false}
            shouldPlay={false}
            controls={false}

            // onBuffer={this.onBuffer}                
            // onError={this.videoError}              
            style={{ height: 50, width: 80, marginTop: 5, borderWidth: 1, borderColor: '#000', backgroundColor: '#bbb', borderRadius: 5 }} />

          <TouchableOpacity
            onPress={() => removevideo(item)}
            style={{ height: 20, width: 20, alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 1, backgroundColor: '#aaa', borderRadius: 10 }}
          >
            <Text style={{ fontSize: totalSize(1.5), fontWeight: 'bold', color: '#fff' }}>
              X
            </Text>

          </TouchableOpacity>

        </View>
      </View>
    )
  }
  const _Flatlist = ({ item, index }) => {
    return (

      <View style={
        item.text == ''
          ?
          { minheight: height(52), maxHeight: height(100), width: '100%', marginTop: height(1), backgroundColor: '#FFF' }
          :
          { minheight: height(55), maxHeight: height(100), width: '100%', marginTop: height(1), backgroundColor: '#FFF' }}
      >

        <View style={{ height: height(10), width: width(92), alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>

          <Image
            source={item.user ? { uri: link + '/' + item.user.image } : carpic}
            style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: '#ccc' }}
          />

          <View style={{ marginLeft: width(3) }}>

            <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
              {item.user ? item.user.name : null}
            </Text>

            <Text style={{ fontSize: totalSize(2.2), color: '#868887', fontFamily: 'BebasNeue-Regular' }}>
              {moment(item.createdAt).format('DD-MMM-YY hh:mm a').toUpperCase()}
            </Text>

          </View>

        </View>

        {item.text == '' ?
          null
          :

          <Text style={{ fontSize: totalSize(2), width: width(90), alignSelf: 'center' }}>
            {item.text}
          </Text>
        }

        <View style={{
          height: height(30), marginTop: height(1), width: width(90), alignSelf: 'center',
          borderRadius: 7
        }}>

          <Pages
            indicatorColor='#000'
          >

            {item.media.length > 0 ?

              item.media.map((e) => {
                return (

                  <View>
                    {e.type === 'image' ?
                      <TouchableOpacity
                        onPress={() => {
                          setpic(e.name)
                          setpicV(true)
                        }}
                      >

                        <FastImage
                          source={{
                            uri: link + '/' + e.name,
                            priority: FastImage.priority.high
                          }}
                          style={{ height: height(25), width: width(92), borderRadius: 7, alignSelf: 'center', backgroundColor: '#898' }}
                        />


                      </TouchableOpacity>
                      :
                      <View>

                        <TouchableOpacity
                          style={{
                            alignItems: 'flex-end', marginRight: 10, right: 0,
                            position: 'absolute', zIndex: 1

                          }}
                          onPress={() => {
                            setvideo(e.name)
                            setvideoV(true)
                            setpaused(!paused)
                          }}
                        >
                          <MaterialIcons name='fullscreen' size={30} />
                        </TouchableOpacity>

                        <VideoPlayer
                          video={{ uri: link + '/' + e.name }}
                          resizeMode={'cover'}
                          paused={paused}
                          style={{
                            height: height(25), width: width(92), borderRadius: 7,
                            alignSelf: 'center', backgroundColor: '#898'
                          }}
                        />
                      </View>

                    }

                  </View>

                )
              })

              :
              null
            }

          </Pages>

        </View>

        <View style={{ width: width(90), marginTop: height(2.5), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

          <TouchableOpacity
            onPress={() => likeAPI(item, index)}
            style={
              item.isliked == false ?

                { height: height(5), width: width(28), borderRadius: 7, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }
                :
                { height: height(5), width: width(28), borderRadius: 7, borderWidth: 1, borderColor: '#FFBB41', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          >

            <Text style={
              item.isliked == false ?
                { fontSize: totalSize(2.2), color: '#000', fontFamily: 'BebasNeue-Regular' }
                : { fontSize: totalSize(2.2), color: '#FFBB41', fontFamily: 'BebasNeue-Regular' }}
            >
              like
            </Text>

            <AntDesign
              style={{ marginLeft: width(1) }}
              name='like2' size={17} color={item.isliked == false ? '#000' : '#FFBB41'} />

            <Text style={
              item.isliked == false ?
                { fontSize: totalSize(2.2), marginLeft: width(1), color: '#000', fontFamily: 'BebasNeue-Regular' }
                : { fontSize: totalSize(2.2), marginLeft: width(1), color: '#FFBB41', fontFamily: 'BebasNeue-Regular' }}
            >
              {millify(item.totalLikes, {
                precision: 1
              })}
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => commentsAPI(item)}
            style={{ height: height(5), width: width(28), borderRadius: 7, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          >

            <Text style={{ fontSize: totalSize(2.2), fontFamily: 'BebasNeue-Regular' }}>
              comment
            </Text>

            <Image
              source={commentp}
              style={{ height: 16, width: 18, marginLeft: width(1) }}
            />

          </TouchableOpacity>

          <TouchableOpacity
            style={{ height: height(5), width: width(28), borderRadius: 7, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          >

            <Text style={{ fontSize: totalSize(2.2), fontFamily: 'BebasNeue-Regular' }}>
              share
            </Text>

            <MaterialCommunityIcons name='share' size={25} style={{ marginLeft: width(1) }} />

          </TouchableOpacity>

        </View>

        <View style={{ height: height(2) }} />

      </View>

    )
  }

  const FlatListC = ({ item }) => {
    return (

      <View>

        <View style={{ width: width(95), marginTop: height(2), alignSelf: 'center', flexDirection: 'row' }}>

          <Image
            style={{ height: 40, width: 40, borderRadius: 20 }}
            source={item.user ? { uri: link + '/' + item.user.image } : userP}
          />

          <View style={{ marginLeft: width(3) }}>

            <View style={styles.commenttextview}>

              <Text style={{ fontSize: totalSize(2.2) }}>

                {item.text}

              </Text>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              <Text style={{ fontSize: totalSize(1.7), color: '#555' }}>

                {moment(item.createdAt).fromNow()}

              </Text>

              <TouchableOpacity
                onPress={() => {
                  setreplysC([item])
                  setreplyV(true)
                  console.log(replysC)
                }}
                style={{ marginLeft: width(3) }}
              >

                <Text style={{ fontSize: totalSize(1.7), color: '#868887' }}>

                  Reply

                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </View>

        <TouchableOpacity
          onPress={() => {
            setreplysC([item])
            setreplyV(true)
          }}
        >

          {replyComments(item.replies)}

        </TouchableOpacity>

      </View>
    )
  }

  const replyComments = (item) => {

    if (item.length > 0 && item.length < 3) {
      return (

        item.map((e, i, a) => {
          return (

            <View style={[styles.repliesview, { alignItems: 'center' }]}>

              <Image
                style={{ height: 20, width: 20, borderRadius: 10 }}
                source={e.user ? { uri: link + '/' + e.user.image } : userP}
              />

              <View style={{ marginLeft: width(3) }}>

                <View style={{ padding: 7, borderRadius: 10, maxWidth: width(60), backgroundColor: '#B5B2B270' }}>

                  <Text
                    numberOfLines={2}
                    style={{ fontSize: totalSize(2) }}>

                    {e.text}

                  </Text>

                </View>

              </View>

            </View>

          )
        })

      )
    }
    else if (item.length >= 3) {
      return (
        <View>

          {item.map((e, i, a) => {
            if (i < 2) {
              return (

                <View style={[styles.repliesview, { alignItems: 'center' }]}>

                  <Image
                    style={{ height: 20, width: 20, borderRadius: 10 }}
                    source={e.user ? { uri: link + '/' + e.user.image } : userP}
                  />

                  <View style={{ marginLeft: width(3) }}>

                    <View style={{ padding: 7, borderRadius: 10, maxWidth: width(60), backgroundColor: '#B5B2B270' }}>

                      <Text
                        numberOfLines={2}
                        style={{ fontSize: totalSize(2) }}>

                        {e.text}

                      </Text>

                    </View>

                  </View>

                </View>

              )
            }
          })
          }

          <Text style={{ fontSize: totalSize(1.7), width: width(70), alignSelf: 'center', marginTop: height(1), color: '#0085FF' }}>
            View more {item.length - 2} comments
          </Text>

        </View>

      )
    }

  }

  const FlatListR = ({ item }) => {
    return (

      <View>

        <View style={{ width: width(95), marginTop: height(2), alignSelf: 'center', flexDirection: 'row' }}>

          <Image
            style={{ height: 40, width: 40, borderRadius: 20 }}
            source={item.user ? { uri: link + '/' + item.user.image } : userP}
          />

          <View style={{ marginLeft: width(3) }}>

            <View style={styles.commenttextview}>

              <Text style={{ fontSize: totalSize(2.2) }}>

                {item.text}

              </Text>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              <Text style={{ fontSize: totalSize(1.7), color: '#555' }}>

                {moment(item.createdAt).fromNow()}

              </Text>

              <TouchableOpacity
                onPress={() => textin.current.focus()}
                style={{ marginLeft: width(3) }}
              >

                <Text style={{ fontSize: totalSize(1.7), color: '#868887' }}>

                  Reply

                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </View>


        {replys(item.replies)}

      </View>
    )
  }

  const replys = (item) => {

    return (

      item.map((e, i, a) => {
        return (

          <View style={styles.repliesview}>

            <Image
              style={{ height: 20, width: 20, borderRadius: 10 }}
              source={e.user ? { uri: link + '/' + e.user.image } : userP}
            />

            <View style={{ marginLeft: width(3) }}>

              <View style={{ padding: 7, borderRadius: 10, alignSelf: 'flex-start', maxWidth: width(60), backgroundColor: '#B5B2B270' }}>

                <Text style={{ fontSize: totalSize(2) }}>

                  {e.text}

                </Text>

              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={{ fontSize: totalSize(1.7), color: '#555' }}>

                  {moment(e.timestamps).fromNow()}

                </Text>

                <TouchableOpacity
                  onPress={() => textin.current.focus()}
                  style={{ marginLeft: width(3) }}
                >

                  <Text style={{ fontSize: totalSize(1.7), color: '#868887' }}>

                    Reply

                  </Text>

                </TouchableOpacity>

              </View>

            </View>

          </View>

        )
      })

    )

  }

  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>

        <View style={{ flex: 1, backgroundColor: '#c4c4c4' }}>

          <Header text='PROFILE'
            back={() => navigation.goBack()}
          />

          <ScrollView style={{ flex: 1 }}>

            <View style={
              pics.length > 0 || videos.length > 0 ?
                { height: height(64), width: '100%', backgroundColor: '#fff', alignItems: 'center' }
                :
                { height: textflag ? height(47) : height(37), width: '100%', backgroundColor: '#fff', alignItems: 'center' }
            }>

              <Image
                source={{ uri: link + '/' + userProfile.userDetails.image }}
                style={{ height: 100, width: 100, borderRadius: 50, marginTop: height(2) }}
              />

              <Text
                numberOfLines={1}
                style={{ fontSize: totalSize(3.5), marginTop: height(1), fontFamily: 'BebasNeue-Regular', alignSelf: 'center' }}>
                {userProfile.userDetails.name}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  onPlayPausePress()
                  navigation.navigate('editprofile')
                }}
                style={{ height: height(3.2), width: width(25), marginTop: height(1), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#242527', borderColor: '#ffc55d', borderWidth: 1 }}
              >

                <Text style={{ fontSize: totalSize(2), color: '#ffc55d', fontFamily: 'BebasNeue-Regular' }}>
                  edit profile
                </Text>

              </TouchableOpacity>

              <View style={{ width: width(90), marginTop: height(3), alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>

                <View style={{ width: width(90), marginLeft: width(1), borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' }}>

                  <TextInput
                    numberOfLines={1}
                    placeholder='WHATS HAPPENING'
                    value={msg}
                    onChangeText={(text) => {
                      setmsg(text)
                      if (text.length > 0) {
                        settextflag(true)
                      }
                    }}
                    style={{ fontSize: totalSize(2.5), width: width(80), paddingVertical: 0 }}
                  />

                  <TouchableOpacity
                    onPress={() => uploadpics()}
                  >

                    <Image
                      source={addimage}
                      style={{ height: 40, width: 40 }}
                    />

                  </TouchableOpacity>

                </View>

              </View>

              <FlatList
                style={{ marginTop: height(0.5), flexGrow: 0, alignSelf: 'flex-start' }}
                data={pics}
                horizontal={true}
                renderItem={_FlatlistP}
                showsHorizontalScrollIndicator={false}
              />
              <FlatList
                style={{ marginTop: height(0.5), flexGrow: 0, alignSelf: 'flex-start' }}
                style={{ flexGrow: 0 }}
                data={videos}
                horizontal={true}
                renderItem={_FlatlistV}
                showsHorizontalScrollIndicator={false}
              />
              {pics.length > 0 || textflag || videos.length > 0 ?

                <TouchableHighlight
                  underlayColor='#242527'
                  style={{
                    height: height(5), width: width(40), marginTop: height(1), alignSelf: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#fabb47', borderRadius: 10, justifyContent: 'center'
                  }}
                  onPress={() => addPostFeed()}
                >

                  <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#fabb47', alignSelf: 'center' }}>
                    Post
                  </Text>

                </TouchableHighlight>

                : null}

            </View>

            {loader == true ?

              <View style={{ height: height(75), marginTop: height(1), justifyContent: 'center', backgroundColor: '#fff' }}>


                <Loader
                  color='#000'
                />

              </View>

              : newsfeed.length > 0 ?

                <FlatList
                  scrollEnabled={false}
                  data={newsfeed}
                  extraData={flagState}
                  keyExtractor={(item, index) => { return index.toString() }}
                  renderItem={_Flatlist}
                />

                :
                <View style={{ height: height(60), marginTop: height(1), justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>

                  <Text style={{ fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular' }}>
                    Nothing to show
                  </Text>

                </View>
            }

          </ScrollView>

          <View style={{ marginTop: height(80), marginLeft: width(79.5), position: 'absolute', zIndex: 1 }}>

            <TouchableOpacity
              onPress={() => {
                onPlayPausePress()
                navigation.navigate('chatStack')
              }
              }
              style={{ height: 70, width: 70, borderRadius: 50, marginTop: height(0.5), borderWidth: 1, borderColor: '#ffc55d', backgroundColor: '#00000090' }}
            >

              <View style={{ height: 70, width: 70, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: '#00000060' }}>

                <Image
                  source={chat}
                  style={{ height: 30, width: 37 }}
                />

              </View>

            </TouchableOpacity>

          </View>

          <Modal
            visible={Mloader}
            transparent={true}
          >

            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ height: height(20), width: width(50), backgroundColor: '#fff', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Loader color="#000" />
                <Text style={{ marginTop: height(3), fontSize: totalSize(3), fontFamily: 'BebasNeue-Regular', color: '#000' }}>
                  Posting
                </Text>
              </View>

            </View>

          </Modal>

          <Modal
            animationType={'fade'}
            transparent={true}
            visible={picV}
            onRequestClose={() => setpicV(false)}
          >

            <View style={{ flex: 1, backgroundColor: '#000' }}>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <ImageBackground
                  source={{ uri: link + '/' + pic }}
                  style={{ width: '100%' }}
                  imageStyle={{ resizeMode: 'contain' }}
                />

              </View>

              <TouchableOpacity
                onPress={() => setpicV(false)}
                style={{ marginTop: height(2), position: 'absolute', alignSelf: 'flex-end' }}
              >

                <MaterialIcons name='close' size={35} color='#fff' />

              </TouchableOpacity>



            </View>

          </Modal>

          <Modal
            animationType={'fade'}
            transparent={true}
            visible={videoV}
            onRequestClose={() => setvideoV(false)}
          >

            <View style={{ flex: 1, backgroundColor: '#000' }}>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: width(100) }}>

                <VideoPlayer
                  video={{ uri: link + '/' + video }}
                  autoplay={false}
                  // videoWidth={1600}
                  // videoHeight={900}
                  paused={paused}
                  style={{ height: height(100), width: width(100) }}
                // controls={true}
                // resizeMode={'contain'}
                // autoPlay={true}
                // // shouldPlay={true}
                />

              </View>

              <TouchableOpacity
                onPress={() => {
                  setpaused(false)
                  setvideoV(false)
                }}
                style={{ marginTop: height(2), position: 'absolute', alignSelf: 'flex-end' }}
              >

                <MaterialIcons name='close' size={35} color='#fff' />

              </TouchableOpacity>



            </View>

          </Modal>


          <Modal
            visible={commentV}
            animationType='slide'
            onRequestClose={() => {
              setcommentV(false)
              setcommentL(true)
            }}
          >

            {commentL == true ?

              <Image
                source={Cload}
                style={{ height: height(90), width: width(90), alignSelf: 'center', resizeMode: 'stretch' }}
              />

              :

              <View style={{ flex: 1 }}>

                <FlatList
                  data={comment}
                  keyExtractor={(item, index) => { return index.toString() }}
                  renderItem={FlatListC}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                  <View style={{ width: width(85), backgroundColor: '#d9d9d9', borderRadius: 5 }}>

                    <TextInput
                      placeholder='Type a message'
                      multiline
                      value={commmet1}
                      onChangeText={(text) => setcomment1(text)}
                      style={{ maxHeight: height(20), fontSize: totalSize(2.2) }}
                    />

                  </View>

                  <TouchableOpacity
                    onPress={() => commentsAPIPost()}
                    style={{ borderRadius: 50, backgroundColor: '#ffbb41' }}
                  >

                    <MaterialIcons name='send' size={25} style={{ padding: 12 }} />

                  </TouchableOpacity>

                </View>

              </View>

            }

          </Modal>

          <Modal
            visible={replyV}
            animationType='slide'
            onRequestClose={() => setreplyV(false)}
          >

            <FlatList
              data={replysC}
              keyExtractor={(item, index) => { return index.toString() }}
              renderItem={FlatListR}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <View style={{ width: width(85), backgroundColor: '#d9d9d9', borderRadius: 5 }}>

                <TextInput
                  placeholder='Type a message'
                  multiline
                  value={commmet2}
                  onChangeText={(text) => setcomment2(text)}
                  style={{ maxHeight: height(20), fontSize: totalSize(2.2) }}
                  ref={textin}
                />

              </View>

              <TouchableOpacity
                onPress={() => repliesAPIPost()}
                style={{ borderRadius: 50, backgroundColor: '#ffbb41' }}
              >

                <MaterialIcons name='send' size={25} style={{ padding: 12 }} />

              </TouchableOpacity>

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
  commenttextview: {
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    maxWidth: width(70),
    backgroundColor: '#B5B2B270'
  },
  repliesview: {
    width: width(70),
    marginTop: height(2),
    alignSelf: 'center',
    flexDirection: 'row'
  }
})