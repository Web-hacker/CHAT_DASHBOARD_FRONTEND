// // import React from 'react';
// // import { Message } from '../types/chat';

// // interface MessageBubbleProps {
// //   message: Message;
// //   isLast: boolean;
// // }

// // const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast }) => {
// //   const isUser = message.sender === 'user';

// //   const formatTime = (date: Date) => {
// //     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   };

// //   return (
// //     <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
// //       <div className={`max-w-3xl ${isUser ? 'order-2' : 'order-1'}`}>
// //         {/* Message bubble */}
// //         <div
// //           className={`
// //             px-6 py-4 rounded-2xl shadow-sm
// //             ${isUser
// //               ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-12'
// //               : 'bg-gray-100 text-gray-900 mr-12 border border-gray-200'
// //             }
// //             ${message.isStreaming ? 'animate-pulse' : ''}
// //           `}
// //         >
// //           {/* Message content */}
// //           <div className="whitespace-pre-wrap break-words">
// //             {message.content}
// //             {message.isStreaming && (
// //               <span className="inline-block w-2 h-5 bg-current opacity-75 animate-pulse ml-1" />
// //             )}
// //           </div>
// //         </div>

// //         {/* Timestamp */}
// //         <div className={`text-xs text-gray-500 mt-2 ${isUser ? 'text-right' : 'text-left'}`}>
// //           {formatTime(message.timestamp)}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MessageBubble;

// import React from 'react';
// import { Message } from '../types/chat';
// import ReactMarkdown from 'react-markdown';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { Components } from 'react-markdown';
// import { CodeComponent } from 'react-markdown/lib/ast-to-react';

// interface MessageBubbleProps {
//   message: Message;
//   isLast: boolean;
// }

// const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast }) => {
//   const isUser = message.sender === 'user';

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const markdownComponents: Components = {
//   code: (({ inline, className, children, ...props }) => {
//     const match = /language-(\w+)/.exec(className || '');
//     return !inline && match ? (
//       <SyntaxHighlighter
//         style={oneDark}
//         language={match[1]}
//         PreTag="div"
//         {...props}
//       >
//         {String(children).replace(/\n$/, '')}
//       </SyntaxHighlighter>
//     ) : (
//       <code className="bg-gray-200 text-red-500 px-1 rounded" {...props}>
//         {children}
//       </code>
//     );
//   }) as CodeComponent
// };

//   return (
//     <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
//       <div className={`max-w-3xl ${isUser ? 'order-2' : 'order-1'}`}>
//         <div
//           className={`
//             px-6 py-4 rounded-2xl shadow-sm
//             ${isUser
//               ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-12'
//               : 'bg-gray-100 text-gray-900 mr-12 border border-gray-200'
//             }
//             ${message.isStreaming ? 'animate-pulse' : ''}
//           `}
//         >
//           <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words">
//             <ReactMarkdown
//                    children={message.content}
//                    components={markdownComponents}
//             />
//           </div>

//           {message.isStreaming && (
//             <span className="inline-block w-2 h-5 bg-current opacity-75 animate-pulse ml-1" />
//           )}
//         </div>
//         <div className={`text-xs text-gray-500 mt-2 ${isUser ? 'text-right' : 'text-left'}`}>
//           {formatTime(message.timestamp)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessageBubble;

import React from "react";
import ReactMarkdown, { Components, ExtraProps } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Message } from "../types/chat";

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Markdown render customizations
  const markdownComponents: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-200 px-1 rounded" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div className={`${isUser ? "max-w-3xl order-2" : "order-1"}`}>
        <div
          className={`
            px-6 py-4 rounded-2xl shadow-sm
            ${
              isUser
                ? "bg-gray-100 text-gray-900 mr-12 border border-gray-200 ml-12"
                : ""
            }
            ${message.isStreaming ? "animate-pulse" : ""}
          `}
        >
          <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words">
            <ReactMarkdown components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
          {message.isStreaming && (
            <span className="inline-block w-2 h-5 bg-current opacity-75 animate-pulse ml-1" />
          )}
        </div>
        <div
          className={`text-xs text-gray-500 mt-2 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
