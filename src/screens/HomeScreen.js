import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Välkommen till Torrevieja! 🌴</Text>
        <Text style={styles.subtitle}>
          Upptäck de bästa eventen och deals
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666' },
});