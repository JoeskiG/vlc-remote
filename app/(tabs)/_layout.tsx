import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { RootState } from '@/state/store';
import { useTheme } from '@react-navigation/native';
import apiService from '@/services';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { loadInitialState } from '@/state/slices/settingsSlice';
import { clearErrors } from '@/state/slices/globalSlice';
import Alert from '@/components/Alert';
import { setCurrentPlayerState } from '@/state/slices/mediaSlice';
import { View } from 'react-native';

export default function TabLayout() {
  const { currentPlayerState } = useSelector((state: RootState) => state.media)
  const settings = useSelector((state: RootState) => state.settings)
  const { errors, errorsVisible, modals } = useSelector((state: RootState) => state.global)
  const { colors } = useTheme()
  const dispatch = useDispatch()


  useEffect(() => {
    if (settings.host && settings.password && settings.port) {
      apiService.mediaService.updateStatus()
      apiService.mediaService.getCurrentPlaylist({ overwriteState: true })
    }

  }, [settings.host, settings.password, settings.port])

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPlayerState.state) dispatch(setCurrentPlayerState({ ...currentPlayerState, time: currentPlayerState.time + 1 }))
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [currentPlayerState]);


  useEffect(() => {
    dispatch((loadInitialState as any)())
  }, [dispatch])

  return (
    <>
      {/* Show modals/dialogs */}
      {
        modals.length > 0 && (
          modals.map((modal, i) => (
            <View key={i}>
              {modal}
            </View>
          ))
        )
      }

      {/* Show errors */}
      {errors.length > 0 && errorsVisible && (
        <Alert message={errors.map(err => err?.msg).join('\n')} title='Something went wrong' onClose={() => dispatch(clearErrors())} />
      )}

      <Tabs
        initialRouteName={settings.host && settings.password && settings.port ? 'index' : 'setupGuide'}
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          headerShown: false,
          tabBarHideOnKeyboard: true
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Playlist',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'list-circle' : 'list-circle-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'cog' : 'cog-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'information-circle' : 'information-circle-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </>

  );
}
