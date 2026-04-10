from flask import request
from flask_restx import Resource, Namespace, fields
from models import AcademyPlayers
from flask_jwt_extended import jwt_required

academyPlayer_ns = Namespace(
    'academy/players',
    description="Academy Players Namespace"
)

academyPlayer_model = academyPlayer_ns.model(
    "AcademyPlayer",
    {
        "id": fields.Integer(),
        "name": fields.String(),
        "position": fields.String()
    }
)

# ================= LIST + CREATE =================
@academyPlayer_ns.route('/')
class AcademyPlayerList(Resource):

    @academyPlayer_ns.marshal_list_with(academyPlayer_model)
    def get(self):
        return AcademyPlayers.query.all()

    @academyPlayer_ns.marshal_with(academyPlayer_model)
    @academyPlayer_ns.expect(academyPlayer_model)
    @jwt_required()
    def post(self):
        data = request.get_json()

        player = AcademyPlayers(
            name=data.get("name"),
            position=data.get("position")
        )

        player.save()
        return player, 201


# ================= SINGLE + DELETE =================
@academyPlayer_ns.route('/<int:id>')
class AcademyPlayerResource(Resource):

    @academyPlayer_ns.marshal_with(academyPlayer_model)
    def get(self, id):
        return AcademyPlayers.query.get_or_404(id)

    @jwt_required()
    def delete(self, id):
        player = AcademyPlayers.query.get_or_404(id)
        player.delete()
        return {"message": "Deleted"}, 200