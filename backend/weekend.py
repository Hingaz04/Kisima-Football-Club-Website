from flask import request
from flask_restx import Resource, Namespace, fields
from models import Weekend
from flask_jwt_extended import jwt_required
import cloudinary.uploader

weekend_ns = Namespace('weekend', description="Weekend events")


weekend_model = weekend_ns.model(
    "Weekend",
    {
        "id": fields.Integer(),
        "weekendImages": fields.String(),
        "date": fields.String(),
    }
)


@weekend_ns.route('/')
class WeekendListResource(Resource):

    @weekend_ns.marshal_list_with(weekend_model)
    def get(self):
        return Weekend.query.all()

    @jwt_required()
    def post(self):

        if 'image' not in request.files:
            return {"message": "Image required"}, 400

        image = request.files['image']
        date = request.form.get('date')

        # 🚀 Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(image)

        image_url = upload_result["secure_url"]

        new_weekend = Weekend(
            weekendImages=image_url,
            date=date
        )

        new_weekend.save()

        return {
            "id": new_weekend.id,
            "weekendImages": image_url,
            "date": date
        }, 201


@weekend_ns.route('/<int:id>')
class WeekendResource(Resource):

    def get(self, id):
        return Weekend.query.get_or_404(id)

    @jwt_required()
    def delete(self, id):
        item = Weekend.query.get_or_404(id)
        item.delete()
        return {"message": "Deleted"}, 200