import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from 'axios';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import DisplayProfile from "./displayProfile";
import { useHistory } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";

const Header = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user,setSelectedChat,chats,setChats } = ChatState();
  const history = useHistory();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logOutFunctionality = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };


  const toast = useToast();
  const handleSearch = async()=>{
    if(!search)
    {
      toast({
        title:"Please Search A User",
        status:"warning",
        duration:4000,
        isClosable:true,
        position:"top"
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers:{
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get(`/api/user?search=${search}`,config);
      console.log(data);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title:"Oops! Error Occured",
        description:"Failed to Load the Search Results",
        status:"error",
        duration:4000,
        isClosable:true,
        position:"bottom-left"
      });
      setLoading(false);
    }

  };

  const accessChat = async(userId)=>{
    try{
      setLoadingChat(true);

      const config = {
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      };

      const { data } = await axios.post("/api/chat" , {userId} , config); 

      if(!chats.find((chat)=>chat._id===data._id)){
        setChats([data,...chats]);
      }
      
      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    }catch(error){
      toast({
        title:"Error Fetching the Chat",
        description: error.message,
        status:"error",
        duration:4000,
        isClosable:true,
        position:"bottom-left"
      });
    }
  };


  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="white"
        width="100%"
        height="9vh"
        borderWidth="5px"
        borderColor="#fe4f58"
      >
        <Tooltip
          hasArrow
          placement="bottom"
          label="Search Users to Chat with 😃"
        >
          <Button variant="ghost" onClick={onOpen}>
            <FontAwesomeIcon
              icon="fa-solid fa-magnifying-glass"
              style={{ color: "#000000" }}
            />
            <Text display={{ base: "none", md: "flex" }} px="5" fontSize={"lg"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"3xl"}>Rythmic-Chat</Text>
        <Menu>
          <MenuButton>
            <BellIcon boxSize={7} color="red" margin={"0 -35em 0 0"} />
          </MenuButton>
          {/* <MenuList></MenuList> */}
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            margin={"0 1em"}
            rightIcon={<ChevronDownIcon />}
          >
            <Avatar size="sm" cursor="pointer" src={user.pic}></Avatar>
          </MenuButton>
          <MenuList>
            <DisplayProfile user={user}>
              <MenuItem>My Profile</MenuItem>
            </DisplayProfile>
            <MenuDivider />
            <MenuItem onClick={logOutFunctionality}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users Here 🔽</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name/email 😃"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button 
              onClick={handleSearch}
              >Go</Button>
            </Box>
            {loading?(
              <ChatLoading />
            ):((searchResults)?.map(elem=>(
              <UserListItem 
                key = {elem._id}
                user = {elem}
                handleFunction = {()=>{accessChat(elem._id)}}
              />
            )))}
            {loading && <Spinner ml="auto" display = "flex" marginTop={"20px"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
