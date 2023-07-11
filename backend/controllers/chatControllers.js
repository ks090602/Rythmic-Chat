const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");
 

const accessChat = asyncHandler(async(req,resp)=>{
    const { userId } = req.body;

    if(!userId)
    {
        console.log("UserId param not sent with request");
        return resp.sendStatus(400);
    }

    //Querying the database for an existing chat:
    let isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            { users: { $elemMatch: { $eq: req.user._id}}},
            { users: { $elemMatch: { $eq: userId }}}
        ]
    }).populate("users","-password").populate("latestMessage");

    isChat = await User.populate(isChat,{
        path: "latestMessage.sender",
        select: "name pic email"
    })

    if(isChat.length>0)
    {
        resp.send(isChat[0]);
    }
    else
    {
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id,userId]
        }

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createdChat._id}).populate("users","-password");
            resp.status(200).send(FullChat);
        } catch (error) {
            resp.status(400);
            throw new Error(error.message);
        }
    }
})

const fetchChats = asyncHandler(async(req,resp)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).populate("users","-password").populate("groupAdmin","-password").populate("latestMessage").sort({updatedAt: -1}).then(async(results)=>{
            results = await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email"
            })
            resp.status(200).send(results);
        });
    } catch (error) {
        resp.status(400);
        throw new Error(error.message);
    }
})

const createGroupChats = asyncHandler(async(req,resp)=>{
    if(!req.body.name || !req.body.users)
    {
        return resp.status(400).send({message: "Please Fill all The Fields to Create a Group Chat!"});
    }

    let users = JSON.parse(req.body.users); 

    if(users.length<2){
        return resp.status(400).send({message:"More than 2 Users are required to form a group chat!"});
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            users: users,
            chatName: req.body.name,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const fullGroupChat = await Chat.findOne({_id: groupChat._id}).populate("users","-password").populate("groupAdmin","-password");

        resp.status(200).json(fullGroupChat);
    } catch (error) {
        resp.status(400);
        throw new Error(error.message);
    }

})

const renameGroup = asyncHandler(async(req,resp)=>{
    const {chatId , chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName:chatName
        },
        {
            new:true // this returns the new updated name if it would not have been written then the old name would have been returned 
        }
    ).populate("users","-password").populate("groupAdmin","-password");

    if(!updatedChat)
    {
        resp.send(400);
        throw new Error("Chat Not Found!");
    }
    else
    {
        resp.json(updatedChat);
    }
})

const addToGroup = asyncHandler(async(req,resp)=>{
    const {chatId,userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{ users:userId }
        },
        {
            new:true
        }
    ).populate("users","-password").populate("groupAdmin","-password");

    if(!added)
    {
        resp.status(400);
        throw new Error("Chat Not Found!");
    }
    else
    {
        resp.json(added);
    }
})

const removeFromGroup = asyncHandler(async(req,resp)=>{
    const {chatId,userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{ users:userId }
        },
        {
            new:true
        }
    ).populate("users","-password").populate("groupAdmin","-password");

    if(!removed)
    {
        resp.status(400);
        throw new Error("Chat Not Found!");
    }
    else
    {
        resp.json(removed);
    }
})


module.exports = {accessChat,fetchChats,createGroupChats,renameGroup,addToGroup,removeFromGroup};