from flask import Blueprint, request, jsonify, Response
import sqlite3
import os
import csv
from io import StringIO

slmp_install = Blueprint('slmp', __name__)

def findDBPath(db_name):
    return os.path.join("databases", db_name)

@slmp_install.route('/find-all', methods=['GET'])
def find_slmp_install():
    user = request.args.get('user')

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            SELECT t1.id AS RequestID, t2.Approved, t2.Endorsed, t1.Date, t1.FullName
            FROM SLMPInstall t1
            INNER JOIN SLMPInstallStatus t2 ON t1.id = t2.id
            WHERE t1.ROID = COALESCE(?,t1.ROID)    
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
                "Date": row[3],
                "FullName": row[4]
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
            additionalinfo = "NIL" if not row[17] else row[17]
            remarks = "NIL" if not row[18] else row[18]
            endorsedstatus = "Endorsed" if row[22] == 1 else "Pending" if row[22] == 0 else "Rejected"
            approvalstatus = "Approved" if row[21] == 1 else "Pending" if row[21] == 0 else "Rejected"
            endorseadditionalinfo = "NIL" if not row[31] else row[31]
            endorseremarks = "NIL" if not row[32] else row[32]
            approveremarks = "NIL" if not row[37] else row[37]

            results_list.append({
                "ROID": row[1],
                "FullName": row[2],
                "DivisionProgram": row[3],
                "Date": row[4],
                "Outside": row[5],
                "EndorserID": row[6],
                "ApproverID": row[7],
                "SoftwareAssignee": row[8],
                "MachineCATNumber": row[9],
                "MachineName": row[10],
                "SoftwareName": row[11],
                "VersionNumber": row[12],
                "SoftwareInvenNumber": row[13],
                "LicenseType": row[14],
                "LicensingScheme": row[15],
                "LicenseValidity": row[16],
                "AdditionalInfo": additionalinfo,
                "Remarks": remarks,
                "FileLink": row[19],
                "Approved": approvalstatus,
                "Endorsed": endorsedstatus,
                "EndorseFullName": row[24],
                "EndorseDate": row[25],
                "EndorseDivisionProgram": row[26],
                "EndorseVerification": row[27],
                "EndorseSupported": row[28],
                "EndorseTracking": row[29],
                "EndorseBlanketApproval": row[30],
                "EndorseAdditionalInfo": endorseadditionalinfo,
                "EndorseRemarks": endorseremarks,
                "EndorseAttachment": row[33],
                "ApproveFullName": row[35],
                "ApproveDivisionProgram": row[36],
                "ApproveRemarks": approveremarks,
                "ApproveDate": row[38],
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

@slmp_install.route('/downloadCSV', methods=['GET'])
def downloadcsv():    
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
        '''

        cursor.execute(query)
        results = cursor.fetchall()

        si = StringIO()
        cw = csv.writer(si)

        cw.writerow([
            "ROID", "FullName", "DivisionProgram", "Date", "Outside", "EndorserID", "ApproverID",
            "SoftwareAssignee", "MachineCATNumber", "MachineName", "SoftwareName", "VersionNumber",
            "SoftwareInvenNumber", "LicenseType", "LicensingScheme", "LicenseValidity", "AdditionalInfo",
            "Remarks", "FileLink", "Approved", "Endorsed", "EndorseFullName", "EndorseDate", "EndorseDivisionProgram",
            "EndorseVerification", "EndorseSupported", "EndorseTracking", "EndorseBlanketApproval",
            "EndorseAdditionalInfo", "EndorseRemarks", "EndorseAttachment", "ApproveFullName", "ApproveDivisionProgram",
            "ApproveRemarks", "ApproveDate"
        ])

        for row in results:
            additionalinfo = "NIL" if not row[17] else row[17]
            remarks = "NIL" if not row[18] else row[18]
            endorsedstatus = "Endorsed" if row[22] == 1 else "Pending" if row[22] == 0 else "Rejected"
            approvalstatus = "Approved" if row[21] == 1 else "Pending" if row[21] == 0 else "Rejected"
            endorseadditionalinfo = "NIL" if not row[31] else row[31]
            endorseremarks = "NIL" if not row[32] else row[32]
            approveremarks = "NIL" if not row[37] else row[37]

            cw.writerow([
                row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9],
                row[10], row[11], row[12],  row[13], row[14], row[15], row[16], additionalinfo,
                remarks, row[19], approvalstatus, endorsedstatus, row[24], row[25], row[26],
                row[27], row[28], row[29], row[30], endorseadditionalinfo, endorseremarks,
                row[33], row[35], row[36], approveremarks, row[38]
            ])
        connection.close()
        output= si.getvalue()
        return Response(
            output,
            mimetype="text/csv",
            headers={"Content-Disposition": "attachment; filename=slmp_install_data.csv"}
        )
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500