from flask import Flask, request, jsonify
from flask_restx import Resource, Namespace, fields
from models import AcademyPlayers
from flask_jwt_extended import jwt_required


academyPlayer_ns = Namespace(
    'academy-player', description="A namespace fpr our academy players")

# models seriallizer
academyPlayer_model = academyPlayer_ns.model(
    "Player", {
        "id": fields.Integer(),
        "name": fields.String(),
        "position": fields.String()
    }
)


@academyPlayer_ns.route('/academy-players')
class RecipeResource(Resource):
    @academyPlayer_ns.marshal_list_with(academyPlayer_model)
    def get(self):
        players = AcademyPlayers.query.all()
        return players

    @academyPlayer_ns.marshal_with(academyPlayer_model)
    @academyPlayer_ns.expect(academyPlayer_model)
    @jwt_required()
    def post(self):
        data = request.get_json()

        new_academy_player = AcademyPlayers(
            name=data.get("name"),
            position=data.get("position")
        )

        new_academy_player.save()

        return new_academy_player, 201


@academyPlayer_ns.route('/academy-player/<int:id>')
class RecipeResource(Resource):
    @academyPlayer_ns.marshal_with(academyPlayer_ns)
    def get(self, id):
        player = AcademyPlayers.query.get_or_404(id)

        return player

    @academyPlayer_ns.marshal_with(academyPlayer_model)
    @jwt_required()
    def delete(self, id):
        print(f"Received DELETE request for ID: {id}")
        player_to_delete = AcademyPlayers.query.get_or_404(id)
        player_to_delete.delete()
        return {"message": "Player deleted successfully"}, 200
