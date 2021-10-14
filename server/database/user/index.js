import mongoose  from "mongoose";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
const UserSchema = new mongoose.Schema({
    fullname :{type:String , required:true},
    email:{type:String , required:true},
    password:{type:String},
    address:[{ deatil : {type:String}, for:{type:String} }],
    phoneNumber:[{type:Number}],
},
{
    timestamps:true,
}
);


UserSchema.methods.generateJwtToken= function(){
  return jwt.sign({ user : this._id.toString()} , "ZomatoAPP");
};
// static and methods
UserSchema.statics.findByEmailAndPhone = async ({email, phoneNumber }) => {
    // check whether email exist
    
    const checkUserByEmail = await UserModel.findOne({email});
    const checkUserByPhone = await UserModel.findOne({phoneNumber});
    if (checkUserByEmail || checkUserByPhone){
        throw new Error("User already exist..!!!");
    }
    return false;
};

UserSchema.statics.findByEmailAndPassword = async ({email, password}) =>{
  // check whether email exist 
  const checkUserByEmail = await UserModel.findOne({email});
  if(!checkUserByEmail) throw new Error("User doesnot exists!!");

  //compare password
  const doesPasswordMatch = await bcrypt.compare( password ,checkUserByEmail.password);
  if(!doesPasswordMatch) throw new Error("Invalid password!!");

  return checkUserByEmail;
};


UserSchema.pre("save", function (next) {
    const user = this;
  
    // password is modified
    if (!user.isModified("password")) return next();
  
    // generate bcrypt salt
    bcrypt.genSalt(8, (error, salt) => {
      if (error) return next(error);
  
      // hash the password
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error);
  
        // assigning hashed password
        user.password = hash;
        return next();
      });
    });
  });
export const UserModel = mongoose.model("Users" , UserSchema);