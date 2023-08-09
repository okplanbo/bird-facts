import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Typography, Box } from "@mui/material";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import { Feed } from ":src/components";
import { Message, Author } from ":src/types";
import { BASE, DEFAULT_USER_ID, PAGES } from ":src/constants";

interface ProfileProps {
    authors: Author[];
    messages: Message[];
}

export const Profile: React.FC<ProfileProps> = ({ authors, messages }) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const stringId = params.get("id");
    const profileId = stringId ? parseInt(stringId, 10) : DEFAULT_USER_ID;
    const isOwnProfile = profileId === DEFAULT_USER_ID;
    const authorInfo = profileId || isOwnProfile
        ? authors.find((author) => author.id === profileId)
        : null;
    const authorMessages = profileId || isOwnProfile
        ? messages.filter((message) => message.authorId === profileId)
        : [];
    const isError = !authorInfo;
    const defaultTitle = PAGES.profile.title;

    return isError ? (
        <Box sx={{ textAlign: "center", marginTop: "5rem" }}>
            Author not found
        </Box>
    ) : (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: "space-between",
                }}
            >
                <Typography
                    variant="h4"
                    component="h2"
                    margin={2}
                    sx={{display: 'inline'}}
                >
                    {isOwnProfile ? defaultTitle : authorInfo.name}
                </Typography>
                <Link to={`/${BASE}`}>
                    <Box sx={{display: 'flex', alignItems: 'center',}}>
                        <NavigateBeforeIcon />Back
                    </Box>
                </Link>
            </Box>
            { authorInfo?.description && (
                <Box sx={{margin: '1rem 1rem 2rem'}}>
                    {authorInfo.description}
                </Box>
            ) }
            <Feed messages={authorMessages} />
        </>
    );
};
