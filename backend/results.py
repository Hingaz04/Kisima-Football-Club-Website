from flask import request, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import Results
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

# Namespace
result_ns = Namespace('results', description="A namespace for match results")

# Upload config
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Serve uploaded files
@result_ns.route('/uploads/<filename>')
class UploadedFileResource(Resource):
    def get(self, filename):
        """Serve uploaded images"""
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            return send_from_directory(UPLOAD_FOLDER, filename)
        return {"message": "File not found"}, 404


# Result model for Swagger
result_model = result_ns.model(
    "Result", {
        "id": fields.Integer(),
        "homeTeamImage": fields.String(),
        "homeTeam": fields.String(),
        "awayTeamImage": fields.String(),
        "awayTeam": fields.String(),
        "result": fields.String(),
        "venue": fields.String(),
        "date": fields.String(),
    }
)


@result_ns.route('/')
class ResultListResource(Resource):
    @result_ns.marshal_list_with(result_model)
    def get(self):
        """Get all match results"""
        return Results.query.all()

    @result_ns.marshal_with(result_model)
    @jwt_required()
    @result_ns.doc(security=[])
    def post(self):
        """Create a new match result (JWT required)"""
        if 'homeTeamImage' not in request.files or 'awayTeamImage' not in request.files:
            return {"message": "Both homeTeamImage and awayTeamImage are required"}, 400

        home_team_image = request.files['homeTeamImage']
        away_team_image = request.files['awayTeamImage']
        homeTeam = request.form.get('homeTeam')
        awayTeam = request.form.get('awayTeam')
        result = request.form.get('result')
        venue = request.form.get('venue')
        date = request.form.get('date')

        # Validate and save images
        if home_team_image and allowed_file(home_team_image.filename):
            home_team_filename = secure_filename(home_team_image.filename)
            home_team_image.save(os.path.join(UPLOAD_FOLDER, home_team_filename))
        else:
            return {"message": "Invalid file for homeTeamImage"}, 400

        if away_team_image and allowed_file(away_team_image.filename):
            away_team_filename = secure_filename(away_team_image.filename)
            away_team_image.save(os.path.join(UPLOAD_FOLDER, away_team_filename))
        else:
            return {"message": "Invalid file for awayTeamImage"}, 400

        # Save result
        new_result = Results(
            homeTeamImage=f"uploads/{home_team_filename}",
            homeTeam=homeTeam,
            awayTeamImage=f"uploads/{away_team_filename}",
            awayTeam=awayTeam,
            result=result,
            venue=venue,
            date=date
        )
        new_result.save()
        return new_result, 201


@result_ns.route('/<int:id>')
class ResultResource(Resource):
    @result_ns.marshal_with(result_model)
    def get(self, id):
        """Get a single result by ID"""
        return Results.query.get_or_404(id)

    @jwt_required()
    @result_ns.doc(security=[])
    def delete(self, id):
        """Delete a match result (JWT required)"""
        result = Results.query.get_or_404(id)
        result.delete()
        return {"message": "Result deleted successfully"}, 200