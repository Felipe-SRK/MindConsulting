const Usuario = require("../models/usuario.model");

module.exports = {
  index(request, response){
    response.json({ message: "Hello World From" });
  },
  async create(request, response){
    const {nome_user, email_user, tipo_user, senha_user} = request.body;

    let data = {};

    let user = Usuario.findOne({email_user});
    if(!user){
      data = {nome_user, email_user, tipo_user, senha_user};
      user = await Usuario.create(data);
      return response.status(200).json(user);
    }else{
      return response.status(500).json(user);
    }
  }
}