from flask import request, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import Fixture
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

# Namespace
fixture_ns = Namespace('fixtures', description="A namespace for fixtures")

# Upload config
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Serve uploaded files
@fixture_ns.route('/uploads/<filename>')
class UploadedFileResource(Resource):
    def get(self, filename):
        """Serve uploaded fixture images"""
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            return send_from_directory(UPLOAD_FOLDER, filename)
        return {"message": "File not found"}, 404


# Fixture model for Swagger
fixture_model = fixture_ns.model(
    "Fixture", {
        "id": fields.Integer(),
        "homeTeamImage": fields.String(),
        "homeTeam": fields.String(),
        "awayTeamImage": fields.String(),
        "awayTeam": fields.String(),
        "venue": fields.String(),
        "date": fields.String(),
    }
)


@fixture_ns.route('/')
class FixtureListResource(Resource):
    @fixture_ns.marshal_list_with(fixture_model)
    def get(self):
        """Get all fixtures"""
        return Fixture.query.all()

    @fixture_ns.marshal_with(fixture_model)
    @jwt_required()
    @fixture_ns.doc(security=[])
    def post(self):
        """Create a new fixture with images (JWT required)"""
        if 'homeTeamImage' not in request.files or 'awayTeamImage' not in request.files:
            return {"message": "Both homeTeamImage and awayTeamImage are required"}, 400

        home_team_image = request.files['homeTeamImage']
        away_team_image = request.files['awayTeamImage']

        if not home_team_image or not allowed_file(home_team_image.filename):
            return {"message": "Invalid file for homeTeamImage"}, 400
        if not away_team_image or not allowed_file(away_team_image.filename):
            return {"message": "Invalid file for awayTeamImage"}, 400

        home_team_filename = secure_filename(home_team_image.filename)
        away_team_filename = secure_filename(away_team_image.filename)

        home_team_image.save(os.path.join(UPLOAD_FOLDER, home_team_filename))
        away_team_image.save(os.path.join(UPLOAD_FOLDER, away_team_filename))

        # Get form fields
        homeTeam = request.form.get('homeTeam')
        awayTeam = request.form.get('awayTeam')
        venue = request.form.get('venue')
        date = request.form.get('date')

        new_fixture = Fixture(
            homeTeamImage=f"uploads/{home_team_filename}",
            homeTeam=homeTeam,
            awayTeamImage=f"uploads/{away_team_filename}",
            awayTeam=awayTeam,
            venue=venue,
            date=date
        )
        new_fixture.save()
        return new_fixture, 201


@fixture_ns.route('/<int:id>')
class FixtureResource(Resource):
    @fixture_ns.marshal_with(fixture_model)
    def get(self, id):
        """Get a single fixture by ID"""
        return Fixture.query.get_or_404(id)

    @jwt_required()
    @fixture_ns.doc(security=[])
    def delete(self, id):
        """Delete a fixture by ID (JWT required)"""
        fixture = Fixture.query.get_or_404(id)
        fixture.delete()
        return {"message": "Fixture deleted successfully"}, 200