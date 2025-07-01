
FROM node:22.9.0

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

# Instalar serve globalmente para servir archivos estáticos
RUN npm install -g serve

EXPOSE 3000

# Usar serve para servir la aplicación construida
CMD ["serve", "-s", "dist", "-l", "3000"]
