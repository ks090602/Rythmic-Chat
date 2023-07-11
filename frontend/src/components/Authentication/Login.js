import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import {useHistory} from "react-router-dom"; 
import axios from "axios";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const HandleClick = () => {
    setShow(!show);
  };

  const submitHandler = async() => {
    setLoading(true);
    if(email==="" || password==="")
    {
      toast({
        title: "Please Fill all the Feilds",
        status:"warning",
        duration: 4000,
        isClosable: true,
        position:"bottom" 
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers:{
          "Content-type":"application/json",
        },
      }

      const {data} = await axios.post('/api/user/login',{email,password},config);

      toast({
        title: "Login Successful",
        status:"success",
        duration: 4000,
        isClosable: true,
        position:"bottom" 
      });

      localStorage.setItem("userInfo",JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status:"error",
        duration: 4000,
        isClosable: true,
        position:"bottom"
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="0.5em">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          bg="#e9d8fd"
          placeholder="Enter Your Email "
          value = {email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            bg="#e9d8fd"
            type={show ? "text" : "password"}
            placeholder="Enter Your Password "
            value = {password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />

          <InputRightElement width="4em">
            <Button bg="#e9d8fd" onClick={HandleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="purple"
        width="100%"
        margin={"0.5em 0 0 0"}
        onClick={submitHandler}
        isLoading = {loading}
      >
        Login
      </Button>
  
    </VStack>
  );
};

export default Login;
