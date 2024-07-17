import apiService from "@/services";
import { RootState } from "@/state/store";
import { formatTime } from "@/utils/helper";
import styles from "@/utils/styles/style";
import { CustomTheme } from "@/utils/styles/theme";
import { FontAwesome6 } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useTheme } from "@react-navigation/native";
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

export function PlaybackControls({ style }: { style?: StyleProp<ViewStyle> }) {
    const { colors } = useTheme() as CustomTheme

    const { currentPlayerState } = useSelector((state: RootState) => state.media)
    const { isConnected } = useSelector((state: RootState) => state.settings)

    function playPause() {
        apiService.mediaService.playPause()
    }

    return (
        <View style={{ padding: 8, height: 160, ...(style && style as any) }}>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                overflow: 'hidden',
            }}>
                <View style={{
                    flexDirection: 'row',
                    width: "100%",
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                }}>
                    {/* Current Time */}
                    <Text style={{ color: colors.text }}>{formatTime(currentPlayerState.time)}</Text>

                    {/* Connection Status */}
                    <Text style={{ color: isConnected ? colors.success : colors.danger, flex: 1, fontSize: 16, textAlign: 'center' }}>{isConnected ? "Connected" : "Not Connected"}</Text>

                    {/* Length/Duration of Current Item */}
                    <Text style={{ color: colors.text }}>{formatTime(currentPlayerState.duration)}</Text>
                </View>

                {/* Seek Bar */}
                <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={0}
                    maximumValue={currentPlayerState.duration}
                    value={currentPlayerState.time || 0}
                    onValueChange={(value) => apiService.mediaService.seekTrack({ time: value })}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    thumbTintColor={colors.primary}
                />

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    width: '100%',
                    paddingHorizontal: 16,
                }}>

                    {/* Previous */}
                    <TouchableOpacity
                        onPress={() => apiService.mediaService.previousTrack()}
                    >
                        <FontAwesome6 name="backward-step" size={36} color={colors.text} />
                    </TouchableOpacity>

                    {/* Play/Pause */}
                    <TouchableOpacity
                        onPress={playPause}
                    >
                        {
                            currentPlayerState.state ? (<FontAwesome6 name="circle-pause" size={48} color={colors.text} />) : (<FontAwesome6 name="circle-play" size={48} color={colors.text} />)
                        }
                    </TouchableOpacity>

                    {/* Next */}
                    <TouchableOpacity
                        onPress={() => apiService.mediaService.nextTrack()}
                    >
                        <FontAwesome6 name="forward-step" size={36} color={colors.text} />
                    </TouchableOpacity>

                </View>

            </View>
        </View>
    )
}