from flask import Blueprint, request, jsonify, send_file
import sqlite3
import os

slmp_transfer = Blueprint('slmpTransfer', __name__)

def findDBPath(db_name):
    return os.path.join("databases", db_name)

@slmp_transfer.route('/find-pending', methods=['GET'])
def findslmptransferpending():
    user = request.args.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400
    

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            SELECT t1.id AS RequestID, t2.Approved, t2.Endorsed, t1.Date
            FROM SLMPTransfer t1
            INNER JOIN SLMPTransferStatus t2 ON t1.id = t2.id
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
    
@slmp_transfer.route('/find-endorsements', methods=['GET'])
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
        FROM SLMPTransfer t1
        INNER JOIN SLMPTransferStatus t2 ON t1.id = t2.id
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
    
@slmp_transfer.route('/find-approvals', methods=['GET'])
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
        FROM SLMPTransfer t1
        INNER JOIN SLMPTransferStatus t2 ON t1.id = t2.id
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
    
@slmp_transfer.route('/full-form', methods=['GET'])
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
        FROM SLMPTransfer t1
        INNER JOIN SLMPTransferStatus t2 ON t1.id = t2.id
        INNER JOIN SLMPTransferEndorse t3 ON t1.id = t3.id
        INNER JOIN SLMPTransferApprove t4 ON t1.id = t4.id
        INNER JOIN SLMPTransferAccept t5 on t1.id = t5.id
        WHERE t1.id = ? 
        '''

        cursor.execute(query, (reqID,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            additionalinfo = "NIL" if not row[19] else row[19]
            remarks = "NIL" if not row[20] else row[20]
            endorsedstatus = "Endorsed" if row[23] == 1 else "Pending" if row[23] == 0 else "Rejected"
            approvalstatus = "Approved" if row[24] == 1 else "Pending" if row[24] == 0 else "Rejected"
            acceptstatus = "Accepted" if row[25] == 1 else "Pending" if row[25] == 0 else "Rejected"
            endorseadditionalinfo = "NIL" if not row[35] else row[35]
            endorseremarks = "NIL" if not row[36] else row[36]
            approveremarks = "NIL" if not row[41] else row[41]

            results_list.append({
                "ROID": row[1],
                "FullName": row[2],
                "DivisionProgram": row[3],
                "Date": row[4],
                "EndorserID": row[5],
                "ApproverID": row[6],
                "CurrentAssignee": row[7],
                "CurrentCATNumber": row[8],
                "CurrentMachineName": row[9],
                "NewAssignee": row[10],
                "NewCATNumber": row[11],
                "NewMachineName": row[12],
                "SoftwareName": row[13],
                "VersionNumber": row[14],
                "SoftwareInvenNumber": row[15],
                "LicenseType": row[16],
                "LicensingScheme": row[17],
                "LicenseValidity": row[18],
                "FileLink": row[21],
                "AdditionalInfo": additionalinfo,
                "Remarks": remarks,
                "Approved": approvalstatus,
                "Endorsed": endorsedstatus,
                "Accepted": acceptstatus,
                "EndorseFullName": row[27],
                "EndorseDate": row[28],
                "EndorseDivisionProgram": row[29],
                "EndorseVerification": row[30],
                "EndorseSupported": row[31],
                "EndorseUninstalled": row[32],
                "EndorseTrackingUpdated": row[33],
                "EndorseVSPUpdated": row[34],
                "EndorseAdditionalInfo": endorseadditionalinfo,
                "EndorseRemarks": endorseremarks,
                "EndorseAttachment": row[37],
                "ApproveFullName": row[39],
                "ApproveDivisionProgram": row[40],
                "ApproveRemarks": approveremarks,
                "ApproveDate": row[42],
                "AcceptFullName": row[44],
                "AcceptDivisionProgram": row[45],
                "AcceptDate": row[46],
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500