from flask import Blueprint, jsonify, request
from ..services.ldap_service import get_user_info

user_bp = Blueprint('user', __name__)

@user_bp.route('/', methods=['GET'])
def user_info():
    try:
        user = request.environ.get('REMOTE_USER')
        if user:
            user_info = get_user_info(user.split('\\')[-1])
            if user_info:
                return jsonify(user_info)
            else:
                return jsonify({'message': 'User not found'}), 404
        else:
            return jsonify({'message': 'User not authenticated'}), 401
    except Exception as e:
        return jsonify({'message': 'Internal server error', 'error': str(e)}), 500
