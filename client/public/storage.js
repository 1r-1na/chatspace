const DB_VERSION = "1";
const DB_NAME = "chat-db";
const CONVERSATION_STORE = "conversation-store";
const MESSAGE_STORE = "message-store";
const USER_STORE = "user-store";

export const idbChat = (() => {
  let dbInstance;

  function getDB() {
    if (dbInstance) {
      return dbInstance;
    }

    dbInstance = new Promise((resolve, reject) => {
      const openRequest = self.indexedDB.open(DB_NAME, DB_VERSION);

      openRequest.onerror = () => {
        reject(openRequest.error);
      };

      openRequest.onupgradeneeded = () => {
        openRequest.result.createObjectStore(USER_STORE, {
          keyPath: "username",
        });
        openRequest.result.createObjectStore(CONVERSATION_STORE, {
          keyPath: "id",
        });
        openRequest.result.createObjectStore(MESSAGE_STORE, {
          keyPath: "conversationId",
        });
      };

      openRequest.onsuccess = () => {
        resolve(openRequest.result);
      };
    });

    return dbInstance;
  }

  async function withStore(storeName, type, callback) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, type);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      callback(transaction.objectStore(storeName));
    });
  }

  return {
    async getUsers() {
      let request;
      await withStore(USER_STORE, "readonly", (store) => {
        request = store.getAll();
      });
      return request.result;
    },
    async getConversations(username) {
      let request;
      await withStore(CONVERSATION_STORE, "readonly", (store) => {
        request = store.getAll();
      });
      return request.result.filter((c) => c.participants.includes(username));
    },
    async getMessages(conversationId) {
      let request;
      await withStore(MESSAGE_STORE, "readonly", (store) => {
        request = store.get(conversationId);
      });
      return request.result;
    },
    setUser(user) {
      return withStore(USER_STORE, "readwrite", (store) => {
        store.put(user);
      });
    },
    setConversation(conversation) {
      return withStore(CONVERSATION_STORE, "readwrite", (store) => {
        store.put(conversation);
      });
    },
    setMessages(conversationId, messages) {
      return withStore(MESSAGE_STORE, "readwrite", (store) => {
        store.put({ conversationId: conversationId, messages: messages });
      });
    },
  };
})();
