import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
const socketInstance = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
  withCredentials: true,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  autoConnect: false,
});

export const useSocket = () => {
  const socketRef = useRef<Socket>(socketInstance);
  const [isConnected, setIsConnected] = useState(socketInstance.connected);
  useEffect(() => {
    if (!isConnected) socketRef.current.connect();

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    // events
    socketRef.current.on('connect',onConnect);
    socketRef.current.on('disconnect',onDisconnect);

    return ()=>{
      socketRef.current.off('connect', onConnect);
      socketRef.current.off('disconnect', onDisconnect);
    
    }
  }, []);

  return {
    isConnected,
    socket: socketRef.current,
  };
};

// import { useEffect, useRef, useCallback, useState } from 'react';

// // Assuming these types are defined in your project
// import { Message } from '../services/chat.service';
// import { ChatRoom } from '../models/room';
// import { ChatMessage } from '../models/chat-message';

// // Server response type matching backend
// interface ServerResponse<T> {
//   success: boolean;
//   data?: T;
//   error?: string;
// }

// interface UseSocketOptions {
//   onNewMessage?: (message: ChatMessage) => void;
//   onMessagesRead?: (data: { roomId: string; readBy: string }) => void;
//   onNewChatRoom?: (chatRoom: ChatRoom) => void;
//   onError?: (error: string) => void;
//   onMessagesReceived?: (messages: ChatMessage[]) => void;
// }

// interface SocketConnection {
//   isConnected: boolean;
//   sendMessage: (chatRoomId: string, text: string) => void;
//   joinRoom: (roomId: string) => void;
//   leaveRoom: (roomId: string) => void;
//   markRead: (roomId: string) => void;
//   getChatMessages: (roomId: string, limit?: number) => void;
//   createChatRoom: (postId: string, message: string) => Promise<ChatRoom | undefined>;
//   chatRooms: ChatRoom[];
// }

// // Singleton socket instance

// export const useSocket = ({
//   onNewMessage,
//   onMessagesRead,
//   onNewChatRoom,
//   onError,
//   onMessagesReceived,
// }: UseSocketOptions = {}): SocketConnection => {
//   const socketRef = useRef<Socket>(socketInstance);
//   const [isConnected, setIsConnected] = useState(socketInstance.connected);
//   const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
//   const callbacksRef = useRef({ onNewMessage, onMessagesRead, onNewChatRoom, onError, onMessagesReceived });

//   // Update callbacks
//   useEffect(() => {
//     callbacksRef.current = { onNewMessage, onMessagesRead, onNewChatRoom, onError, onMessagesReceived };
//   }, [onNewMessage, onMessagesRead, onNewChatRoom, onError, onMessagesReceived]);

//   const ensureConnected = useCallback((action: string): boolean => {
//     if (!socketRef.current || !isConnected) {
//       const error = `Cannot ${action}: Socket not connected`;
//       console.error(error);
//       callbacksRef.current.onError?.(error);
//       return false;
//     }
//     return true;
//   }, [isConnected]);

//   useEffect(() => {
//     const socket = socketRef.current;

//     if (!socket.connected) {
//       socket.connect();
//     }

//     const handleConnect = () => {
//       setIsConnected(true);
//       socket.emit('getChatRooms', (response: ServerResponse<ChatRoom[]>) => {
//         if (response.success && response.data) {
//           setChatRooms(response.data);
//         } else {
//           callbacksRef.current.onError?.(response.error || 'Failed to fetch chat rooms');
//         }
//       });
//     };

//     const handleDisconnect = (reason: string) => {
//       setIsConnected(false);
//       callbacksRef.current.onError?.(`Disconnected: ${reason}`);
//     };

//     const handleError = (error: { message: string }) => {
//       callbacksRef.current.onError?.(error.message || 'Socket error occurred');
//     };

//     const handleConnectError = (error: Error) => {
//       setIsConnected(false);
//       callbacksRef.current.onError?.(`Connection error: ${error.message}`);
//     };

//     const handleReconnect = (attempt: number) => {
//       setIsConnected(true);
//       console.log(`Reconnected after ${attempt} attempts`);
//     };

