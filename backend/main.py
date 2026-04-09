# main.py
from flask import Flask, jsonify, render_template
from flask_restx import Api
from config import Config
from exts import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from Players import player_ns
from News import news_ns
from Fixtures import fixture_ns
from auth import auth_ns
from AcademyPlayer import academyPlayer_ns
from AcademyNews import academyNews_ns
from results import result_ns
from weekend import weekend_ns

def create_app():
    app = Flask(__name__, template_folder="templates", static_folder="uploads")
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    # --------------------------
    # Register homepage BEFORE Api
    # --------------------------
    @app.route("/")
    def homepage():
        return render_template("index.html")

    @app.route("/api")
    def api_root():
        return jsonify({
            "message": "Welcome to Kisima Football Club API 🚀",
            "version": "1.0",
            "endpoints": [
                "/players", "/news", "/fixtures", "/results",
                "/academy/players", "/academy/news", "/auth", "/weekend"
            ]
        })

    # --------------------------
    # Initialize API AFTER routes
    # --------------------------
    api = Api(app, doc="/docs", title="Kisima FC API", version="1.0")
    app.config['RESTX_VALIDATE'] = True
    app.config['ERROR_404_HELP'] = False

    api.add_namespace(player_ns, path='/players')
    api.add_namespace(news_ns, path='/news')
    api.add_namespace(fixture_ns, path='/fixtures')
    api.add_namespace(auth_ns, path='/auth')
    api.add_namespace(academyPlayer_ns, path='/academy/players')
    api.add_namespace(academyNews_ns, path='/academy/news')
    api.add_namespace(result_ns, path='/results')
    api.add_namespace(weekend_ns, path='/weekend')

    return app

app = create_app()

if __name__ == "__main__":
    import os
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)