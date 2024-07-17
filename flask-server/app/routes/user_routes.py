from flask import Blueprint, jsonify, request
from ..services.ldap_service import get_user_info
from ..services.ldap_service import get_users

# Responsible for obtaining user information from the Active Directory
# Works together with ldap_service.py to connect to the AD and returns attributes on the current logged in user

# defines blueprint
user_bp = Blueprint('user', __name__)

# route to obtain user attributes of current logged in user
@user_bp.route('/', methods=['GET'])
def user_info():
    try:
        # gets logged in user username
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
    
# returns json of users that are part of a certain group
@user_bp.route('/getgroupusers', methods=['GET'])
def getgroupusers():
    try:
        # group to be searched is passed in as an argument
        group = request.args.get('group')
        if group:
            users = get_users(group)
            if users:
                return jsonify(users)
            else:
                return jsonify({'message': 'No users found'}), 404
        else:
            return jsonify({'message': 'Group parameter required'}), 400
    except Exception as e:
        return jsonify({'message': 'Internal server error', 'error': str(e)}), 500
