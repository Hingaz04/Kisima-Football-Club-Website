from flask import request, make_response
from flask_restx import Resource, Namespace, fields
from models import News
from flask_jwt_extended import jwt_required
import cloudinary.uploader

news_ns = Namespace('news', description="A namespace for news articles")


# --------------------------
# NEWS MODEL
# --------------------------
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


# --------------------------
# NEWS LIST
# --------------------------
@news_ns.route('/')
class NewsListResource(Resource):

    def options(self):
        return make_response("", 200)

    @news_ns.marshal_list_with(news_model)
    def get(self):
        return News.query.all()

    @jwt_required()
    def post(self):

        # validate image
        if 'image' not in request.files:
            return {"message": "Image file is required"}, 400

        image_file = request.files['image']

        if image_file.filename == '':
            return {"message": "No selected file"}, 400

        # 🚀 UPLOAD TO CLOUDINARY
        upload_result = cloudinary.uploader.upload(image_file)
        image_url = upload_result["secure_url"]

        # form data
        title = request.form.get('title')
        description = request.form.get('description')
        date = request.form.get('date')

        if not title or not description or not date:
            return {"message": "Title, description, and date are required"}, 400

        # save to DB
        new_news = News(
            title=title,
            description=description,
            image=image_url,
            date=date
        )

        new_news.save()

        return {
            "message": "News created successfully",
            "data": new_news.id,
            "image": image_url
        }, 201


# --------------------------
# SINGLE NEWS
# --------------------------
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