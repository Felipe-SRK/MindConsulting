// Requirements
const mongoose = require("mongoose");
const express = require("express");
const AdminBro = require("admin-bro");
const AdminBroExpressjs = require("@admin-bro/express");
const bcrypt = require("bcrypt")

// We have to tell AdminBro that we will manage mongoose resources with it
AdminBro.registerAdapter(require("@admin-bro/mongoose"));

// express server definition
const app = express();

// Resources definitions
const User = mongoose.model("User", {
  nome: { type: String, required: true },
  CPF: { type: Number, required: true },
  email: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  role: { type: String, enum: ["Administrador", "Usuários"], required: true },
});

// Pass all configuration settings to AdminBro
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

// Build and use a router which will handle all AdminBro routes
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

// Running the server
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