from flask import Blueprint, request, jsonify, Response
import sqlite3
import os
import csv
from io import StringIO

# Responsible for all GET requests regarding SLMP Transfer requests.
# Connects to SQLite database to return results as JSON payload

# defines blueprint for this file
slmp_transfer = Blueprint('slmpTransfer', __name__)

# defines absolute address for db
def findDBPath(db_name):
    return os.path.join("databases", db_name)

# returns history for all transfer requests 
@slmp_transfer.route('/find-all', methods=['GET'])
def find_slmp_transfer():
    # obtain user parameter from GET request
    user = request.args.get('user')

    try:
        # obtain absolute path for db
        db_path = findDBPath("SLMP.db")
        # establish connection variable to db
        connection = sqlite3.connect(db_path)
        # establish connection to db
        cursor = connection.cursor()

        # SQL query to be sent to db
        query = '''
            SELECT t1.id AS RequestID, t2.Approved, t2.Endorsed, t2.Accepted, t1.Date, t1.FullName
            FROM SLMPTransfer t1
            INNER JOIN SLMPTransferStatus t2 ON t1.id = t2.id
            WHERE t1.ROID = COALESCE(?, t1.ROID)    
        '''
        # executes query on cursor using provided user variable
        cursor.execute(query, (user,))
        # fetches result to variable results
        results = cursor.fetchall()

        # creates list to append results to
        results_list = []
        for row in results:
            # modify db data to more understandable information to be displayed to frontend
            endorsed_status = "Endorsed" if row[2] == 1 else "Pending" if row[2] == 0 else "Rejected"
            approved_status = "Approved" if row[1] == 1 else "Pending" if row[1] == 0 else "Rejected"
            accept_status = "Accepted" if row[3] == 1 else "Pending" if row[3] == 0 else "Rejected"

            # append dictionary to result list
            results_list.append({
                "RequestID": row[0],
                "Endorsed": endorsed_status,
                "Approved": approved_status,
                "Accepted": accept_status,
                "Date": row[4],
                "FullName": row[5]
            }) 
        # end connection to db
        connection.close()
        # return result as a json list
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

