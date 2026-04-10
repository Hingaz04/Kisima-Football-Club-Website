from flask import request, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import Fixture
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

fixture_ns = Namespace('fixtures', description="Fixtures API")

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# -------------------------
# GLOBAL IMAGE ROUTE (IMPORTANT FIX)
# -------------------------
from flask import Flask

def register_upload_route(app):
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)


# -------------------------
# MODEL
# -------------------------
fixture_model = fixture_ns.model(
    "Fixture",
    {
        "id": fields.Integer(),
        "homeTeamImage": fields.String(),
        "homeTeam": fields.String(),
        "awayTeamImage": fields.String(),
        "awayTeam": fields.String(),
        "venue": fields.String(),
        "date": fields.String(),
    }
)


# -------------------------
# LIST + CREATE
# -------------------------
@fixture_ns.route('/')
class FixtureListResource(Resource):

    @fixture_ns.marshal_list_with(fixture_model)
    def get(self):
        return Fixture.query.all()

    @jwt_required()
    @fixture_ns.marshal_with(fixture_model)
    def post(self):

        if 'homeTeamImage' not in request.files or 'awayTeamImage' not in request.files:
            return {"message": "Both images required"}, 400

        home_img = request.files['homeTeamImage']
        away_img = request.files['awayTeamImage']

        if not allowed_file(home_img.filename):
            return {"message": "Invalid home image"}, 400

        if not allowed_file(away_img.filename):
            return {"message": "Invalid away image"}, 400

        home_filename = secure_filename(home_img.filename)
        away_filename = secure_filename(away_img.filename)

        home_img.save(os.path.join(UPLOAD_FOLDER, home_filename))
        away_img.save(os.path.join(UPLOAD_FOLDER, away_filename))

        new_fixture = Fixture(
            homeTeamImage=f"uploads/{home_filename}",
            homeTeam=request.form.get("homeTeam"),
            awayTeamImage=f"uploads/{away_filename}",
            awayTeam=request.form.get("awayTeam"),
            venue=request.form.get("venue"),
            date=request.form.get("date"),
        )

        new_fixture.save()
        return new_fixture, 201


# -------------------------
# SINGLE FIXTURE
# -------------------------
@fixture_ns.route('/<int:id>')
class FixtureResource(Resource):

    def get(self, id):
        return Fixture.query.get_or_404(id)

    @jwt_required()
    def delete(self, id):
        fixture = Fixture.query.get_or_404(id)
        fixture.delete()
        return {"message": "Deleted"}, 200