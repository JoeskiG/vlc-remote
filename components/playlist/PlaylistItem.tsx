import IPlaylistItem from '@/models/IPlaylistItem';
import apiService from '@/services';
import { formatTime } from '@/utils/helper';
import styles from '@/utils/styles/style';
import { CustomTheme } from '@/utils/styles/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';

interface IPlaylistItemProps {
    playlistItem: IPlaylistItem
}

export function PlaylistItem({ playlistItem }: IPlaylistItemProps) {
    const { colors } = useTheme() as CustomTheme

    const animation = new Animated.Value(0);
    const inputRange = [0, 2];
    const outputRange = [1, 0.8];
    const scale = animation.interpolate({ inputRange, outputRange });

    const onPressIn = () => {
        Animated.spring(animation, {
            toValue: 0.25,
            useNativeDriver: true,
        }).start();
    };
    const onPressOut = () => {
        Animated.spring(animation, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    function playItem() {
        apiService.mediaService.playItemById({ id: playlistItem.id, options: { disableErrorDialog: true } }).then((res) => {
            if (res.status) {
                if (playlistItem.isFolder) apiService.mediaService.getCurrentPlaylist({ overwriteState: true })
            }
        })
    }

    return (
        <Animated.View style={{ padding: 8, marginHorizontal: 8, backgroundColor: colors.paper, borderRadius: 8, ...styles.shadow, transform: [{ scale }] }}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={playItem}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                <View style={{ width: "100%", flex: 1, flexDirection: 'column' }}>
                    <View style={{ width: "100%", flex: 1, flexDirection: 'row', gap: 8 }}>

                        {/* Cover art */}
                        <View style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: playlistItem.isFolder ? colors.paper : colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                            {playlistItem.isFolder ? (<FontAwesome6 name="folder" size={36} color={colors.text} />) :
                                playlistItem?.art ? (<Image source={{ uri: `data:image/png;base64,${playlistItem?.art}` }} style={{ width: "100%", height: "100%" }} />) :
                                    (<FontAwesome6 name="music" size={36} color={'#fff'} />)}
                        </View>

                        <View style={{ width: "100%", flex: 1, flexDirection: 'column' }}>

                            {/* Track Name */}
                            <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>{playlistItem?.name}</Text>

                            {/* Track Artist */}
                            <Text style={{ color: colors.grey }}>{formatTime(playlistItem?.duration)} {playlistItem?.artist && `• ${playlistItem.artist}`}</Text>
                        </View>
                    </View>

                </View>

            </TouchableOpacity >

        </Animated.View >

    )
}
