import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedScreenWrapper = ({ children }: { children: JSX.Element }) => {
    const fadeAnim = useSharedValue(0);
    const handleFocus = useCallback(() => {
        fadeAnim.value = 0;
        fadeAnim.value = withTiming(1, { duration: 250 });

        return () => {
            fadeAnim.value = 0; // Reset animation value when screen is unfocused
        };
    }, [fadeAnim]);

    useFocusEffect(handleFocus);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: fadeAnim.value,
            transform: [{
                translateX: fadeAnim.value * SCREEN_WIDTH - SCREEN_WIDTH,
            }]
        };
    });

    return (
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            {children}
        </Animated.View>
    );
};

export default AnimatedScreenWrapper;
