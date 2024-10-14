from flask import Flask, request, jsonify
from flask_restx import Resource, Namespace, fields
from models import Player
from flask_jwt_extended import jwt_required


player_ns = Namespace('player', description="A namespace fpr our players")

# models seriallizer
player_model = player_ns.model(
    "Player", {
        "id": fields.Integer(),
        "name": fields.String(),
        "position": fields.String()
    }
)


@player_ns.route('/players')
class RecipeResource(Resource):
    @player_ns.marshal_list_with(player_model)
    def get(self):
        players = Player.query.all()
        return players

    @player_ns.marshal_with(player_model)
    @player_ns.expect(player_model)
    @jwt_required()
    def post(self):
        data = request.get_json()

        new_player = Player(
            name=data.get("name"),
            position=data.get("position")
        )

        new_player.save()

        return new_player, 201


@player_ns.route('/player/<int:id>')
class RecipeResource(Resource):
    @player_ns.marshal_with(player_model)
    def get(self, id):
        player = Player.query.get_or_404(id)

        return player

    @player_ns.marshal_with(player_model)
    @jwt_required()
    def delete(self, id):
        print(f"Received DELETE request for ID: {id}")
        player_to_delete = Player.query.get_or_404(id)
        player_to_delete.delete()
        return {"message": "Player deleted successfully"}, 200
