from flask import Blueprint, request, jsonify, send_file
import sqlite3
import os

# Responsible for finding requests given a particular username

utils = Blueprint('utils', __name__)


def findDBPath(db_name):
    return os.path.join("databases", db_name)

@utils.route('/findReq', methods=['GET'])
def findreq():
    user = request.args.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            SELECT t1.id AS RequestID
            FROM SLMPRequests t1
            WHERE t1.ROID = ?    
        '''
        
        cursor.execute(query, (user,))
        results = cursor.fetchall()

        results_list = [row[0] for row in results] 
        
        connection.close()
        return jsonify(results_list), 200

    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500