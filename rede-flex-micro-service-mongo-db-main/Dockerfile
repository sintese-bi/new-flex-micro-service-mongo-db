# Use Node.js 22 como base
FROM node:22-alpine

# Instale o OpenSSL
RUN apk add --no-cache openssl

# Define o diretório de trabalho
WORKDIR /usr/app

# Copie os arquivos de dependências ## 
COPY package*.json ./

# Atualize o npm para a versão mais recente
# RUN npm install -g npm@latest

# Instale as dependências do projeto
RUN npm install --legacy-peer-deps

# Copie o diretório Prisma e o restante do código antes de gerar o cliente Prisma
COPY prisma ./prisma
COPY . .

# Gere o cliente Prisma para os esquemas
RUN npx prisma generate --schema=./prisma/schemaLBCBi.prisma
RUN npx prisma generate --schema=./prisma/schemaSalesMonitor.prisma
RUN npx prisma generate --schema=./prisma/schemaRedeFlex.prisma
RUN npx prisma generate --schema=./prisma/schemaGasMonitor.prisma
RUN npm run build

RUN npm install pm2 -g

# Exponha a porta que a aplicação usará
EXPOSE 3052

# Comando para iniciar a aplicação
CMD ["pm2-runtime", "dist/server.js", "-i", "4"]
