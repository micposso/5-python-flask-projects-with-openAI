from flask import Flask, render_template, request, jsonify, Response
from openai import OpenAI
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Securely apply CORS
    CORS(app, resources={r"/answer": {"origins": "http://localhost:5173"}}, methods=["POST", "GET"])

    api_key = os.getenv('API_KEY')
    client = OpenAI(api_key=api_key)
    app.config['API_KEY'] = api_key

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/answer', methods=['POST', 'GET'])
    def answer():
        def generate():
            # Stream response from OpenAI API
            stream = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": "What is Django in python?"}],
                stream=True,
            )
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield(chunk.choices[0].delta.content)   

        # Return a streaming response
        return Response(generate(), content_type='text/plain', headers={
            "Access-Control-Allow-Origin": "http://localhost:5173"
        })

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='localhost', port=5000, debug=True)
