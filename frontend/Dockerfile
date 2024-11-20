# Build stage
FROM node:20.10-alpine AS build

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json ./

# Instalar TODAS as dependências (incluindo devDependencies)
RUN npm install --include=dev

# Copiar o resto dos arquivos
COPY . .

# Verificar o conteúdo do diretório (para debug)
RUN ls -la

# Tentar o build com caminho explícito
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]