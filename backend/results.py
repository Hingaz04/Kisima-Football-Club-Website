from flask import Flask, request, jsonify, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import Results
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

# Namespace for Fixture
result_ns = Namespace('result', description="A namespace for our results")

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Serve static files (images) from the uploads folder


@result_ns.route('/uploads/<filename>')
class UploadedFileResource(Resource):
    def get(self, filename):
        """Serve uploaded files"""
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            return send_from_directory(UPLOAD_FOLDER, filename)
        else:
            return {"message": "File not found"}, 404

# Function to check allowed file extensions


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Fixture model serializer
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


@result_ns.route('/results')
class FixtureResource(Resource):
    @result_ns.marshal_list_with(result_model)
    def get(self):
        """Get all fixtures"""
        fixtures = Results.query.all()
        return fixtures

    @result_ns.marshal_with(result_model)
    @jwt_required()
    def post(self):
        """Create a new fixture with image uploads and team names"""

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
            home_team_image_path = os.path.join(
                UPLOAD_FOLDER, home_team_filename)
            home_team_image.save(home_team_image_path)
        else:
            return {"message": "Invalid file for homeTeamImage"}, 400

        if away_team_image and allowed_file(away_team_image.filename):
            away_team_filename = secure_filename(away_team_image.filename)
            away_team_image_path = os.path.join(
                UPLOAD_FOLDER, away_team_filename)
            away_team_image.save(away_team_image_path)
        else:
            return {"message": "Invalid file for awayTeamImage"}, 400

        # Save fixture data with relative image paths and team names
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


@result_ns.route('/result/<int:id>')
class FixtureDetailResource(Resource):
    @result_ns.marshal_with(result_model)
    def get(self, id):
        """Get a single fixture by ID"""
        result = Results.query.get_or_404(id)
        return result

    @result_ns.marshal_with(result_model)
    @jwt_required()
    def delete(self, id):
        """Delete a fixture by ID"""
        fixture_to_delete = Results.query.get_or_404(id)
        fixture_to_delete.delete()
        return {"message": "Fixture deleted successfully"}, 200
