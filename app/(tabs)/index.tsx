import { PlaybackControls } from '@/components/player/PlaybackControls';
import { PlaylistItem } from '@/components/playlist/PlaylistItem';
import AnimatedScreenWrapper from '@/components/screens/AnimatedScreenWrapper';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import IPlaylistItem from '@/models/IPlaylistItem';
import apiService from '@/services';
import { RootState } from '@/state/store';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { CustomTheme } from '../../utils/styles/theme';

export default function HomeScreen() {
  const { currentPlaylist, currentItem } = useSelector((state: RootState) => state.media)
  const { isConnected, port, password, host } = useSelector((state: RootState) => state.settings)
  const { colors } = useTheme() as CustomTheme
  const isKeyboardVisible = useKeyboardVisible()

  const [displayedPlaylist, setDisplayedPlaylist] = useState<IPlaylistItem[]>([])

  const [searchText, setSearchText] = useState<string>('')
  const [isSearchOpened, setIsSearchOpened] = useState<boolean>(false)

  const searchInputRef = useRef(null)
  const flatListRef = useRef(null)

  useEffect(() => {
    if (!isSearchOpened) setDisplayedPlaylist(currentPlaylist)
  }, [currentPlaylist])

  useEffect(() => {
    if (host && password && port) apiService.mediaService.getCurrentPlaylist()
  }, [port, password, host])

  useEffect(() => {
    handleSearch()
  }, [searchText])

  useEffect(() => {
    setSearchText('')
  }, [isSearchOpened])

  function handleSearch() {
    if (searchText.trim().length === 0) {
      setDisplayedPlaylist(currentPlaylist)
      return
    }

    apiService.mediaService.searchLocalPlaylist({ text: searchText }).then(res => {
      if (res.status) setDisplayedPlaylist(res.content)
    })
  }

  return (
    <AnimatedScreenWrapper>
      <SafeAreaView>
        <View
          style={{ height: "100%", width: "100%", padding: 8, overflow: 'visible', backgroundColor: colors.white }}>
          {
            !port || !host || !password ? (
              <>
                {/* Prompt to view setup guide if port, host or password are empty */}
                <View style={{ margin: 'auto', width: '100%', padding: 36 }}>
                  <Text style={{ color: colors.text, fontSize: 36, fontWeight: 'bold' }}>Setup is required</Text>

                  <View style={{ height: 8 }} />
                  <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold' }}>To begin, please read the setup guide.</Text>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      backgroundColor: colors.primary,
                      padding: 12,
                      borderRadius: 8,
                      gap: 8,
                      marginBottom: 16,
                      marginTop: 16,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onPress={() => router.push('/setupGuide')}
                  >
                    <FontAwesome6 name="book" size={24} color={'#fff'} />
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>GO TO SETUP GUIDE</Text>
                  </TouchableOpacity>
                </View>

              </>
            ) : (
              <ImageBackground
                style={{
                  width: "100%",
                  height: "100%",
                  flex: 1,
                  flexDirection: 'column',
                  backgroundColor: colors.background,
                  overflow: 'visible'
                }}
                resizeMode={'cover'}
                blurRadius={3}
              >
                <View style={{ display: 'flex', paddingBottom: 8, flexDirection: 'row', alignItems: 'center', width: "100%", zIndex: 10, justifyContent: 'space-between' }}>

                  {/* Search Bar */}
                  <View style={{ width: "100%", display: isSearchOpened ? 'flex' : 'none', height: isSearchOpened ? 'auto' : 0, backgroundColor: colors.background, flex: 1, justifyContent: 'space-between', flexDirection: 'row', padding: 8, borderRadius: 8 }}>
                    <TextInput
                      ref={searchInputRef}
                      style={{ flex: 1, padding: 8, backgroundColor: colors.inputBg, color: colors.text, borderRadius: 8 }}
                      placeholderTextColor={colors.text}
                      value={searchText}
                      onChangeText={setSearchText}
                      placeholder="Search..."
                    />

                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.paper,
                        height: 48,
                        width: 48,
                        padding: 8,
                        borderRadius: 8,
                        marginLeft: 8,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onPress={() => setIsSearchOpened(false)}
                    >
                      <FontAwesome6 name="x" size={24} color={'#fff'} />
                    </TouchableOpacity>
                  </View>
                  {
                    !isSearchOpened && currentItem ? (
                      <View style={{ backgroundColor: colors.white, flex: 1, justifyContent: 'space-between', flexDirection: 'row', padding: 8, borderRadius: 8 }}>
                        <TouchableOpacity onPress={() => (flatListRef.current as any).scrollToIndex({ animated: true, index: displayedPlaylist.findIndex(item => item.id == currentItem?.id) })} activeOpacity={0.8} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>

                          {/* Cover art */}
                          <Image source={{ uri: `data:image/png;base64,${currentItem?.art}` }} style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: currentItem.isFolder ? colors.paper : colors.primary, alignItems: 'center', justifyContent: 'center' }} />

                          <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>{currentItem?.name}</Text>
                            <Text style={{ color: colors.text }}>{currentItem?.artist}</Text>
                          </View>
                        </TouchableOpacity>

                        {/* Reload Playlist Button */}
                        <TouchableOpacity
                          style={{
                            backgroundColor: colors.primary,
                            height: 48,
                            width: 48,
                            padding: 8,
                            borderRadius: 8,
                            marginLeft: 8,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onPress={() => apiService.mediaService.getCurrentPlaylist({ overwriteState: true })}
                        >
                          <FontAwesome6 name="rotate-right" size={24} color={'#fff'} />
                        </TouchableOpacity>

                        {/* Search Button */}
                        <TouchableOpacity
                          style={{
                            backgroundColor: colors.primary,
                            height: 48,
                            width: 48,
                            padding: 8,
                            borderRadius: 8,
                            marginLeft: 8,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onPress={() => {
                            setIsSearchOpened(true);
                            if (searchInputRef?.current) (searchInputRef.current as any).focus();
                          }}
                        >
                          <FontAwesome6 name="magnifying-glass" size={24} color={'#fff'} />
                        </TouchableOpacity>
                      </View>
                    ) : !isConnected && (
                      <View style={{ backgroundColor: colors.background, flex: 1, justifyContent: 'space-between', flexDirection: 'row', padding: 8, borderRadius: 8 }}>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: colors.primary,
                            height: 48,
                            width: 48,
                            padding: 8,
                            borderRadius: 8,
                            gap: 8,
                            marginLeft: 8,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onPress={() => apiService.mediaService.attemptReconnect()}
                        >
                          <FontAwesome6 name="rotate-right" size={24} color={'#fff'} />
                          <Text style={{ color: colors.text, fontSize: 16, }}>Reconnect</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }

                </View>


                {/* Playlist item list */}
                <View style={{
                  backgroundColor: colors.background,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  overflow: 'visible'
                }}>

                  <FlatList
                    ref={flatListRef}
                    data={displayedPlaylist}
                    renderItem={({ item }) => (
                      <PlaylistItem playlistItem={item} />
                    )}
                    onScrollToIndexFailed={error => {
                      (flatListRef.current as any).scrollToOffset({
                        offset: error.averageItemLength * error.index,
                        animated: true,
                      });
                      setTimeout(() => {
                        if ((flatListRef.current as any) !== null) {
                          (flatListRef.current as any).scrollToIndex({
                            index: error.index,
                            animated: true,
                          });
                        }
                      }, 100);
                    }}
                    getItemLayout={(data, index) => (
                      { length: 72, offset: 72 * index, index }
                    )}
                    keyExtractor={(item, i) => item.id.toString()}
                    ItemSeparatorComponent={() => {
                      return (
                        <View
                          style={{
                            height: 8,
                          }} />
                      );
                    }}
                  />

                </View>

                {
                  !isKeyboardVisible && (
                    <>
                      {/* Playback controls (play, pause etc.) */}
                      <PlaybackControls style={{ backgroundColor: colors.white }} />
                    </>
                  )
                }


              </ImageBackground>
            )
          }

        </View >
      </SafeAreaView >
    </AnimatedScreenWrapper >
  );
}