from flask import request, send_from_directory, make_response
from flask_restx import Resource, Namespace, fields
from models import News
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

# Namespace
news_ns = Namespace('news', description="A namespace for news articles")

# Upload config
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Serve uploaded images
@news_ns.route('/uploads/<filename>')
class UploadedFileResource(Resource):
    def get(self, filename):
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        if os.path.exists(filepath):
            return send_from_directory(UPLOAD_FOLDER, filename)

        return {"message": "File not found"}, 404


# News model for Swagger
news_model = news_ns.model(
    "News",
    {
        "id": fields.Integer(),
        "title": fields.String(),
        "description": fields.String(),
        "image": fields.String(),
        "date": fields.String(),
    }
)


@news_ns.route('/')
class NewsListResource(Resource):

    # ✅ FIX: Handle preflight requests (CORS)
    def options(self):
        return make_response("", 200)

    # GET all news
    @news_ns.marshal_list_with(news_model)
    def get(self):
        return News.query.all()

    # CREATE news (JWT protected)
    @jwt_required()
    def post(self):

        # Validate image
        if 'image' not in request.files:
            return {"message": "Image file is required"}, 400

        image_file = request.files['image']

        if image_file.filename == '':
            return {"message": "No selected file"}, 400

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            image_file.save(filepath)

            image_url = f"/news/uploads/{filename}"
        else:
            return {"message": "Invalid image file type"}, 400

        # Form data
        title = request.form.get('title')
        description = request.form.get('description')
        date = request.form.get('date')

        if not title or not description or not date:
            return {"message": "Title, description, and date are required"}, 400

        # Save to DB
        new_news = News(
            title=title,
            description=description,
            image=image_url,
            date=date
        )

        new_news.save()

        return {
            "message": "News created successfully",
            "data": new_news.id
        }, 201


@news_ns.route('/<int:id>')
class NewsResource(Resource):

    @news_ns.marshal_with(news_model)
    def get(self, id):
        return News.query.get_or_404(id)

    @jwt_required()
    def delete(self, id):
        news_item = News.query.get_or_404(id)
        news_item.delete()

        return {"message": "News deleted successfully"}, 200