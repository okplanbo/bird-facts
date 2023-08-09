import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";

import InfiniteScroll from "react-infinite-scroll-component";
import { format } from "date-fns";
import { Box, Paper } from "@mui/material";

import { Author, Message } from ":src/types";
import { PAGES, DEFAULT_CHUNK_SIZE } from ":src/constants";

import styles from "./Feed.module.scss";

interface FeedProps {
    messages: Message[];
    authors?: Author[];
}

export const Feed: React.FC<FeedProps> = ({ messages, authors }) => {
    const reversed = useMemo(() => {
        return messages.slice().reverse();
    }, [messages]);

    const [displayedMessages, setDisplayedMessages] = useState<Message[]>(reversed.slice(0, DEFAULT_CHUNK_SIZE));
    const hasMore = displayedMessages.length < reversed.length;

    useEffect(() => {
        setDisplayedMessages(reversed.slice(0, DEFAULT_CHUNK_SIZE))
    }, [reversed])

    const loadMoreMessages = useCallback(() => {
        const newMessages = reversed.slice(displayedMessages.length, displayedMessages.length + DEFAULT_CHUNK_SIZE);
        setDisplayedMessages(prev => [...prev, ...newMessages]);
    }, [reversed, displayedMessages]);

    return (
        <InfiniteScroll
            dataLength={displayedMessages.length}
            className={styles.wrapper}
            style={{ 'overflow': 'visible' }}
            next={loadMoreMessages}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={ !!displayedMessages.length &&
                <p style={{ textAlign: "center" }}>
                    Yay! You&apos;ve seen it all
                </p>
            }
        >
            { displayedMessages.length ? displayedMessages.map((item: Message) => {
                const author = authors ? authors.find(author => author.id === item.authorId) : null;
                return (
                    <Paper
                        elevation={3}
                        component='article'
                        className={styles.message}
                        key={item.id}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            { author && <Link to={`${PAGES.profile.path}?id=${author?.id}`}>
                                {author?.name}
                            </Link> }
                            <Box sx={{color: 'slategray'}}>
                                {format(new Date(item.dateTime), "MMM d, yyyy, HH:mm")}
                            </Box>
                        </Box>
                        <p>{item.text}</p>
                    </Paper>
                );
            }) : <Box sx={{marginLeft: '1rem'}}>No messages found</Box> }
        </InfiniteScroll>
    )
}