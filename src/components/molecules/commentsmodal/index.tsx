import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { Header } from '../../organisms';
import { goBack } from '../../../utils/navigationUtils';
import { FloatingActionButton, TextField, Typography } from '../../atoms';
import { sendButton } from '../../../assets/svg/send';
import { CommentsModalProps, CommentItem } from './commentsmodal.d';
import { useStyles } from './styles';

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
  const styles = useStyles();

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