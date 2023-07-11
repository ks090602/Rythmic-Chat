const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const genereateToken = require("../config/generateToken");
// const matchPassword = require

const registerUser = asyncHandler(async (req,resp)=>{
    const{name,email,password,pic} = req.body;

    if(!name || !email || !password)
    {
        resp.status(400);
        throw new Error("Please Enter the Required Fields");
    }

    const userExists = await User.findOne({email})

    if(userExists)
    {
        resp.status(400);  //400 is bad request status 
        throw new Error("User Already Exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    })

    if(user){
        resp.status(201).json({   // 201 means succesfully created
            _id:user.id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:genereateToken(user._id)
        });
    }
    else
    {
        resp.status(400);
        throw new Error("Failed to Create New User");
    }

});


const authUser = asyncHandler(async(req,resp)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    
    if(user && (await user.matchPassword(password)))
    {
        resp.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:genereateToken(user._id)
        });
    }
    else
    {
        resp.status(401);
        throw new Error("Invalid Credentials")
    }
    
});

const allUsers = asyncHandler(async(req,resp)=>{
    const keyword = req.query.search?{
        $or: [
        {name:{$regex:req.query.search,$options:"i"}},
        {email:{$regex:req.query.search,$options:"i"}}
    ]}:{};
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
    resp.send(users);
});
 

module.exports = {registerUser,authUser,allUsers};