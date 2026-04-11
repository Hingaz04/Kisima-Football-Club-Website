from flask import request
from flask_restx import Resource, Namespace, fields
from models import Results
from flask_jwt_extended import jwt_required
import cloudinary.uploader

result_ns = Namespace('results', description="Match results")


# --------------------------
# MODEL
# --------------------------
result_model = result_ns.model(
    "Result",
    {
        "id": fields.Integer(),
        "homeTeamImage": fields.String(),
        "homeTeam": fields.String(),
        "awayTeamImage": fields.String(),
        "awayTeam": fields.String(),
        "result": fields.String(),
        "venue": fields.String(),
        "date": fields.String(),
    },
)


# --------------------------
# RESULTS LIST
# --------------------------
@result_ns.route('/')
class ResultListResource(Resource):

    @result_ns.marshal_list_with(result_model)
    def get(self):
        return Results.query.all()

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

        new_result = Results(
            homeTeamImage=home_url,
            awayTeamImage=away_url,
            homeTeam=request.form.get('homeTeam'),
            awayTeam=request.form.get('awayTeam'),
            result=request.form.get('result'),
            venue=request.form.get('venue'),
            date=request.form.get('date'),
        )

        new_result.save()

        return {
            "id": new_result.id,
            "homeTeamImage": home_url,
            "awayTeamImage": away_url,
            "homeTeam": new_result.homeTeam,
            "awayTeam": new_result.awayTeam,
            "result": new_result.result,
            "venue": new_result.venue,
            "date": new_result.date,
        }, 201


# --------------------------
# SINGLE RESULT
# --------------------------
@result_ns.route('/<int:id>')
class ResultResource(Resource):

    def get(self, id):
        return Results.query.get_or_404(id)

    @jwt_required()
    def delete(self, id):
        result = Results.query.get_or_404(id)
        result.delete()
        return {"message": "Deleted"}, 200