//     // Event listeners matching backend events
//     socket.on('connect', handleConnect);
//     socket.on('disconnect', handleDisconnect);
//     socket.on('error', handleError);
//     socket.on('connect_error', handleConnectError);
//     socket.on('reconnect', handleReconnect);
//     socket.on('newMessage', (message: ChatMessage) => callbacksRef.current.onNewMessage?.(message));
//     socket.on('messagesRead', (data: { roomId: string; readBy: string }) =>
//       callbacksRef.current.onMessagesRead?.(data)
//     );
//     socket.on('newChatRoom', (chatRoom: ChatRoom) => {
//       setChatRooms((prev) => [...prev, chatRoom]);
//       callbacksRef.current.onNewChatRoom?.(chatRoom);
//     });
//     socket.on('notification', (notification: { type: string; roomId: string; message?: ChatMessage }) => {
//       if (notification.type === 'newMessage' && notification.message) {
//         callbacksRef.current.onNewMessage?.(notification.message);
//       }
//     });

//     return () => {
//       socket.off('connect', handleConnect);
//       socket.off('disconnect', handleDisconnect);
//       socket.off('error', handleError);
//       socket.off('connect_error', handleConnectError);
//       socket.off('reconnect', handleReconnect);
//       socket.off('newMessage');
//       socket.off('messagesRead');
//       socket.off('newChatRoom');
//       socket.off('notification');
//     };
//   }, []);

//   const sendMessage = useCallback((chatRoomId: string, text: string) => {
//     if (!ensureConnected('send message')) return;

//     socketRef.current.emit(
//       'sendMessage',
//       { chatRoomId, message: text },
//       (response: ServerResponse<ChatMessage>) => {
//         if (!response.success) {
//           callbacksRef.current.onError?.(response.error || 'Failed to send message');
//         }
//       }
//     );
//   }, [ensureConnected]);

//   const joinRoom = useCallback((roomId: string) => {
//     if (!ensureConnected('join room')) return;
//     socketRef.current.emit('joinRoom', roomId);
//   }, [ensureConnected]);

//   const leaveRoom = useCallback((roomId: string) => {
//     if (!ensureConnected('leave room')) return;
//     socketRef.current.emit('leaveRoom', roomId);
//   }, [ensureConnected]);

//   const markRead = useCallback((roomId: string) => {
//     if (!ensureConnected('mark as read')) return;
//     socketRef.current.emit('markRead', roomId);
//   }, [ensureConnected]);

//   const getChatMessages = useCallback(
//     (roomId: string, limit = 50) => {
//       if (!ensureConnected('get chat messages')) return;

//       socketRef.current.emit(
//         'getChatMessages',
//         { roomId, limit },
//         (response: ServerResponse<ChatMessage[]>) => {
//           if (response.success && response.data) {
//             callbacksRef.current.onMessagesReceived?.(response.data);
//           } else {
//             callbacksRef.current.onError?.(response.error || 'Failed to fetch messages');
//             callbacksRef.current.onMessagesReceived?.([]);
//           }
//         }
//       );
//     },
//     [ensureConnected]
//   );

//   const createChatRoom = useCallback((postId: string, message: string): Promise<ChatRoom | undefined> => {
//     return new Promise((resolve, reject) => {
//       if (!ensureConnected('create chat room')) {
//         reject(new Error('Socket not connected'));
//         return;
//       }

//       socketRef.current.emit(
//         'createChatRoom',
//         { postId, message },
//         (response: ServerResponse<ChatRoom>) => {
//           if (response.success && response.data) {
//             const chatRoom: ChatRoom = response.data;
//             setChatRooms((prev) => [...prev, chatRoom]);
//             callbacksRef.current.onNewChatRoom?.(chatRoom);
//             resolve(chatRoom);
//           } else {
//             const errorMsg = response.error || 'Failed to create chat room';
//             callbacksRef.current.onError?.(errorMsg);
//             reject(new Error(errorMsg));
//           }
//         }
//       );
//     });
//   }, [ensureConnected]);

//   return {
//     isConnected,
//     sendMessage,
//     joinRoom,
//     leaveRoom,
//     markRead,
//     getChatMessages,
//     createChatRoom,
//     chatRooms,
//   };
// };

// export default useSocket;
