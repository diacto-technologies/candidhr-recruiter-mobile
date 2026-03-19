import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { Header } from '../../organisms';
import { goBack } from '../../../utils/navigationUtils';
import { FloatingActionButton, TextField, Typography } from '../../atoms';
import { sendButton } from '../../../assets/svg/send';

interface CommentItem {
  id: string;
  name: string;
  tag: string;
  email: string;
  date: string;
  text: string;
}

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ visible, onClose }) => {

  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: '1',
      name: 'rakshat',
      tag: 'Applicant Profile',
      email: 'rakshat.amin@diacto.com',
      date: '09 Mar 2026',
      text: 'Hi',
    },
  ]);

  const [commentText, setCommentText] = useState('');

  const handleSend = () => {
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      name: 'You',
      tag: 'Applicant Profile',
      email: 'you@email.com',
      date: new Date().toLocaleDateString('en-GB'),
      text: commentText,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Header title="Comments" backNavigation onBack={goBack} />

        <View style={styles.content}>

          <ScrollView>

            {comments.map(item => (
              <View key={item.id} style={styles.card}>

                <View style={styles.headerRow}>

                  <View style={styles.userRow}>
                    <View style={styles.avatar} />

                    <View>
                      <View style={styles.nameRow}>
                        <Typography variant="semiBoldTxtsm">
                          {item.name}
                        </Typography>

                        <View style={styles.tag}>
                          <Typography
                            variant="regularTxtxs"
                            color={colors.brand[600]}
                          >
                            {item.tag}
                          </Typography>
                        </View>
                      </View>

                      <Typography
                        variant="regularTxtxs"
                        color={colors.gray[500]}
                      >
                        {item.email}
                      </Typography>
                    </View>
                  </View>

                  <View style={styles.rightRow}>
                    <Typography
                      variant="regularTxtxs"
                      color={colors.gray[500]}
                    >
                      {item.date}
                    </Typography>

                    <TouchableOpacity style={styles.menuDot}>
                      <Typography>⋮</Typography>
                    </TouchableOpacity>
                  </View>

                </View>

                <Typography
                  variant="regularTxtsm"
                  color={colors.gray[800]}
                  style={styles.commentText}
                >
                  {item.text}
                </Typography>

              </View>
            ))}

          </ScrollView>
        </View>

        {/* Bottom Input */}
         <Typography variant="regularTxtxs" color={colors.gray[800]}>
            Share your thoughts about this profile with your team.
          </Typography>
        <View style={styles.commentContainer}>
          <View style={{ flex: 1 }}>
            <TextField
              placeholder="Write your comment here..."
              size="Medium"
              value={commentText}
              onChangeText={setCommentText}
            />
          </View>

          <View style={styles.buttonRow}>
            <FloatingActionButton
              value={sendButton}
              backgroundColor={colors.brand[600]}
              iconColor={colors.base.white}
              size={40}
              onPress={handleSend}
            />
          </View>
        </View>

      </View>
    </Modal>
  );
};

export default CommentsModal;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.base.white,
  },

  content: {
    flex: 1,
    padding: 16,
  },

  card: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: colors.gray[200],
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  userRow: {
    flexDirection: 'row',
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[200],
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  tag: {
    backgroundColor: colors.brand[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  rightRow: {
    alignItems: 'flex-end',
  },

  menuDot: {
    paddingTop: 4,
  },

  commentText: {
    marginTop: 10,
  },

  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: colors.gray[200],
  },

  buttonRow: {
    paddingLeft: 5,
  },

});