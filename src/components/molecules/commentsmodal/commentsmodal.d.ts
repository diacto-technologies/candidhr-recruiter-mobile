export interface CommentItem {
  id: string;
  name: string;
  tag: string;
  email: string;
  date: string;
  text: string;
}

export interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
}
