import { addModal, removeModal } from '@/state/slices/globalSlice';
import { store } from '@/state/store';
import { CustomTheme } from '@/utils/styles/theme';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

interface ConfirmationDialogProps {
    title?: string;
    text?: string;
    resolve: any;
    onConfirm?: any;
    onCancel?: any;
}

interface IGetConfirmation {
    title?: string,
    text?: string,
}

export function getConfirmation({ title, text }: IGetConfirmation = {}) {
    return new Promise((resolve, reject) => {
        store.dispatch(addModal(
            <ConfirmationDialog
                title={title}
                text={text}
                resolve={resolve}
            />
        ))
    });
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ onCancel, onConfirm, title = 'Confirm Action', text = 'Are you sure?', resolve }) => {
    const { colors } = useTheme() as CustomTheme

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
            width: "100%",
            gap: 8
        },
        button: {
            borderRadius: 8,
            padding: 10,
            elevation: 2,
            flex: 1
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

    const dispatch = useDispatch()

    function handleConfirm() {
        if (typeof onConfirm === 'function') onConfirm()
        dispatch(removeModal())
        resolve(true)
    }

    function handleCancel() {
        if (typeof onCancel === 'function') onCancel()
        dispatch(removeModal())
        resolve(false)
    }

    return (
        <Modal
            transparent={true}
            visible={true}
            animationType="slide"
            onRequestClose={handleCancel}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* Dialog title */}
                    <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 28 }}>{title}</Text>

                    {/* Text */}
                    <Text style={styles.modalText}>{text}</Text>

                    <View style={styles.buttonContainer}>

                        {/* Cancel button */}
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.darkGrey }]}
                            onPress={handleCancel}
                        >
                            <Text style={styles.textStyle}>CANCEL</Text>
                        </TouchableOpacity>

                        {/* Confirm button */}
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.textStyle}>CONFIRM</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};


export default ConfirmationDialog;
