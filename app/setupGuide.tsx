import AnimatedScreenWrapper from "@/components/screens/AnimatedScreenWrapper";
import { CustomTheme } from "@/utils/styles/theme";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SetupStep1, SetupStep2, SetupStep3, SetupStep4, SetupStep5 } from '@/assets';
import { router } from "expo-router";

export default function SetupGuideScreen() {
    const { colors } = useTheme() as CustomTheme

    return (
        <AnimatedScreenWrapper>
            <SafeAreaView>
                <View
                    style={{ height: "100%", width: "100%", padding: 8, overflow: 'visible', backgroundColor: colors.white }}>
                    <ScrollView
                        style={{ flex: 1, padding: 8 }}
                    >
                        <Text style={{ color: colors.text, fontSize: 36, fontWeight: 'bold' }}>Setup Guide</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>Please note that this mobile application is NOT affiliated with VideoLAN.</Text>


                        <View style={{ height: 36 }} />
                        <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold' }}>Step 1</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>Open VLC Media Player on PC</Text>
                        <Image source={SetupStep1} style={{ width: "100%", aspectRatio: 1, height: undefined }} resizeMode={'contain'} />

                        <View style={{ height: 8 }} />
                        <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold' }}>Step 2</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>In the 'Tools' dropdown menu, then click 'Preferences' to open the Preferences dialog.</Text>
                        <Image source={SetupStep2} style={{ width: "100%", aspectRatio: 1, height: undefined }} resizeMode={'contain'} />

                        <View style={{ height: 8 }} />
                        <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold' }}>Step 3</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>In Preferences dialog, click 'All' to see all settings.</Text>
                        <Image source={SetupStep3} style={{ width: "100%", aspectRatio: 1, height: undefined }} resizeMode={'contain'} />

                        <View style={{ height: 8 }} />
                        <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold' }}>Step 4</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>Select 'Main interfaces', then tick the box labelled 'Web', on the right side.</Text>
                        <Image source={SetupStep4} style={{ width: "100%", aspectRatio: 1, height: undefined }} resizeMode={'contain'} />

                        <View style={{ height: 8 }} />
                        <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold' }}>Step 5</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>Expand 'Main interfaces', then select 'Lua' on the left pane. Then, on the right side, enter a password to use for this mobile app to connect to your PC with.</Text>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginTop: 8 }}>When you are done, click Save at the bottom right.</Text>
                        <Image source={SetupStep5} style={{ width: "100%", aspectRatio: 1, height: undefined }} resizeMode={'contain'} />

                        <View style={{ height: 8 }} />
                        <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold' }}>Setup Complete</Text>
                        <Text style={{ color: colors.text, fontSize: 20 }}>Now you can configure this mobile app to connect to your VLC application on PC.</Text>
                        <TouchableOpacity
                            style={{
                                flex: 1,
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
                            onPress={() => router.push('/settings')}
                        >
                            <FontAwesome6 name="gear" size={24} color={'#fff'} />
                            <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>GO TO SETTINGS</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </SafeAreaView>
        </AnimatedScreenWrapper>
    )
}