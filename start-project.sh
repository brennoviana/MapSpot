# Configurações
PORT=3000
ENV_PATH="frontend/.env"
FRONTEND_DIR="frontend"

# Função para exibir mensagens de erro e sair
error_exit() {
    echo "Erro: $1"
    [ -n "$NGROK_PID" ] && kill $NGROK_PID >/dev/null 2>&1
    exit 1
}

# Verifica se ngrok está instalado
command -v ngrok >/dev/null 2>&1 || error_exit "ngrok não está instalado. Instale com 'brew install ngrok' no macOS ou veja a documentação no Linux."

# Verifica se jq está instalado
command -v jq >/dev/null 2>&1 || error_exit "jq não está instalado. Instale com 'brew install jq' no macOS ou 'sudo apt install jq' no Linux."

# Verifica se o Docker está rodando
docker info >/dev/null 2>&1 || error_exit "Docker não está rodando. Inicie o Docker Desktop ou o serviço Docker."

# Inicia o ngrok no modo background
echo "Iniciando ngrok na porta $PORT..."
ngrok http $PORT >/dev/null 2>&1 &
NGROK_PID=$!

# Aguarda o ngrok inicializar
echo "Aguardando ngrok iniciar..."
sleep 5

# Consulta a API local do ngrok e captura a URL pública
NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url')

# Verifica se a URL foi capturada
[ -z "$NGROK_URL" ] && error_exit "Não foi possível capturar a URL do ngrok. Certifique-se de que ele está configurado corretamente."

echo "ngrok URL capturada: $NGROK_URL"

# Cria o arquivo .env se não existir
if [ ! -f "$ENV_PATH" ]; then
    echo "Criando arquivo .env..."
    mkdir -p "$(dirname "$ENV_PATH")" || error_exit "Falha ao criar o diretório do arquivo .env."
    touch "$ENV_PATH" || error_exit "Falha ao criar o arquivo .env em $ENV_PATH"
fi

# Remove a linha existente com EXPO_PUBLIC_API_URL, se existir
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' '/^EXPO_PUBLIC_API_URL=/d' "$ENV_PATH" || error_exit "Falha ao editar o arquivo .env no macOS."
else
    sed -i '/^EXPO_PUBLIC_API_URL=/d' "$ENV_PATH" || error_exit "Falha ao editar o arquivo .env no Linux."
fi

# Adiciona a nova URL no .env
echo "EXPO_PUBLIC_API_URL='$NGROK_URL'" >>"$ENV_PATH"
echo "URL salva no arquivo .env: $ENV_PATH"

# Executa os containers com Docker Compose
echo "Reiniciando os containers com Docker Compose..."
docker-compose -f docker-compose.yml down -v || error_exit "Falha ao parar os containers."
docker-compose -f docker-compose.yml up --build -d || error_exit "Falha ao subir os containers."

# Inicia o Expo no frontend
echo "Iniciando Expo no frontend..."
(cd "$FRONTEND_DIR" && npx expo start --tunnel -c) || error_exit "Falha ao iniciar o Expo no diretório $FRONTEND_DIR."
