interface IButtonsKeyboard {
  type: 'buttons';
  buttons: string[];
}

interface ITextKeyboard {
  type: 'text';
}

/**
 * Response body of GET "/keyboard" api.
 */
type KeyboardResponse = IButtonsKeyboard | ITextKeyboard;

interface TextMessageEvent {
  user_key: string;
  type: 'text';
  content: string;
}

interface PhotoMessageEvent {
  user_key: string;
  type: 'photo';
  content: string;
}

/**
 * Request body of POST "/message" api.
 */
type MessageEvent = TextMessageEvent | PhotoMessageEvent;

interface MessageReply {
  text?: string;
  photo?: PhotoMessageReply;
  message_button?: MessageButtonReply;
}

interface PhotoMessageReply {
  url: string;
  width: number;
  height: number;
}

interface MessageButtonReply {
  label: string;
  url: string;
}

/**
 * Response body of POST "/message" api.
 */
interface MessageResponse {
  message: MessageReply;
  keyboard?: KeyboardResponse;
}

/**
 * Request body of POST "/friend" api.
 */
interface FriendEvent {
  user_key: string;
}
