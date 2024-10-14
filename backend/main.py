from flask import Flask
from flask_restx import Api
from config import DevConfig
from models import User, News, Fixture, Player, AcademyPlayers, AcademyNews, Results, Weekend
from exts import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from Players import player_ns
from News import news_ns
from Fixtures import fixture_ns
from auth import auth_ns
from AcademyPlayer import academyPlayer_ns
from AcademyNews import academyNews_ns
from results import result_ns
from weekend import weekend_ns
from flask_cors import CORS


def create_app(config=DevConfig):
    app = Flask(__name__)
    app.config.from_object(config)
    CORS(app)
    db.init_app(app)

    migrate = Migrate(app, db)

    JWTManager(app)

    api = Api(app, doc='/docs')

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
        return {
            "db": db,
            "News": News,
            "User": User,
            "Player": Player,
            "Fixture": Fixture,
            "Academy Players": AcademyPlayers,
            "Academy News": AcademyNews,
            "Results": Results,
            "Weekend": Weekend
        }

    return app


if __name__ == "__main__":
    app = create_app(DevConfig)
    app.run()
