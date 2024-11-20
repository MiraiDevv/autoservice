from flask import Flask, send_file
import pandas as pd
import psycopg2
from datetime import datetime
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Dicionário de tradução dos cabeçalhos
HEADERS_TRANSLATION = {
    'car_model': 'Modelo do Carro',
    'client_name': 'Nome do Cliente',
    'phone_number': 'Número de Telefone',
    'service_type': 'Tipo de Serviço',
    'service_value': 'Valor do Serviço',
    'payment_method': 'Método de Pagamento',
    'status': 'Status',
    'message_was_sent': 'Mensagem Enviada',
    'id': 'ID'
}

# Dicionário de tradução dos métodos de pagamento
PAYMENT_TRANSLATION = {
    'CARD': 'Cartão',
    'CASH': 'Dinheiro',
    'PIX': 'PIX'
}

# Dicionário de tradução dos status
STATUS_TRANSLATION = {
    'COMPLETED': 'Pronto',
    'PENDING': 'Pendente'
}

@app.route('/export', methods=['GET'])
def export_to_csv():
    try:
        # Connect to the database
        conn = psycopg2.connect(
            dbname="autoservice",
            user="postgres",
            password="postgres",
            host="db"
        )

        # Query the data
        query = "SELECT * FROM service_orders"
        df = pd.read_sql_query(query, conn)

        # Traduzir os métodos de pagamento
        df['payment_method'] = df['payment_method'].map(lambda x: PAYMENT_TRANSLATION.get(x, x) if pd.notnull(x) else x)

        # Traduzir os status
        df['status'] = df['status'].map(lambda x: STATUS_TRANSLATION.get(x, x) if pd.notnull(x) else x)

        # Traduzir TRUE/FALSE para Sim/Não na coluna message_was_sent
        df['message_was_sent'] = df['message_was_sent'].map({True: 'Sim', False: 'Não'})

        # Renomear as colunas para português
        df = df.rename(columns=HEADERS_TRANSLATION)

        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"ordens_servico_{timestamp}.csv"

        # Ensure the file is saved in the working directory
        file_path = os.path.join(os.getcwd(), 'tmp', filename)

        # Export to CSV com encoding UTF-8 para suportar caracteres especiais
        df.to_csv(file_path, index=False, encoding='utf-8-sig')

        conn.close()

        # Return the file
        return send_file(
            file_path,
            mimetype='text/csv',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        print(f"Error: {str(e)}")
        return str(e), 500
    finally:
        # Clean up the file after sending
        try:
            if 'file_path' in locals() and os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error cleaning up: {str(e)}")

if __name__ == "__main__":
    # Ensure tmp directory exists
    os.makedirs('tmp', exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)