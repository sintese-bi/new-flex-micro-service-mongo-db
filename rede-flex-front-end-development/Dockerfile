# Use uma imagem base oficial do Node.js
FROM node:22-alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todos os arquivos do projeto para o diretório de trabalho do container #
COPY . .

# Construa o projeto
RUN npm run build

# Exponha a porta que a aplicação usará
EXPOSE 3054

# Defina o comando para rodar a aplicação
CMD ["npm", "start"]
