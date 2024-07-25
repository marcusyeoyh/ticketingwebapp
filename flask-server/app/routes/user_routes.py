from flask import Blueprint, jsonify, request
from ..services.ldap_service import get_user_info
from ..services.ldap_service import get_users
import sqlite3
import os

# Responsible for obtaining user information from the Active Directory
# Works together with ldap_service.py to connect to the AD and returns attributes on the current logged in user

# defines blueprint
user_bp = Blueprint('user', __name__)

def findDBPath(db_name):
    return os.path.join("databases", db_name)

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
            db_path = findDBPath("Login.db")
            # establish connection variable to db
            connection = sqlite3.connect(db_path)
            # establish connection to db
            cursor = connection.cursor()

            query = '''
            SELECT t1.Username, t1.FullName
            FROM loginData t1
            WHERE t1.Role = ? OR t1.Role = "Administrator"
            '''

            # executes query on cursor using provided user variable
            cursor.execute(query, (group,))
            # fetches result to variable results
            results = cursor.fetchall()
            results_list = []
            for row in results:
                results_list.append({
                    "username": row[0],
                    "fullname": row[1]
                })
            
            connection.close()
            return jsonify(results_list), 200
        else:
            return jsonify({'message': 'Group parameter required'}), 400
    except Exception as e:
        return jsonify({'message': 'Internal server error', 'error': str(e)}), 500
