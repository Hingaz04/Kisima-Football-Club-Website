# backend/main.py
from flask import Flask
from flask_restx import Api
from config import Config
from exts import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Import your namespaces here (example)
from Players import player_ns
from News import news_ns
from Fixtures import fixture_ns
from auth import auth_ns
from AcademyPlayer import academyPlayer_ns
from AcademyNews import academyNews_ns
from results import result_ns
from weekend import weekend_ns

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    api = Api(app, doc="/docs")

    # Register namespaces
    api.add_namespace(fixture_ns)
    api.add_namespace(auth_ns)
    api.add_namespace(player_ns)
    api.add_namespace(news_ns)
    api.add_namespace(academyPlayer_ns)
    api.add_namespace(academyNews_ns)
    api.add_namespace(result_ns)
    api.add_namespace(weekend_ns)

    @app.shell_context_processor
    def make_shell_context():
        return {"db": db}

    return app

# This is what Gunicorn needs:
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))