# find all pending transfer requests
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
            SELECT t1.id AS RequestID, t2.Approved, t2.Endorsed, t2.Accepted, t1.Date
            FROM SLMPTransfer t1
            INNER JOIN SLMPTransferStatus t2 ON t1.id = t2.id
            WHERE t1.ROID = ? AND (t2.Approved = 0 OR t2.Endorsed = 0 OR t2.Accepted = 0) AND t2.Approved<>-1 AND t2.Endorsed<>-1 AND t2.Accepted<>-1
        '''
        
        cursor.execute(query, (user,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            endorsedStatus = "Endorsed" if row[2] == 1 else "Pending" if row[2] == 0 else "Rejected"
            approvedStatus = "Approved" if row[1] == 1 else "Pending" if row[1] == 0 else "Rejected"
            acceptedStatus = "Accepted" if row[3] == 1 else "Pending" if row[3] == 0 else "Rejected"


            results_list.append({
                "RequestID": row[0],
                "Endorsed": endorsedStatus,
                "Approved": approvedStatus,
                "Accepted": acceptedStatus,
                "Date": row[4]
            }) 
        
        connection.close()
        return jsonify(results_list), 200
    
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

# find all transfer requests pending endorsement   
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
        SELECT t1.id AS RequestID, t1.ROID, t1.EndorserID, t1.ApproverID, t1.Date, t1.NewAssignee
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
                "Date": row[4],
                "NewAssignee": row[5]
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

# find all transfer requests pending approval
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
        SELECT t1.id AS RequestID, t1.ROID, t1.EndorserID, t1.ApproverID, t1.Date, t1.NewAssignee
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
                "Date": row[4],
                "NewAssignee": row[5]
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

# returns all attributes for a particular request, will be parsed and the relevant attributes chosen to be displayed by the front end   
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
                "AcceptRemarks": row[47],
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

# return all transfer requests that have been rejected at any stage and are pending amendments
@slmp_transfer.route('/find-rejections', methods=['GET'])
def findslmprejections():
    username = request.args.get('user')
    if not username:
        return jsonify({'error': 'User is required'}), 400
    

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
        SELECT t1.id AS RequestID, t1.ROID, t2.Endorsed, t2.Approved, t2.Accepted, t1.Date
        FROM SLMPTransfer t1
        INNER JOIN SLMPTransferStatus t2 ON t1.id = t2.id
        WHERE t1.ROID = ? AND (t2.Approved = -1 OR t2.Endorsed = -1 OR t2.Accepted = -1)
        '''

        cursor.execute(query, (username,))
        results = cursor.fetchall()

        results_list = []
        for row in results:
            endorsestatus = "Endorsed" if row[2] == 1 else "Rejected"
            approvestatus = "Approved" if row[3] == 1 else "NIL" if endorsestatus == "Rejected" else "Rejected"
            acceptstatus = "Rejected" if row[4] == -1 else "NIL"
            results_list.append({
                "RequestID": row[0],
                "ROID": row[1],
                "Endorsed": endorsestatus,
                "Approved": approvestatus,
                "Accepted": acceptstatus,
                "Date": row[5]
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
# find the request ids of requests raised by the provided ROID
@slmp_transfer.route('/find-reqid', methods=['GET'])
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
            FROM SLMPTransfer t1
            WHERE t1.ROID = ?    
        '''
        
        cursor.execute(query, (user,))
        results = cursor.fetchall()

        results_list = [row[0] for row in results] 
        
        connection.close()
        return jsonify(results_list), 200
    
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
# find the requests that are pending the user's acceptance
@slmp_transfer.route('/find-accept', methods=['GET'])
def findslmpaccept():
    username = request.args.get('user')
    if not username:
        return jsonify({'error': 'User is required'}), 400
    

    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
        SELECT t1.id AS RequestID, t1.ROID, t1.EndorserID, t1.ApproverID, t1.NewAssignee, t1.Date
        FROM SLMPTransfer t1
        INNER JOIN SLMPTransferStatus t2 ON t1.id = t2.id
        WHERE t1.NewAssignee = ? AND t2.Approved = 1 AND t2.Endorsed = 1 AND t2.Accepted = 0
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
                "NewAssignee": row[4],
                "Date": row[5]
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

# find request ids that have the user as a new assignee
@slmp_transfer.route('/find-newAssignee', methods=['GET'])
def findnewassignee():
    user = request.args.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400
    
    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            SELECT t1.id AS RequestID
            FROM SLMPTransfer t1
            WHERE t1.NewAssignee = ?    
        '''
        
        cursor.execute(query, (user,))
        results = cursor.fetchall()

        results_list = [row[0] for row in results] 
        
        connection.close()
        return jsonify(results_list), 200
    
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
# facilitates downloading of all transfer request information as a csv (only used by admin)
@slmp_transfer.route('/downloadCSV', methods=['GET'])
def downloadcsv():
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
        '''

        cursor.execute(query)
        results = cursor.fetchall()

        si = StringIO()
        cw = csv.writer(si)

        cw.writerow([
            "ROID", "FullName", "DivisionProgram", "Date", "EndorserID", "ApproverID", "CurrentAssignee",
            "CurrentCATNumber", "CurrentMachineName", "NewAssignee", "NewCATNumber", "NewMachineName",
            "SoftwareName", "VersionNumber", "SoftwareInvenNumber", "LicenseType", "LicensingScheme",
            "LicenseValidity", "FileLink", "AdditionalInfo", "Remarks", "Approved", "Endorsed", 
            "Accepted", "EndorseFullName", "EndorseDate", "EndorseDivisionProgram", "EndorseVerification",
            "EndorseSupported", "EndorseUninstalled", "EndorseTrackingUpdated", "EndorseVSPUpdated",
            "EndorseAdditionalInfo", "EndorseRemarks", "EndorseAttachment", "ApproveFullName",
            "ApproveDivisionProgram", "ApproveRemarks", "ApproveDate", "AcceptFullName", 
            "AcceptDivisionProgram", "AcceptDate", "AcceptRemarks"
        ])

        for row in results:
            additionalinfo = "NIL" if not row[19] else row[19]
            remarks = "NIL" if not row[20] else row[20]
            endorsedstatus = "Endorsed" if row[23] == 1 else "Pending" if row[23] == 0 else "Rejected"
            approvalstatus = "Approved" if row[24] == 1 else "Pending" if row[24] == 0 else "Rejected"
            acceptstatus = "Accepted" if row[25] == 1 else "Pending" if row[25] == 0 else "Rejected"
            endorseadditionalinfo = "NIL" if not row[35] else row[35]
            endorseremarks = "NIL" if not row[36] else row[36]
            approveremarks = "NIL" if not row[41] else row[41]

            cw.writerow([
                row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9],
                row[10], row[11], row[12], row[13], row[14], row[15], row[16], row[17],
                row[18], row[21], additionalinfo, remarks, approvalstatus, endorsedstatus,
                acceptstatus, row[27], row[28], row[29], row[30], row[31], row[32], row[33],
                row[34], endorseadditionalinfo, endorseremarks, row[37], row[39], row[40],
                approveremarks, row[42], row[44], row[45], row[46], row[47]
            ])
        connection.close()
        output= si.getvalue()
        return Response(
            output,
            mimetype="text/csv",
            headers={"Content-Disposition": "attachment; filename=slmp_transfer_data.csv"}
        )
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500