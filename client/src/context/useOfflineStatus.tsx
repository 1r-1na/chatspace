import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";

const OfflineStatusContext = createContext(false);

export const OfflineStatusProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentlyOffline, setCurrentlyOffline] = useState(false);

  useEffect(() => {
    window.addEventListener("offline", () => {
      setCurrentlyOffline(true);
    });

    window.addEventListener("online", () => {
      setCurrentlyOffline(false);
    });

    return () => {
      window.removeEventListener("offline", () => {
        setCurrentlyOffline(true);
      });
      window.removeEventListener("online", () => {
        setCurrentlyOffline(false);
      });
    };
  }, []);

  return (
    <OfflineStatusContext.Provider value={currentlyOffline}>
      {children}
    </OfflineStatusContext.Provider>
  );
};

export const useOfflineStatus = () => {
  const isOffline = useContext(OfflineStatusContext);
  return isOffline;
};
