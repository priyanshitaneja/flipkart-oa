import React, { useEffect, useState } from "react";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";
import { usePersistentState } from "./hooks/usePersistentState";

export default function App() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = usePersistentState(
    "selectedChatId",
    null
  );
  const [search, setSearch] = usePersistentState("searchQuery", "");

  // useEffect(() => {
  //   fetch("https://my-json-server.typicode.com/codebuds-fk/chat/chats")
  //     .then((res) => res.json())
  //     .then((data) => setChats(data))
  //     .catch((err) => console.error("Failed to fetch chat list", err));
  // }, []);

  useEffect(() => {
    fetch("https://my-json-server.typicode.com/codebuds-fk/chat/chats")
      .then((res) => res.json())
      .then((apiChats) => {
        const stored = JSON.parse(localStorage.getItem("chatMessages") || "{}");
        const merged = apiChats.map((chat) => ({
          ...chat,
          messageList: stored[chat.id] || chat.messageList,
        }));
        setChats(merged);

        const savedId = localStorage.getItem("selectedChatId");
        const searchTerm = localStorage.getItem("searchQuery") || "";

        if (savedId) {
          setSelectedChatId(Number(savedId));
        } else if (searchTerm.trim()) {
          const filtered = merged.filter(
            (chat) =>
              chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              chat.orderId.includes(searchTerm)
          );
          if (filtered.length > 0) {
            setSelectedChatId(filtered[0].id);
            localStorage.setItem("selectedChatId", filtered[0].id);
          }
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedChatId && search.trim() && chats.length > 0) {
      const filtered = chats.filter(
        (chat) =>
          chat.title.toLowerCase().includes(search.toLowerCase()) ||
          chat.orderId.includes(search)
      );

      if (filtered.length > 0) {
        setSelectedChatId(filtered[0].id);
        localStorage.setItem("selectedChatId", filtered[0].id);
      }
    }
  }, [search, chats]);

  const updateChatMessages = (chatId, newMessages) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, messageList: newMessages } : chat
      )
    );

    const stored = JSON.parse(localStorage.getItem("chatMessages") || "{}");
    stored[chatId] = newMessages;
    localStorage.setItem("chatMessages", JSON.stringify(stored));
  };

  const selectedChat = chats.find((chat) => chat.id === Number(selectedChatId));
  const selectedMessages = selectedChat?.messageList || [];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {selectedChatId === null ? (
        <div style={{ width: "100%" }}>
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            search={search}
            setSearch={setSearch}
          />
        </div>
      ) : (
        <>
          <div style={{ width: 320, borderRight: "1px solid #f0f0f0" }}>
            <ChatList
              chats={chats}
              selectedChatId={selectedChatId}
              setSelectedChatId={setSelectedChatId}
              search={search}
              setSearch={setSearch}
            />
          </div>
          <div style={{ flex: 1, background: "#f1f3f6" }}>
            <ChatWindow
              messages={selectedMessages}
              chatTitle={selectedChat?.title}
              chatAvatar={selectedChat?.imageURL}
              onBack={() => setSelectedChatId(null)}
              onSendMessage={(msg) => {
                const updated = [...selectedMessages, msg];
                updateChatMessages(selectedChat.id, updated);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
