import { RootState } from '@/state/store';
import { useTheme } from '@react-navigation/native';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CustomTheme } from '../../utils/styles/theme'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setState } from '@/state/slices/settingsSlice';
import { getConfirmation } from '@/components/ConfirmationDialog';
import { addModal } from '@/state/slices/globalSlice';
import Alert from '@/components/Alert';
import AnimatedScreenWrapper from '@/components/screens/AnimatedScreenWrapper';
import { router } from 'expo-router';

export default function SettingsScreen() {
    const settings = useSelector((state: RootState) => state.settings)
    const { colors } = useTheme() as CustomTheme
    const dispatch = useDispatch()

    const [host, setHost] = useState<string>(settings.host || 'http://');
    const [port, setPort] = useState<string>(settings.port || '');
    const [password, setPassword] = useState<string>(settings.password || '');

    const [disabledButtons, setDisabledButtons] = useState<{
        reset: boolean;
        save: boolean;
    }>({
        reset: false,
        save: false
    })

    const handleSave = () => {
        setDisabledButtons({ ...disabledButtons, save: true })

        dispatch(setState({
            host: host.trim(),
            port: port.trim(),
            password
        }))
        dispatch(addModal(<Alert title='Success' message='Successfully updated app settings.' />))

        setDisabledButtons({ ...disabledButtons, save: false })

    };

    const handleReset = async () => {
        setDisabledButtons({ ...disabledButtons, reset: true })

        const confirm = await getConfirmation({ text: "Are you sure you want to reset the app settings?" })
        if (confirm) {
            dispatch(setState({
                host: null,
                port: null,
                password: null
            }))
            setHost('http://')
            setPort('8080')
            setPassword('')
        }

        setDisabledButtons({ ...disabledButtons, reset: false })

    };

    const handleViewSetupGuide = () => {
        router.push('/setupGuide')
    }

    return (
        <AnimatedScreenWrapper>
            <SafeAreaView>
                <View style={{ padding: 16, height: '100%', width: '100%' }}>

                    <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>Settings</Text>

                    {/* VLC Host Address */}
                    <View style={{ marginBottom: 16, marginTop: 16 }}>
                        <Text style={{ color: colors.text, marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>VLC Host Address</Text>
                        <TextInput
                            style={{ backgroundColor: colors.inputBg, color: colors.text, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, fontSize: 16 }}
                            placeholderTextColor={colors.text}
                            placeholder="Enter VLC Host Address (E.g. http://192.168.0.2)"
                            value={host}
                            onChangeText={setHost}
                        />
                    </View>

                    {/* VLC Port */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: colors.text, marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>VLC Port</Text>
                        <TextInput
                            style={{ backgroundColor: colors.inputBg, color: colors.text, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, fontSize: 16 }}
                            placeholderTextColor={colors.text}
                            placeholder="Enter VLC Port (Default: 8080)"
                            value={port}
                            onChangeText={setPort}
                        />
                    </View>

                    {/* Password */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: colors.text, marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>Password</Text>
                        <TextInput
                            style={{ backgroundColor: colors.inputBg, color: colors.text, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, fontSize: 16 }}
                            placeholderTextColor={colors.text}
                            placeholder="Enter Password"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            marginTop: 16,
                            width: '100%',
                            flexDirection: 'row',
                            backgroundColor: colors.primary,
                            padding: 12,
                            borderRadius: 8,
                            gap: 8,
                            marginBottom: 16,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={handleSave}
                    >
                        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16, }}>SAVE</Text>
                    </TouchableOpacity>


                    <Text style={{ color: colors.text, fontSize: 24, marginTop: 48, fontWeight: 'bold' }}>Actions</Text>

                    {/* View Setup Guide Button */}
                    <TouchableOpacity
                        disabled={disabledButtons.save}
                        activeOpacity={0.8}
                        style={{
                            marginTop: 16,
                            width: '100%',
                            flexDirection: 'row',
                            backgroundColor: colors.primary,
                            padding: 12,
                            borderRadius: 8,
                            gap: 8,
                            marginBottom: 16,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={handleViewSetupGuide}
                    >
                        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16, }}>VIEW SETUP GUIDE</Text>
                    </TouchableOpacity>

                    {/* Reset Button */}
                    <TouchableOpacity
                        disabled={disabledButtons.reset}
                        activeOpacity={0.8}
                        style={{
                            marginTop: 16,
                            width: '100%',
                            flexDirection: 'row',
                            backgroundColor: colors.danger,
                            padding: 12,
                            borderRadius: 8,
                            gap: 8,
                            marginBottom: 16,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={handleReset}
                    >
                        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16, }}>RESET APP SETTINGS</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView >
        </AnimatedScreenWrapper>
    );
}