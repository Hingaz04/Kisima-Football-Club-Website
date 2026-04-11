from flask import request, make_response
from flask_restx import Resource, Namespace, fields
from models import AcademyNews
from flask_jwt_extended import jwt_required
import cloudinary.uploader

academyNews_ns = Namespace(
    'academy/news',
    description="Academy News Namespace"
)


# --------------------------
# MODEL
# --------------------------
academyNews_model = academyNews_ns.model(
    "AcademyNews",
    {
        "id": fields.Integer(),
        "title": fields.String(),
        "description": fields.String(),
        "image": fields.String(),
        "date": fields.String(),
    },
)


# --------------------------
# LIST + CREATE
# --------------------------
@academyNews_ns.route("/")
class AcademyNewsList(Resource):

    def options(self):
        return make_response("", 200)

    @academyNews_ns.marshal_list_with(academyNews_model)
    def get(self):
        return AcademyNews.query.all()

    @jwt_required()
    def post(self):

        if "image" not in request.files:
            return {"message": "Image required"}, 400

        image_file = request.files["image"]

        # 🚀 Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(image_file)
        image_url = upload_result["secure_url"]

        title = request.form.get("title")
        description = request.form.get("description")
        date = request.form.get("date")

        if not title or not description or not date:
            return {"message": "Missing fields"}, 400

        news = AcademyNews(
            title=title,
            description=description,
            image=image_url,
            date=date,
        )

        news.save()

        return {
            "id": news.id,
            "title": news.title,
            "description": news.description,
            "image": image_url,
            "date": news.date,
        }, 201


# --------------------------
# SINGLE + DELETE
# --------------------------
@academyNews_ns.route("/<int:id>")
class AcademyNewsResource(Resource):

    def get(self, id):
        return AcademyNews.query.get_or_404(id)

    @jwt_required()
    def delete(self, id):
        item = AcademyNews.query.get_or_404(id)
        item.delete()
        return {"message": "Deleted"}, 200