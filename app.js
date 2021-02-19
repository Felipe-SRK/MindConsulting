// Importações
const mongoose = require("mongoose");
const express = require("express");
const AdminBro = require("admin-bro");
const AdminBroExpressjs = require("@admin-bro/express");
const bcrypt = require("bcrypt")

AdminBro.registerAdapter(require("@admin-bro/mongoose"));

// Definição do servidor com express
const app = express();

// Adicionar Usuário
const User = mongoose.model("User", {
  nome: { type: String, required: true },
  CPF: { type: Number, required: true },
  email: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  role: { type: String, enum: ["Administrador", "Usuários"], required: true },
});

// Configuração do Bcrypt na senha do Usuário
const adminBro = new AdminBro({
  resources: [{
    resource: User,
    options: {
      properties: {
        encryptedPassword: {
          isVisible: false,
        },
        password: {
          type: 'string',
          isVisible: {
            list: false, edit: true, filter: false, show: false,
          },
        },
      },
      actions: {
        new: {
          before: async (request) => {
            if(request.payload.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                password: undefined,
              }
            }
            return request
          },
        }
      }
    }
  }],
  rootPath: '/',
})

// Rota de Login da pagina
const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})
app.use(adminBro.options.rootPath, router);

// Banco de Dados da Aplicação e caminho do Servidor Nodejs
const run = async () => {
  await mongoose.connect("mongodb+srv://Teste:teste@cluster0.qoocb.mongodb.net/MindConsulting?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await app.listen(8080, () =>
    console.log(`Executando Aplicação na porta 8080!`)
  );
};

run();
