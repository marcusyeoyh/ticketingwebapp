from flask import Blueprint, request, jsonify, send_file
import sqlite3
import os

slmp_install = Blueprint('slmp', __name__)

def findDBPath(db_name):
    return os.path.join("databases", db_name)

@slmp_install.route('/find-all', methods=['GET'])
def find_slmp_install():
    user = request.args.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            SELECT t1.id AS RequestID, t2.Approved, t2.Endorsed, t1.Date
            FROM SLMPInstall t1
            INNER JOIN SLMPInstallStatus t2 ON t1.id = t2.id
            WHERE t1.ROID = ?    
        '''
        
        cursor.execute(query, (user,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            endorsed_status = "Endorsed" if row[2] == 1 else "Pending" if row[2] == 0 else "Rejected"
            approved_status = "Approved" if row[1] == 1 else "Pending" if row[1] == 0 else "Rejected"

            results_list.append({
                "RequestID": row[0],
                "Endorsed": endorsed_status,
                "Approved": approved_status,
                "Date": row[3]
            }) 
        
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

@slmp_install.route('/find-approvals', methods=['GET'])
def findslmpapprovals():
    username = request.args.get('user')
    if not username:
        return jsonify({'error': 'User is required'}), 400
    

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
        SELECT t1.id AS RequestID, t1.ROID, t1.EndorserID, t1.ApproverID, t1.Date
        FROM SLMPInstall t1
        INNER JOIN SLMPInstallStatus t2 ON t1.id = t2.id
        WHERE t1.ApproverID = ? AND t2.Approved = 0 AND t2.Endorsed = 1
        '''

        cursor.execute(query, (username,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            results_list.append({
                "RequestID": row[0],
                "ROID": row[1],
                "EndorserID": row[2],
                "ApproverID": row[3],
                "Date": row[4]
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

@slmp_install.route('/find-rejections', methods=['GET'])
def findslmprejections():
    username = request.args.get('user')
    if not username:
        return jsonify({'error': 'User is required'}), 400
    

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
        SELECT t1.id AS RequestID, t1.ROID, t2.Endorsed, t2.Approved, t1.Date
        FROM SLMPInstall t1
        INNER JOIN SLMPInstallStatus t2 ON t1.id = t2.id
        WHERE t1.ROID = ? AND (t2.Approved = -1 OR t2.Endorsed = -1)
        '''

        cursor.execute(query, (username,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            endorsestatus = "Endorsed" if row[2] == 1 else "Rejected"
            approvestatus = "NIL" if endorsestatus == "Rejected" else "Rejected"
            results_list.append({
                "RequestID": row[0],
                "ROID": row[1],
                "Endorsed": endorsestatus,
                "Approved": approvestatus,
                "Date": row[4]
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

@slmp_install.route('/find-pending', methods=['GET'])
def findslmpinstallpending():
    user = request.args.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400
    

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            SELECT t1.id AS RequestID, t2.Approved, t2.Endorsed, t1.Date
            FROM SLMPInstall t1
            INNER JOIN SLMPInstallStatus t2 ON t1.id = t2.id
            WHERE t1.ROID = ? AND (t2.Approved = 0 OR t2.Endorsed = 0) AND t2.Approved<>-1 AND t2.Endorsed<>-1
        '''
        
        cursor.execute(query, (user,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            endorsedStatus = "Approved" if row[2] == 1 else "Pending" if row[2] == 0 else "Rejected"
            approvedStatus = "Approved" if row[1] == 1 else "Pending" if row[1] == 0 else "Rejected"

            results_list.append({
                "RequestID": row[0],
                "Endorsed": endorsedStatus,
                "Approved": approvedStatus,
                "Date": row[3]
            }) 
        
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
@slmp_install.route('/find-endorsements', methods=['GET'])
def findslmpendorsements():
    username = request.args.get('user')
    if not username:
        return jsonify({'error': 'User is required'}), 400
    
    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
        SELECT t1.id AS RequestID, t1.ROID, t1.EndorserID, t1.ApproverID, t1.Date
        FROM SLMPInstall t1
        INNER JOIN SLMPInstallStatus t2 ON t1.id = t2.id
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
                "ApproverID": row[3],
                "Date": row[4]
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

@slmp_install.route('/full-form', methods=['GET'])
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
        FROM SLMPInstall t1
        INNER JOIN SLMPInstallStatus t2 ON t1.id = t2.id
        INNER JOIN SLMPInstallEndorse t3 ON t1.id = t3.id
        INNER JOIN SLMPInstallApprove t4 ON t1.id = t4.id
        WHERE t1.id = ? 
        '''

        cursor.execute(query, (reqID,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            additionalinfo = "NIL" if not row[16] else row[16]
            remarks = "NIL" if not row[17] else row[17]
            endorsedstatus = "Endorsed" if row[21] == 1 else "Pending" if row[21] == 0 else "Rejected"
            approvalstatus = "Approved" if row[20] == 1 else "Pending" if row[20] == 0 else "Rejected"
            endorseadditionalinfo = "NIL" if not row[30] else row[30]
            endorseremarks = "NIL" if not row[31] else row[31]
            approveremarks = "NIL" if not row[36] else row[36]

            results_list.append({
                "ROID": row[1],
                "DivisionProgram": row[2],
                "Date": row[3],
                "Outside": row[4],
                "EndorserID": row[5],
                "ApproverID": row[6],
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
                "FileLink": row[18],
                "Approved": approvalstatus,
                "Endorsed": endorsedstatus,
                "EndorseFullName": row[23],
                "EndorseDate": row[24],
                "EndorseDivisionProgram": row[25],
                "EndorseVerification": row[26],
                "EndorseSupported": row[27],
                "EndorseTracking": row[28],
                "EndorseBlanketApproval": row[29],
                "EndorseAdditionalInfo": endorseadditionalinfo,
                "EndorseRemarks": endorseremarks,
                "EndorseAttachment": row[32],
                "ApproveFullName": row[34],
                "ApproveDivisionProgram": row[35],
                "ApproveRemarks": approveremarks,
                "ApproveDate": row[37],
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
@slmp_install.route('/find-reqid', methods=['GET'])
def findreqid():
    user = request.args.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400
    
    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            SELECT t1.id AS RequestID
            FROM SLMPInstall t1
            WHERE t1.ROID = ?    
        '''
        
        cursor.execute(query, (user,))
        results = cursor.fetchall()

        results_list = [row[0] for row in results] 
        
        connection.close()
        return jsonify(results_list), 200
    
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500