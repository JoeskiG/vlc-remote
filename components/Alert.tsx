import { removeModal } from '@/state/slices/globalSlice';
import { CustomTheme } from '@/utils/styles/theme';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

interface AlertProps {
    title: string;
    message: string;
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ title, message, onClose }) => {
    const { colors } = useTheme() as CustomTheme
    const dispatch = useDispatch()

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
        },
        modalView: {
            margin: 20,
            backgroundColor: colors.paper,
            borderRadius: 8,
            padding: 28,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        buttonContainer: {
            flexDirection: 'row',
            marginTop: 36,
        },
        button: {
            borderRadius: 8,
            padding: 10,
            elevation: 2,
            width: "100%"
        },
        buttonClose: {
            backgroundColor: colors.primary,
        },
        textStyle: {
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        modalText: {
            marginTop: 8,
            marginBottom: 8,
            textAlign: 'center',
            color: colors.text,
            fontSize: 20
        },
    });

    const handleClose = () => {
        if (typeof onClose === 'function') onClose()
        dispatch(removeModal())
    }

    return (
        <Modal
            transparent={true}
            visible={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* Alert title */}
                    <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 28 }}>{title}</Text>

                    {/* Alert message */}
                    <Text style={styles.modalText}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleClose}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};


export default Alert;
