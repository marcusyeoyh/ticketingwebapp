from flask import Blueprint, request, jsonify, Response
import sqlite3
import os
import csv
from io import StringIO

# Responsible for all GET requests regarding SLMP Delete requests.
# Connects to SQLite database to return results as JSON payload

# defines blueprint for this file
slmp_delete = Blueprint('slmpDelete', __name__)

# defines absolute address for db
def findDBPath(db_name):
    return os.path.join("databases", db_name)

# returns history for all delete requests 
@slmp_delete.route('/find-all', methods=['GET'])
def find_slmp_delete():
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
            SELECT t1.id AS RequestID, t2.Endorsed, t1.Date, t1.FullName
            FROM SLMPDelete t1
            INNER JOIN SLMPDeleteStatus t2 ON t1.id = t2.id
            WHERE t1.ROID = COALESCE(?,t1.ROID)    
        '''
        
        # executes query on cursor using provided user variable
        cursor.execute(query, (user,))
        # fetches result to variable results
        results = cursor.fetchall()

        # creates list to append results to
        results_list = []
        for row in results:
            # modify db data to more understandable information to be displayed to frontend
            endorsed_status = "Endorsed" if row[1] == 1 else "Pending" if row[1] == 0 else "Rejected"

            # append dictionary to result list
            results_list.append({
                "RequestID": row[0],
                "Endorsed": endorsed_status,
                "Date": row[2],
                "FullName": row[3]
            }) 
        
        # end connection to db
        connection.close()
        # return result as a json list
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

# find all pending delete requests
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
    
# returns all attributes for a particular request, will be parsed and the relevant attributes chosen to be displayed by the front end
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
    
# find all delete requests pending endorsement   
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
    
# return all delete requests that have been rejected at any stage and are pending amendments
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

# facilitates downloading of all delete request information as a csv (only used by admin)
@slmp_delete.route('/downloadCSV', methods=['GET'])
def downloadcsv():
    try:
        db_path = findDBPath("SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
        SELECT *
        FROM SLMPDelete t1
        INNER JOIN SLMPDeleteStatus t2 ON t1.id = t2.id
        INNER JOIN SLMPDeleteEndorse t3 ON t1.id = t3.id
        '''

        cursor.execute(query)
        results = cursor.fetchall()

        si = StringIO()
        cw = csv.writer(si)

        cw.writerow([
            "ROID", "FullName", "DivisionProgram", "Date", "RemovalReason",
            "EndorserID", "SoftwareAssignee", "MachineCATNumber", "MachineName",
            "SoftwareName", "VersionNumber", "SoftwareInvenNumber", "LicenseType",
            "LicensingScheme", "LicenseValidity", "AdditionalInfo", "Remarks",
            "FilePath", "Endorsed", "EndorseFullName", "EndorseDate", "EndorseDivisionProgram",
            "EndorseVerification", "EndorseSupported", "EndorseUninstalled",
            "EndorseTracking", "EndorseAdditionalInfo", "EndorseRemarks",
            "EndorseAttachment"
        ])

        for row in results:
            additionalinfo = "NIL" if not row[16] else row[16]
            remarks = "NIL" if not row[17] else row[17]
            endorsedstatus = "Endorsed" if row[20] == 1 else "Pending" if row[20] == 0 else "Rejected"
            endorseadditionalinfo = "NIL" if not row[29] else row[29]
            endorseremarks = "NIL" if not row[30] else row[30]

            cw.writerow([
                row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10],
                row[11], row[12], row[13], row[14], row[15], additionalinfo, remarks, row[18],
                endorsedstatus, row[22], row[23], row[24], row[25], row[26], row[27], row[28],
                endorseadditionalinfo, endorseremarks, row[31]
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