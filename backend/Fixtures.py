from flask import request
from flask_restx import Resource, Namespace, fields
from models import Fixture
from flask_jwt_extended import jwt_required
import cloudinary.uploader

fixture_ns = Namespace('fixtures', description="Fixtures API")


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
    def post(self):

        # validate files
        if 'homeTeamImage' not in request.files or 'awayTeamImage' not in request.files:
            return {"message": "Both images required"}, 400

        home_img = request.files['homeTeamImage']
        away_img = request.files['awayTeamImage']

        # upload to cloudinary
        home_upload = cloudinary.uploader.upload(home_img)
        away_upload = cloudinary.uploader.upload(away_img)

        home_url = home_upload["secure_url"]
        away_url = away_upload["secure_url"]

        new_fixture = Fixture(
            homeTeamImage=home_url,
            homeTeam=request.form.get("homeTeam"),
            awayTeamImage=away_url,
            awayTeam=request.form.get("awayTeam"),
            venue=request.form.get("venue"),
            date=request.form.get("date"),
        )

        new_fixture.save()

        return {
            "id": new_fixture.id,
            "homeTeamImage": home_url,
            "awayTeamImage": away_url,
            "homeTeam": new_fixture.homeTeam,
            "awayTeam": new_fixture.awayTeam,
            "venue": new_fixture.venue,
            "date": new_fixture.date,
        }, 201


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