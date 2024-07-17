import { useTheme } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import { CustomTheme } from '../../utils/styles/theme'
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedScreenWrapper from '@/components/screens/AnimatedScreenWrapper';

export default function AboutScreen() {
    const { colors } = useTheme() as CustomTheme

    return (
        <AnimatedScreenWrapper>
            <SafeAreaView>
                <View
                    style={{ height: "100%", width: "100%", padding: 8, overflow: 'visible', backgroundColor: colors.white }}>
                    <ScrollView
                        style={{ flex: 1, padding: 8 }}
                    >
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>About</Text>
                        </View>


                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>Attributions</Text>

                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>VLC Media Player</Text>
                                <Text style={{ color: colors.text, fontSize: 16 }}>VLC Media Player and the VLC logo are trademarks of VideoLAN. {'\n'}This application is NOT affiliated with VideoLAN.</Text>
                            </View>

                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>FontAwesome 6</Text>
                                <Text style={{ color: colors.text, fontSize: 16 }}>Icons by FontAwesome 6, available under the FontAwesome license.</Text>
                            </View>

                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>Axios</Text>
                                <Text style={{ color: colors.text, fontSize: 16 }}>HTTP requests powered by Axios, available under the MIT License.</Text>
                            </View>

                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>React Native</Text>
                                <Text style={{ color: colors.text, fontSize: 16 }}>App developed using React Native, available under the MIT License.</Text>
                            </View>

                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>Expo</Text>
                                <Text style={{ color: colors.text, fontSize: 16 }}>Built with Expo, available under the MIT License.</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView >
        </AnimatedScreenWrapper>
    );
}