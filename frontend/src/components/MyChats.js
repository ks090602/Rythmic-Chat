import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/chatLogics";
import GroupChatModal from "./Misc/GroupChatModal";

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState("");
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Chats!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir={"column"}
        alignItems={"center"}
        bg="white"
        padding={3}
        w={{ base: "100%", md: "31%" }}
        borderWidth="5px"
        borderRadius={"15px"}
        borderColor={"#fe4f58"}
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <GroupChatModal>
            <Button
              display="flex"
              fontSize={{ base: "15px", md: "10px", lg: "12px" }}
              color="black"
              backgroundColor={"#e1e1e1"}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display="flex"
          flexDir={"column"}
          width={"100%"}
          height={"100%"}
          overflowY={"hidden"}
          p={4}
          borderRadius="md"
        >
          {chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map((chatElem) => (
                <Box
                  onClick={() => setSelectedChat(chatElem)}
                  cursor="pointer"
                  bg={selectedChat === chatElem ? "#ff4f5a" : "#e1e1e1"}
                  color={selectedChat === chatElem ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chatElem._id}
                >
                  <Text>
                    {!chatElem.isGroupChat
                      ? getSender(loggedUser, chatElem.users)
                      : chatElem.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
