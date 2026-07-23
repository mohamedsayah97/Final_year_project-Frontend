FROM node:20-alpine

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
COPY package-lock.json* ./
RUN npm ci

# Copier le code source
COPY . .

# Exposer le port de développement
EXPOSE 5173

# Démarrer le serveur de développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]