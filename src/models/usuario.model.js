const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DataSchema = new mongoose.Schema({
  nome_user:String,
  email_user:String,
  tipo_user:{type:Number, default:1},
  senha_user:String,
},{
  timestamps: true
});

DataSchema.pre('save', function(next){
  if(!this.isModified('senha_user')){
    return next();
  }
  this.senha_user = bcrypt.hashSync(this.senha_user,10);
  next();
});

const usuarios = mongoose.model("Usuarios", DataSchema);
module.exports = usuarios;