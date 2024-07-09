from flask import Blueprint, request, jsonify, send_file
import sqlite3
import os

slmp_delete = Blueprint('slmpDelete', __name__)

def findDBPath(db_name):
    return os.path.join("databases", db_name)

@slmp_delete.route('/find-all', methods=['GET'])
def find_slmp_install():
    user = request.args.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            SELECT t1.id AS RequestID, t2.Endorsed, t1.Date
            FROM SLMPDelete t1
            INNER JOIN SLMPDeleteStatus t2 ON t1.id = t2.id
            WHERE t1.ROID = ?    
        '''
        
        cursor.execute(query, (user,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            endorsed_status = "Endorsed" if row[1] == 1 else "Pending" if row[1] == 0 else "Rejected"

            results_list.append({
                "RequestID": row[0],
                "Endorsed": endorsed_status,
                "Date": row[2]
            }) 
        
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

@slmp_delete.route('/find-pending', methods=['GET'])
def findslmpdeletepending():
    user = request.args.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400
    

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            SELECT t1.id AS RequestID, t2.Endorsed, t1.Date
            FROM SLMPDelete t1
            INNER JOIN SLMPDeleteStatus t2 ON t1.id = t2.id
            WHERE t1.ROID = ? AND t2.Endorsed = 0
        '''
        
        cursor.execute(query, (user,))
        results = cursor.fetchall()

        results_list = []
        for row in results:

            results_list.append({
                "RequestID": row[0],
                "Endorsed": "Pending",
                "Date": row[2]
            }) 
        
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
@slmp_delete.route('/full-form', methods=['GET'])
def fullform():
    reqID = request.args.get('reqID')
    if not reqID:
        return jsonify({'error': 'Request ID is required'}), 400
    
    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
        SELECT *
        FROM SLMPDelete t1
        INNER JOIN SLMPDeleteStatus t2 ON t1.id = t2.id
        INNER JOIN SLMPDeleteEndorse t3 ON t1.id = t3.id
        WHERE t1.id = ? 
        '''

        cursor.execute(query, (reqID,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            additionalinfo = "NIL" if not row[16] else row[16]
            remarks = "NIL" if not row[17] else row[17]
            endorsedstatus = "Endorsed" if row[20] == 1 else "Pending" if row[20] == 0 else "Rejected"
            endorseadditionalinfo = "NIL" if not row[29] else row[29]
            endorseremarks = "NIL" if not row[30] else row[30]

            results_list.append({
                "ROID": row[1],
                "FullName": row[2],
                "DivisionProgram": row[3],
                "Date": row[4],
                "RemovalReason": row[5],
                "EndorserID": row[6],
                "SoftwareAssignee": row[7],
                "MachineCATNumber": row[8],
                "MachineName": row[9],
                "SoftwareName": row[10],
                "VersionNumber": row[11],
                "SoftwareInvenNumber": row[12],
                "LicenseType": row[13],
                "LicensingScheme": row[14],
                "LicenseValidity": row[15],
                "AdditionalInfo": additionalinfo,
                "Remarks": remarks,
                "FilePath": row[18],
                "Endorsed": endorsedstatus,
                "EndorseFullName": row[22],
                "EndorseDate": row[23],
                "EndorseDivisionProgram": row[24],
                "EndorseVerification": row[25],
                "EndorseSupported": row[26],
                "EndorseUninstalled": row[27],
                "EndorseTracking": row[28],
                "EndorseAdditionalInfo": endorseadditionalinfo,
                "EndorseRemarks": endorseremarks,
                "EndorseAttachment": row[31]
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
@slmp_delete.route('/find-endorsements', methods=['GET'])
def findslmpendorsements():
    username = request.args.get('user')
    if not username:
        return jsonify({'error': 'User is required'}), 400
    
    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
        SELECT t1.id AS RequestID, t1.ROID, t1.EndorserID, t1.Date
        FROM SLMPDelete t1
        INNER JOIN SLMPDeleteStatus t2 ON t1.id = t2.id
        WHERE t1.EndorserID = ? AND t2.Endorsed = 0 
        '''

        cursor.execute(query, (username,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            results_list.append({
                "RequestID": row[0],
                "ROID": row[1],
                "EndorserID": row[2],
                "Date": row[3]
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
@slmp_delete.route('/find-rejections', methods=['GET'])
def findslmprejections():
    username = request.args.get('user')
    if not username:
        return jsonify({'error': 'User is required'}), 400
    

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
        SELECT t1.id AS RequestID, t1.ROID, t2.Endorsed, t1.Date
        FROM SLMPDelete t1
        INNER JOIN SLMPDeleteStatus t2 ON t1.id = t2.id
        WHERE t1.ROID = ? AND t2.Endorsed = -1
        '''

        cursor.execute(query, (username,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            
            results_list.append({
                "RequestID": row[0],
                "ROID": row[1],
                "Endorsed": "Rejected",
                "Date": row[3]
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
