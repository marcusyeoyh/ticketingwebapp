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
    
@utils.route('/login', methods=['POST'])
def userlogin():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    try:
        db_path = findDBPath("Login.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            SELECT t1.Username, t1.FullName, t1.DivisionProgram, t1.Email, t1.Role
            FROM loginData t1
            WHERE t1.Username = ? AND t1.Password = ?    
        '''
        
        cursor.execute(query, (username, password))
        results = cursor.fetchall()

        results_list = []
        if len(results) == 0:
            connection.close()
            return jsonify({"message": "Invalid username or password"}), 401
        
        for row in results:
            results_list.append({
                "username": row[0],
                "fullname": row[1],
                "divisionprogram": row[2],
                "email": row[3],
                "role": row[4]}
            )

        connection.close()
        return jsonify(results_list), 200

    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500