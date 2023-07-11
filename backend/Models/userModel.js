const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            unique:true,
            reuqired:true
        },
        password:{
            type:String,
            reuqired:true
        },
        pic:{
            type:String,
            required:true,
            default: "https://drive.google.com/file/d/1Ku84wBnTkkdlsQniaYRdWlDKz5UUI_7u/view"
        }
        
    },
    {
        timestamps:true
    }
)

userSchema.methods.matchPassword = async function(userEnteredPassword)
{
    return await bcrypt.compare(userEnteredPassword,this.password);
}

userSchema.pre('save',async function(next){
    if(!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password,salt);
})

const User = mongoose.model("User",userSchema);

module.exports = User;


