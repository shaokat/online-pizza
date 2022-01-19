const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({

    name:{type:String, required:true},
    email:{type:String, required:true, unique: true},
    password:{type:String, required:true},
    role: {type: String, 
      default: 'customer'},
    status: {
        type: String, 
        enum: ['Pending', 'Active'],
        default: 'Pending'
      },
},{timestamps: true})

userSchema.pre('save', async function(){

  const user = this
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
})

userSchema.methods.createJWT = function(){
  return jwt.sign({email: this.email,name:this.name}, process.env.JWT_SECRET,
  {expiresIn:process.env.JWT_LIFETIME})
}

userSchema.methods.comparePassword = async function(candidatePassowrd){
  const isMatch = await bcrypt.compare(candidatePassowrd, this.password)
  return isMatch
}

module.exports = mongoose.model('User', userSchema)