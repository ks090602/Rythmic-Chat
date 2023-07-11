import { Box } from "@chakra-ui/react";
import {ChatState} from "../Context/ChatProvider";
import Header from "../components/Misc/header";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";

const Chatpage = ()=>{
    const {user} = ChatState(); 
    const[fetchAgain,setFetchAgain] = useState(false);

    return(
        <div style={{width:"100%"}}>
            {user && <Header />}
            <Box
                display = "flex"
                justifyContent="space-between"
                w = "100vw"
                h = "91vh"
                p = "2em"
            >
                {user && <MyChats fetchAgain={fetchAgain}/>}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default Chatpage;