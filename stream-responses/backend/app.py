# create a flask app
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()


def create_app():
    app = Flask(__name__)
    api_key = os.getenv('API_KEY')
    client = OpenAI(api_key=api_key)
    app.config['API_KEY'] = api_key

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/answer', methods=['POST', 'GET'])
    def answer():
        def generate():
            stream = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": "You are a helpful assistant."}],
                stream=True,
            )
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield(chunk.choices[0].delta.content)

        return generate(), {'Content-Type': 'text/plain'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)