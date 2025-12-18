import { createContext, useContext, useState } from 'react';
import NotificationModal from '../components/NotificationModal';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);

    const openNotifications = () => setVisible(true);
    const closeNotifications = () => setVisible(false);

    return (
        <NotificationContext.Provider value={{ visible, openNotifications, closeNotifications }}>
            {children}
            <NotificationModal visible={visible} onClose={closeNotifications} />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
