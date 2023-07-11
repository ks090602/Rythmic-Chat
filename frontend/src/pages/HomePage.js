import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import {ChatState} from "../Context/ChatProvider";

const Homepage = () => {
  const history = useHistory();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user)
    {
      history.push("/chats");
    }
    else{history.push("/")}
  },[history]);

  return (
    <Container maxW = "xl" centerContent>
      <Box
        d="flex"
        backgroundColor="#ebebf2"
        justifyContent="center"
        textAlign="center"
        p={3}
        w="100%"
        m="10px 0px"
        borderRadius="xl"
        borderWidth="1px"
      >
        <Text fontSize="2xl" fontFamily="Open Sans" letterSpacing="2px">
          Rythmic Chat
        </Text>
      </Box>
      <Box
        backgroundColor="#ebebf2"
        w="100%"
        p={3}
        borderRadius="lg"
        borderWidth="2px"
      >
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList margin="1em 0">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{<Login />}</TabPanel>
            <TabPanel>{<SignUp />}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
