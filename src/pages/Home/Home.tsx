import React, { useState, useRef } from "react";

import { Autocomplete, Button, TextField, Dialog, DialogActions,
    Typography, Box, DialogTitle, DialogContent } from "@mui/material";

import { Feed } from ":src/components";
import { Message, Author } from ":src/types";
import { APP_TITLE, DEFAULT_USER_ID, MIN_SEARCH_CHARS, MIN_MESSAGE_SIZE } from ":src/constants";

interface HomeProps {
    authors: Author[];
    messages: Message[];
    addMessage: (text: Message) => void;
}

export const Home: React.FC<HomeProps> = ({
    authors,
    messages,
    addMessage,
}) => {
    const [open, setOpen] = useState(false);
    const [newMessageText, setNewMessageText] = useState('');
    const [selectedAuthors, setSelectedAuthors] = useState<Author['id'][]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [isShowNewMessageError, setIsShowNewMessageError] = useState(false);
    const charCountRef = useRef(0);
    
    const handleClose = () => {
        setOpen(false);
        charCountRef.current = 0;
        setNewMessageText('')
        setIsShowNewMessageError(false);
    }

    const handleSubmit = () => {
        if (!newMessageText || newMessageText.length < MIN_MESSAGE_SIZE) {
            setIsShowNewMessageError(true);
            return;
        }
        const message: Message = {
            dateTime: new Date().toISOString(),
            authorId: DEFAULT_USER_ID,
            text: newMessageText,
            id: messages.length + 1,
        };
        addMessage(message);
        handleClose();
    };

    const hasSearchValue = searchValue && searchValue.length >= MIN_SEARCH_CHARS;
    const filteredMessages = !selectedAuthors.length && !hasSearchValue
        ? messages
        : messages
            .filter(msg => {
                if (selectedAuthors.length) {
                    return selectedAuthors.includes(msg.authorId);
                } else {
                    return true;
                }
            })
            .filter(msg => msg.text.includes(searchValue));

    return (
        <>
            <Typography variant="h2" component="h1" margin={2}>
                {APP_TITLE}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexGrow: 0,
                    justifyContent: "space-between",
                    margin: "2rem 0.5rem",
                    gap: "1rem",
                }}
            >
                <Autocomplete
                    multiple
                    autoComplete={false}
                    limitTags={1}
                    fullWidth
                    options={authors.map(({ id, name }) => {
                        return { id, name };
                    })}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Authors"
                        />
                    )}
                    onChange={(_e, values) => setSelectedAuthors(values.map(author => author.id))}
                />
                <TextField
                    fullWidth
                    label="Search"
                    helperText={`${MIN_SEARCH_CHARS} characters or more`}
                    variant="outlined"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setSearchValue(event.target.value);
                    }}
                />
            </Box>

            <Feed messages={filteredMessages} authors={authors} />
            <Button
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{ position: 'fixed', bottom: '2rem', right: 'calc(2.5rem - (100vw - 100%))' }}
            >
                New message
            </Button>
            <Dialog open={open} onClose={handleClose} disableScrollLock>
                <DialogTitle>Add a new message</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        error={isShowNewMessageError}
                        helperText={isShowNewMessageError ? `at least ${MIN_MESSAGE_SIZE} characters` : null}
                        multiline
                        label="Message"
                        variant="outlined"
                        value={newMessageText}
                        sx={{marginTop:'1em', minWidth: '30vw'}}
                        onChange={(e) => {
                            setNewMessageText(e.target.value)
                            charCountRef.current = e.target.value?.length || 0;
                            if (e.target.value?.length >= 10) {
                                setIsShowNewMessageError(false)
                            }
                        }}
                        rows={4}
                        inputProps={{ maxLength: 200, minLength: 10 }}
                    />
                    <DialogActions sx={{width: '100%', justifyContent: 'space-between'}}>
                        <Box sx={{alignSelf: 'flex-start'}}>{charCountRef.current}/200</Box>
                        <Box>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleSubmit}>Submit</Button>
                        </Box>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
};
