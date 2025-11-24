import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

interface ApplicantItem {
  id: string;
  name: string;
  appliedDate: string;
  jobRole: string;
  stage: string;
  status: string;
  avatar: string;
}

const ApplicantCard = ({ item }: { item: ApplicantItem }) => {
  return (
    <View style={styles.card}>
      
      {/* Top Row - Avatar + Name + 3 Dots */}
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />

          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.appliedOn}>
              Applied on : <Text style={styles.date}>{item.appliedDate}</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity>
          <Text style={styles.menu}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Applied For */}
      <Text style={styles.appliedFor}>
        Applied for : <Text style={styles.bold}>{item.jobRole}</Text>
      </Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Stage + Status Badge */}
      <View style={styles.rowBetween}>
        <Text style={styles.stage}>{item.stage}</Text>

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

    </View>
  );
};

export default ApplicantCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D2939',
  },
  appliedOn: {
    fontSize: 13,
    color: '#475467',
    marginTop: 4,
  },
  date: {
    color: '#7F56D9',
    textDecorationLine: 'underline',
  },

  appliedFor: {
    marginTop: 12,
    fontSize: 14,
    color: '#475467',
  },
  bold: {
    fontWeight: '600',
    color: '#1D2939',
  },

  divider: {
    height: 1,
    backgroundColor: '#EDEEEF',
    marginVertical: 12,
  },

  stage: {
    color: '#475467',
    fontSize: 14,
  },

  statusBadge: {
    backgroundColor: '#F4F3FF',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7F56D9',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#7F56D9',
    fontWeight: '500',
  },

  menu: {
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 6,
    color: '#344054',
  },
});
