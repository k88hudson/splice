from flask import Blueprint, request, jsonify
from splice.web.api import build_response
from splice.environment import Environment
from splice.queries import get_distributions
from splice.ingest import IngestError, ingest_links, deploy, payload_schema as schema
from jsonschema.exceptions import ValidationError
import json

authoring = Blueprint('api.authoring', __name__, url_prefix='/api/authoring')
env = Environment.instance()

@authoring.route('/all_tiles', methods=['POST'])
def all_tiles():

    try:
        data = request.get_json(force=True)
        new_data = ingest_links(data)
        urls = deploy(new_data)
    except ValidationError, e:
        errors = []
        error = {"path": e.path[0], "msg": e.message}
        errors.append(error)
        return jsonify({"err": errors}), 400
    except IngestError, e:
        return jsonify({"err": [{"msg": e.message}]}), 400
    except Exception, e:
        import traceback
        print traceback.print_exc()
        return jsonify({"err": [{"msg": e.message}]}), 500

    return jsonify({"urls": urls}), 200

@authoring.route('/payload_schema', methods=['GET'])
def payload_schema():
    return jsonify(schema), 200

@authoring.route('/distributions', methods=['GET'])
def distributions():

    limit = request.args.get('limit', 100)
    dists = get_distributions(limit=limit)

    return jsonify({"d": dists})

def register_routes(app):
    app.register_blueprint(authoring)
