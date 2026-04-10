from flask import request, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import Results
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

result_ns = Namespace('results', description="Match results")

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# --------------------------
# GLOBAL IMAGE SERVING (FIXED)
# --------------------------
from flask import current_app

def register_upload_route(app):
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)


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

    @result_ns.marshal_with(result_model)
    @jwt_required()
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

        new_result = Results(
            homeTeamImage=f"uploads/{home_filename}",
            awayTeamImage=f"uploads/{away_filename}",
            homeTeam=request.form.get('homeTeam'),
            awayTeam=request.form.get('awayTeam'),
            result=request.form.get('result'),
            venue=request.form.get('venue'),
            date=request.form.get('date'),
        )

        new_result.save()
        return new_result, 201


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