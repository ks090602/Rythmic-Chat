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

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [showcp, setShowcp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [loading,setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const HandleClick = () => {
    setShow(!show);
  };

  const HandleClickcp = () => {
    setShowcp(!showcp);
  };

  const postDetails = (pic) => {
    setLoading(true);
    if(pic===undefined)
    {
      toast({
        title: "Please Select an Image 😃",
        status: "warning",
        duration : 4000,
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    if(pic.type === "image/jpeg" || pic.type === "image/png" || pic.type === "image/jpg")
    {
      const data = new FormData();
      data.append("file",pic);
      data.append("upload_preset", "Rythmic-Chat");
      data.append("cloud_name", "mern-apps");
      fetch("https://api.cloudinary.com/v1_1/mern-apps/image/upload",{
        method:"post",
        body: data
      }).then((res)=>res.json()).then(data=>{
        setPic(data.url.toString());
        // console.log(data.url.toString());
        setLoading(false);
      })
    } 
    else
    {
      toast({
        title: "Please Select an Image 😃",
        status: "warning",
        duration : 4000,
        isClosable: true,
        position: "bottom"
      });
      setLoading(false);
    }

  };

  const submitHandler = async() => {
    setLoading(true);
    if(name==="" || email==="" || password==="" || confirmPassword==="")
    {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration : 4000,
        isClosable: true,
        position: "bottom"
      });
      setLoading(false);
      return;
    }
    if(password!==confirmPassword)
    {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration : 4000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers:{
          "Content-type":"application/json",
        },
      }

      const { data } = await axios.post("/api/user",{name,email,password,pic},config);
      toast({
        title: "Registration Successful",
        status: "success",
        duration : 4000,
        isClosable: true,
        position: "bottom"
      });
      
      // storing in local storage
      localStorage.setItem("userInfo",JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        titel:"Error Occured!",
        description: error.response.data.message,
        status:"error",
        duration:4000,
        isClosable: true,
        position:"bottom"
      })
      setLoading(false);
    }

  };

  return (
    <VStack spacing="0.5em">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          bg="#e9d8fd"
          placeholder="Enter Your Name "
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          bg="#e9d8fd"
          placeholder="Enter Your Email "
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

      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            bg="#e9d8fd"
            type={showcp ? "text" : "password"}
            placeholder="Confirm Password "
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
          />

          <InputRightElement width="4em">
            <Button bg="#e9d8fd" onClick={HandleClickcp}>
              {showcp ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload Your Picture </FormLabel>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            postDetails(event.target.files[0]);
          }}
        />
      </FormControl>

      <Button
        colorScheme="purple"
        width = "100%" 
        margin={"0.5em 0 0 0"}
        onClick={submitHandler}
        isLoading = {loading}
      >
        Sign Up
        </Button>
    </VStack>
  );
};

export default SignUp;
