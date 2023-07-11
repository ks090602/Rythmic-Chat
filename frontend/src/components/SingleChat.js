import { Box, IconButton, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFullInfo } from "../config/chatLogics";
import DisplayProfile from "./Misc/displayProfile";
import UpdateGroupChatModal from "./Misc/UpdateGroupChatModal";
import { useState } from "react";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();


  return (
    <>
      {(selectedChat) ? (
        <>
          <Text
            fontSize={{ base: "25px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {(!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <DisplayProfile
                    user={getSenderFullInfo(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain} />
                </>
              ))}
          </Text>
          <Box
            display = "flex"
            flexDirection={"column"}
            justifyContent={"flex-end"}
            backgroundColor={"#e1e1e1"}
            width = "100%"
            height = "100%"
            borderRadius = "xl"
            overflowY="hidden"
          >
            {/* Messages Here */}
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height="100%"
        >
          <Text fontSize={"2xl"} fontFamily={"sans-serif"}>
            Click On Users to Start Chatting with Them
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
