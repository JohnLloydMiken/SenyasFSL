import { StyleSheet, Text, View, Image, Button } from 'react-native'
import React from 'react'
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';

const videoSource = require('../../assets/videos/Treasure.mp4');
export default function treasure() {

const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
    
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
  <View className='bg-white flex-1 items-center '>
        <Image source={require('../../assets/images/phBG.png')} className='absolute top-0 left-0 w-full h-full'/>
         <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
      <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
});