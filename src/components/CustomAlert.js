import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

export default function CustomAlert({ visible, title, message, onClose, onConfirm, showCancel = false }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Top indicator line */}
          <View style={styles.topIndicator} />
          
          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          
          {/* Message */}
          <Text style={styles.message}>{message}</Text>
          
          {/* Buttons */}
          {showCancel ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={onConfirm}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.okButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.okButtonText}>ok</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  topIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  okButton: {
    backgroundColor: '#0077B6',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 60,
    width: '100%',
    alignItems: 'center',
  },
  okButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#d12028',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});