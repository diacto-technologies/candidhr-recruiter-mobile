import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function VideoInterview() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Video Interview - AI Summary</Text>

        <View style={styles.tagRow}>
          <Text style={styles.tag}>Articulation</Text>
          <Text style={styles.tag}>Communication</Text>
        </View>

        <View style={styles.subCard}>
          <Text style={{fontWeight: '700'}}>Articulation Analysis</Text>
          <Text style={{color: '#777'}}>
            Frequent silent pauses affecting fluency.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Responses (Videos)</Text>

        <View style={styles.videoBox}>
          <Text>Video Placeholder</Text>
        </View>

        <View style={styles.subCard}>
          <Text>What is Django?</Text>
        </View>
        <View style={styles.subCard}>
          <Text>What is Django?</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {paddingHorizontal: 12},
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  heading: {fontWeight: '700', marginBottom: 8},
  tagRow: {flexDirection: 'row', marginBottom: 10},
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#e8e2f8',
    marginRight: 8,
    borderRadius: 20,
  },
  subCard: {
    backgroundColor: '#fafafa',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  videoBox: {
    height: 150,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 12,
  },
});
