import React from "react";

export function ChatList({
  chats = [],
  selectedChatId,
  setSelectedChatId,
  search,
  setSearch,
}) {
  const filtered = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(search.toLowerCase()) ||
      chat.orderId.includes(search)
  );

  //   const formatTimestamp = (ts) => {
  //     const date = new Date(ts);
  //     const now = new Date();
  //     return date.toDateString() === now.toDateString()
  //       ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  //       : date.toLocaleDateString();
  //   };

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    return isToday
      ? date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) // e.g. 14:05
      : date.toLocaleDateString(); // e.g. 15/06/2025
  };

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "auto",
        padding: 16,
        boxSizing: "border-box",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ color: "#212121", fontSize: 14, fontWeight: 600 }}>
        Filter by Title/Order ID
      </h2>
      <input
        placeholder="Start typing to search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          color: "#000",
          borderWidth: 0,
          borderBottom: "1px solid #000",

          padding: "8px 12px",
          margin: "12px 0",
          width: "100%",
          outline: "none",
        }}
      />
      {filtered.map((chat) => {
        const lastMessage =
          chat.messageList?.[chat.messageList.length - 1]?.message ||
          "No messages yet";
        return (
          <div
            key={chat.id}
            onClick={() => setSelectedChatId(chat.id)}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              padding: "12px 8px",
              backgroundColor: chat.id === selectedChatId ? "#f1f3f6" : "#fff",
              borderBottom: "1px solid #f0f0f0",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 8,
            }}
          >
            <img
              src={chat.imageURL}
              alt="avatar"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600, color: "#000" }}>
                  {chat.title}
                </span>
                <span style={{ fontSize: 12, color: "#878787" }}>
                  {formatTimestamp(chat.latestMessageTimestamp)}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#000", marginTop: 4 }}>
                {chat.orderId}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#878787",
                  marginTop: 4,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {lastMessage}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
