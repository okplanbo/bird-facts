import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Home, Profile } from ":src/pages";
import { authors, messages as initialMessages } from ":src/data";
import { Message } from ":src/types";
import { BASE, PAGES } from ":src/constants";

import "./App.scss";

export default function App() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    const addMessage = (message: Message) => {
        setMessages([...messages, message]);
    };

    return (
        <main>
            <Routes>
                <Route
                    path={`/${BASE}`}
                    element={
                        <Home
                            authors={authors}
                            messages={messages}
                            addMessage={addMessage}
                        />
                    }
                />
                <Route
                    path={PAGES.profile.path}
                    element={
                        <Profile
                            authors={authors}
                            messages={messages}
                        />
                    }
                />
                <Route path='*' element='Page not found' />
            </Routes>
        </main>
    );
}