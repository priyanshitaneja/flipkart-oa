import React, { useEffect, useRef, useState } from "react";

export function ChatWindow({
  messages,
  chatTitle,
  chatAvatar,
  onBack,
  onSendMessage,
}) {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState(messages);
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      messageId: Date.now().toString(),
      sender: "USER",
      message: input.trim(),
      messageType: "text",
      timestamp: Date.now(),
    };
    onSendMessage(newMsg);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: 16,
          fontWeight: "bold",
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <button onClick={onBack} style={{ marginRight: 12 }}>
          ←
        </button>
        <img
          src={chatAvatar}
          alt="avatar"
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            objectFit: "cover",
            margin: 4,
          }}
        />

        {chatTitle}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: 16,
          backgroundColor: "#f1f3f6",
        }}
      >
        {localMessages.map((msg) => {
          const isUser = msg.sender === "USER";
          const isOptioned = msg.messageType === "optionedMessage";

          return (
            <div
              key={msg.messageId}
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                backgroundColor: isUser
                  ? "#027CD5"
                  : isOptioned
                  ? "#f5f5f5"
                  : "#fff",
                color: isUser ? "#fff" : "#000",
                padding: "10px 14px",
                borderRadius: 18,
                marginBottom: 12,
                maxWidth: "75%",
                wordBreak: "break-word",
              }}
            >
              <div>{msg.message}</div>
              {isOptioned && msg.options && (
                <div style={{ marginTop: 8 }}>
                  {msg.options.map((opt, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 8,
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        marginTop: 4,
                        backgroundColor: "#fff",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{opt.optionText}</div>
                      {opt.optionSubText && (
                        <div style={{ fontSize: 12, color: "#878787" }}>
                          {opt.optionSubText}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={scrollAnchorRef} />
      </div>

      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #f0f0f0",
          backgroundColor: "#fff",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid #ccc",
            borderRadius: "20px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 16px",
            backgroundColor: "#027CD5",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
