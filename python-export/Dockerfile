FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Limpar cache pip e instalar dependências
RUN pip cache purge && \
    pip install --no-cache-dir numpy==1.24.3 && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Criar diretório para os arquivos temporários
RUN mkdir -p /app/tmp && chmod 777 /app/tmp

WORKDIR /app

CMD ["python", "export_service.py"]