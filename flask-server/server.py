from flask import Flask, jsonify, request, send_file
from flask_cors import CORS, cross_origin
import sqlite3
import os
from ldap3 import Server, Connection, ALL, NTLM
import time

curDirectory = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

UPLOAD_FOLDER_USER = 'uploads/request-uploads/'
os.makedirs(UPLOAD_FOLDER_USER, exist_ok=True)
app.config['UPLOAD_FOLDER_USER'] = UPLOAD_FOLDER_USER

UPLOAD_FOLDER_ENDORSER = 'uploads/endorse-uploads/'
os.makedirs(UPLOAD_FOLDER_ENDORSER, exist_ok=True)
app.config['UPLOAD_FOLDER_ENDORSER'] = UPLOAD_FOLDER_ENDORSER

def findDBPath(dbName):
    result = os.path.join(curDirectory, "databases", dbName)
    return result

LDAP_SERVER = 'ldap://168.10.10.1'
LDAP_USER = 'SDC\\ldapuser'
LDAP_PASSWORD = 'Qwerty123'

@app.route('/api/user', methods=['GET']) 
def user_info():
    try:
        user = request.environ.get('REMOTE_USER')
        app.logger.debug(f"REMOTE_USER: {user}")
        if user:
            username = user.split('\\')[-1]  # Extract username from DOMAIN\username
            server = Server(LDAP_SERVER, get_info=ALL)
            conn = Connection(server, user=LDAP_USER, password=LDAP_PASSWORD, authentication=NTLM)
            if not conn.bind():
                app.logger.error(f"Failed to bind to LDAP server: {conn.last_error}")
                return jsonify({'message': 'Internal server error'}), 500
            
            # Search for user information
            search_filter = f'(sAMAccountName={username})'
            conn.search('dc=sdc,dc=test', search_filter, attributes=[
                    'cn', 'givenName', 'sn', 'mail', 'userPrincipalName', 'displayName', 
                    'telephoneNumber', 'mobile', 'title', 'department', 'company', 
                    'employeeID', 'manager', 'streetAddress', 'postalCode', 'l', 'st', 'co', 
                    'memberOf'
                ]
            )
            if not conn.entries:
                return jsonify({'message': 'User not found'}), 404
            
            user_info = conn.entries[0]
            
            return jsonify({
                'username': username,
                'full_name': user_info.cn.value,
                'first_name': user_info.givenName.value if 'givenName' in user_info else None,
                'last_name': user_info.sn.value if 'sn' in user_info else None,
                'email': user_info.mail.value if 'mail' in user_info else None,
                'user_principal_name': user_info.userPrincipalName.value if 'userPrincipalName' in user_info else None,
                'display_name': user_info.displayName.value if 'displayName' in user_info else None,
                'telephone_number': user_info.telephoneNumber.value if 'telephoneNumber' in user_info else None,
                'mobile_number': user_info.mobile.value if 'mobile' in user_info else None,
                'job_title': user_info.title.value if 'title' in user_info else None,
                'department': user_info.department.value if 'department' in user_info else None,
                'company': user_info.company.value if 'company' in user_info else None,
                'employee_id': user_info.employeeID.value if 'employeeID' in user_info else None,
                'manager': user_info.manager.value if 'manager' in user_info else None,
                'street_address': user_info.streetAddress.value if 'streetAddress' in user_info else None,
                'postal_code': user_info.postalCode.value if 'postalCode' in user_info else None,
                'city': user_info.l.value if 'l' in user_info else None,
                'state': user_info.st.value if 'st' in user_info else None,
                'country': user_info.co.value if 'co' in user_info else None,
                'member_of': user_info.memberOf.value if 'memberOf' in user_info else None
            })
        else:
            return jsonify({'message': 'User not authenticated'}), 401
    except Exception as e:
        app.logger.error(f"Error in /api/user route: {e}")
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify(message="hi")

@app.route("/testdb")
def testdb():
    connection = sqlite3.connect(os.path.join(curDirectory, "db-test.db"))
    cursor = connection.cursor()
    query = "SELECT * FROM members"
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    connection.close()

    # Assuming 'members' table has a single column
    members = [row[0] for row in results]

    return jsonify({"members": members})

@app.route("/userinfo")
def userinfo():
    username = request.environ.get('REMOTE_USER')
    return username


@app.route('/submit_SLMP_Form-Install', methods=['POST'])
def submit_form():
    try:
        form_data = request.form.to_dict()
        file = request.files.get('fileUpload')

        if file:
            specialFilepath = f"{form_data["ROID"]}_{int(time.time())}_{file.filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER_USER'], specialFilepath)
            file.save(file_path)
            form_data['file_path'] = file_path
        else:
            form_data['file_path'] = None

        app.logger.debug(f"Received form data: {form_data}")

        db_path = os.path.join(curDirectory, "databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            INSERT INTO "SLMPInstall" (
                ROID, DivisionProgram, Date, Outside, EndorserID, ApproverID, 
                SoftwareAssignee, MachineCATNumber, MachineName, SoftwareName, 
                VersionNumber, SoftwareInvenNumber, LicenseType, LicensingScheme, 
                LicenseValidity, AdditionalInfo, Remarks, FilePath
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        '''
        cursor.execute(query, (
            form_data['ROID'], form_data['DivisionProgram'], form_data['Date'], form_data['Outside'],
            form_data['EndorserID'], form_data['ApproverID'], form_data['SoftwareAssignee'], 
            form_data['MachineCATNumber'], form_data['MachineName'], form_data['SoftwareName'], 
            form_data['VersionNumber'], form_data['SoftwareInvenNumber'], form_data['LicenseType'], 
            form_data['LicensingScheme'], form_data['LicenseValidity'], form_data['AdditionalInfo'], 
            form_data['Remarks'], form_data['file_path']
        ))
        form_submission_id = cursor.lastrowid
        query2 = '''
            INSERT INTO "SLMPInstallStatus" (
                id, Approved, Endorsed, Accepted
            ) VALUES (?, ?, ?, ?)
        '''
        cursor.execute(query2, (form_submission_id, 0, 0, 0))

        query3 = '''
            INSERT INTO "SLMPInstallEndorse" (
                id
            ) VALUES (?)
        '''
        cursor.execute(query3, (form_submission_id,))

        query4 = '''
            INSERT INTO "SLMPInstallApprove" (
                id
            ) VALUES (?)
        '''
        cursor.execute(query4, (form_submission_id,))

        query5 = '''
            INSERT INTO "SLMPInstallAccept" (
                id
            ) VALUES (?)
        '''
        cursor.execute(query5, (form_submission_id,))        

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form submitted successfully", "Request ID": form_submission_id}), 200
    except sqlite3.Error as e:
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        app.logger.error(f"Error processing form submission: {e}")
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500

@app.route('/amend_SLMP_Form-Install', methods=['POST'])
def amend_form():
    try:
        form_data = request.form.to_dict()
        file = request.files.get('fileUpload')

        if file:
            specialFilepath = f"{form_data["ROID"]}_{int(time.time())}_{file.filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER_USER'], specialFilepath)
            file.save(file_path)
            form_data['FilePath'] = file_path
        # elif form_data["FilePath"] != "":
        #     try:
        #         if os.path.exists(form_data["FilePath"]):
        #             os.remove(form_data["FilePath"])
        #             return jsonify({'message': 'File deleted successfully'}), 200
        #         else:
        #             return jsonify({'error': 'File not found'}), 404
        #     except Exception as e:
        #         app.logger.error(f"Error deleting file: {e}")
        #         return jsonify({'error': 'Error deleting file', 'details': str(e)}), 500

        app.logger.debug(f"Received form data: {form_data}")

        db_path = os.path.join(curDirectory, "databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPInstall" SET
                ROID = ?,
                DivisionProgram = ?,
                Date = ?,
                Outside = ?,
                EndorserID = ?,
                ApproverID = ?,
                SoftwareAssignee = ?,
                MachineCATNumber = ?,
                MachineName = ?,
                SoftwareName = ?,
                VersionNumber = ?,
                SoftwareInvenNumber = ?,
                LicenseType = ?,
                LicensingScheme = ?,
                LicenseValidity = ?,
                AdditionalInfo = ?,
                Remarks = ?,
                FilePath = ?
            WHERE id = ?
        '''
        cursor.execute(query, (
            form_data['ROID'], form_data['DivisionProgram'], form_data['Date'], form_data['Outside'],
            form_data['EndorserID'], form_data['ApproverID'], form_data['SoftwareAssignee'], 
            form_data['MachineCATNumber'], form_data['MachineName'], form_data['SoftwareName'], 
            form_data['VersionNumber'], form_data['SoftwareInvenNumber'], form_data['LicenseType'], 
            form_data['LicensingScheme'], form_data['LicenseValidity'], form_data['AdditionalInfo'], 
            form_data['Remarks'], form_data['FilePath'], form_data['id']
        ))   

        query2 = '''
            UPDATE "SLMPInstallStatus" SET
                Endorsed = ?,
                Approved = ?
            WHERE id = ?
        '''    
        cursor.execute(query2, (0,0,form_data['id']))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form submitted successfully", "Request ID": form_data['id']}), 200
    except sqlite3.Error as e:
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        app.logger.error(f"Error processing form submission: {e}")
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500

@app.route('/find-slmp-install', methods=['GET'])
def findslmpinstall():
    user = request.args.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400
    
    app.logger.debug(f"Recieved request for SLMP for user {user}")

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
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500


@app.route('/find-slmp-install-pending', methods=['GET'])
def findslmpinstallpending():
    user = request.args.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400
    
    app.logger.debug(f"Recieved request for SLMP for user {user}")

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
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
@app.route('/find-slmp-endorsements', methods=['GET'])
def findslmpendorsements():
    username = request.args.get('user')
    if not username:
        return jsonify({'error': 'User is required'}), 400
    
    app.logger.debug(f"Recieved request for SLMP for user {username}")

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
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
@app.route('/find-slmp-rejections', methods=['GET'])
def findslmprejections():
    username = request.args.get('user')
    if not username:
        return jsonify({'error': 'User is required'}), 400
    
    app.logger.debug(f"Recieved request for SLMP for user {username}")

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
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

@app.route('/find-slmp-approvals', methods=['GET'])
def findslmpapprovals():
    username = request.args.get('user')
    if not username:
        return jsonify({'error': 'User is required'}), 400
    
    app.logger.debug(f"Recieved request for SLMP for user {username}")

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
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
 

@app.route('/find-slmp', methods=['GET'])
def findslmp():
    reqID = request.args.get('reqID')
    if not reqID:
        return jsonify({'error': 'Request ID is required'}), 400
    
    app.logger.debug(f"Recieved request for SLMP for Request ID {reqID}")

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
        INNER JOIN SLMPInstallAccept t5 on t1.id = t5.id
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
            acceptstatus = "Accepted" if row[22] == 1 else "Pending" if row[22] == 0 else "Rejected"
            endorseadditionalinfo = "NIL" if not row[31] else row[31]
            endorseremarks = "NIL" if not row[32] else row[32]
            approveremarks = "NIL" if not row[37] else row[37]

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
                "FileLink": row[18],
                "AdditionalInfo": additionalinfo,
                "Remarks": remarks,
                "Approved": approvalstatus,
                "Endorsed": endorsedstatus,
                "Accepted": acceptstatus,
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
                "AcceptFullName": row[40],
                "AcceptDivisionProgram": row[41],
                "AcceptDate": row[42]
            })
        connection.close()
        return jsonify(results_list), 200
    except sqlite3.Error as e:
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
@app.route('/download-pdf', methods=['GET'])
def download_pdf():
    path = request.args.get('file_path')
    if not path:
        return jsonify({'error': 'File path is required'}), 400
    
    if not os.path.exists(path):
        return jsonify({'error': 'File not found'}), 404

    try:
        return send_file(path, as_attachment=True)
    except Exception as e:
        app.logger.error(f"Error sending file: {e}")
        return jsonify({'message': 'Error sending file', 'error': str(e)}), 500

@app.route('/submit_SLMP_Form-Install_sec2', methods=['POST'])
def submit_form_sec2():
    try:
        form_data = request.form.to_dict()
        file = request.files.get('EndorseAttachment')

        if file:
            specialFilepath = f"{form_data["FullName"]}_{int(time.time())}_{file.filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER_ENDORSER'], specialFilepath)
            file.save(file_path)
            form_data['file_path'] = file_path
        else:
            form_data['file_path'] = None

        app.logger.debug(f"Received form data: {form_data}")

        db_path = os.path.join(curDirectory, "databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPInstallEndorse" SET
                FullName = ?,
                EndorseDate = ?,
                DivisionProgram = ?,
                Verification = ?,
                Supported = ?,
                Tracking = ?,
                BlanketApproval = ?,
                EndorseAdditionalInfo = ?,
                EndorseRemarks = ?,
                EndorseAttachment = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['EndorseDate'], form_data['DivisionProgram'], form_data['Verification'],
            form_data['Supported'], form_data['Tracking'], form_data['BlanketApproval'], 
            form_data['EndorseAdditionalInfo'], form_data['EndorseRemarks'], form_data['file_path'], 
            form_data['id']
        ))
        form_submission_id = form_data['id']

        query2 = '''
            UPDATE "SLMPInstallStatus" SET
                Endorsed = ?
            WHERE id = ?
        '''
        
        cursor.execute(query2, (
            1, form_submission_id
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form endorsed successfully", "Request ID": form_submission_id}), 200
    except sqlite3.Error as e:
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        app.logger.error(f"Error processing form submission: {e}")
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500
    
@app.route('/submit_SLMP_Form-Install_sec2_reject', methods=['POST'])
def submit_form_sec2_reject():
    try:
        form_data = request.form.to_dict()
        file = request.files.get('EndorseAttachment')

        if file:
            specialFilepath = f"{form_data["FullName"]}_{int(time.time())}_{file.filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER_ENDORSER'], specialFilepath)
            file.save(file_path)
            form_data['file_path'] = file_path
        else:
            form_data['file_path'] = None

        app.logger.debug(f"Received form data: {form_data}")

        db_path = os.path.join(curDirectory, "databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPInstallEndorse" SET
                FullName = ?,
                EndorseDate = ?,
                DivisionProgram = ?,
                Verification = ?,
                Supported = ?,
                Tracking = ?,
                BlanketApproval = ?,
                EndorseAdditionalInfo = ?,
                EndorseRemarks = ?,
                EndorseAttachment = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['EndorseDate'], form_data['DivisionProgram'], form_data['Verification'],
            form_data['Supported'], form_data['Tracking'], form_data['BlanketApproval'], 
            form_data['EndorseAdditionalInfo'], form_data['EndorseRemarks'], form_data['file_path'], 
            form_data['id']
        ))
        form_submission_id = form_data['id']

        query2 = '''
            UPDATE "SLMPInstallStatus" SET
                Endorsed = ?
            WHERE id = ?
        '''
        
        cursor.execute(query2, (
            -1, form_submission_id
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form endorsed successfully", "Request ID": form_submission_id}), 200
    except sqlite3.Error as e:
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        app.logger.error(f"Error processing form submission: {e}")
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500

@app.route('/submit_SLMP_Form-Install_sec3', methods=['POST'])
def submit_form_sec3():
    try:
        form_data = request.form.to_dict()

        app.logger.debug(f"Received form data: {form_data}")

        db_path = os.path.join(curDirectory, "databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPInstallApprove" SET
                FullName = ?,
                DivisionProgram = ?,
                ApproveRemarks = ?,
                ApproveDate = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['DivisionProgram'], form_data['ApproveRemarks'], form_data['ApproveDate'],
            form_data['id']
        ))
        form_submission_id = form_data['id']

        query2 = '''
            UPDATE "SLMPInstallStatus" SET
                Approved = ?
            WHERE id = ?
        '''
        
        cursor.execute(query2, (
            1, form_submission_id
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form endorsed successfully", "Request ID": form_submission_id}), 200
    except sqlite3.Error as e:
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        app.logger.error(f"Error processing form submission: {e}")
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500

@app.route('/submit_SLMP_Form-Install_sec3_reject', methods=['POST'])
def submit_form_sec3_reject():
    try:
        form_data = request.form.to_dict()

        app.logger.debug(f"Received form data: {form_data}")

        db_path = os.path.join(curDirectory, "databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPInstallApprove" SET
                FullName = ?,
                DivisionProgram = ?,
                ApproveRemarks = ?,
                ApproveDate = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['DivisionProgram'], form_data['ApproveRemarks'], form_data['ApproveDate'],
            form_data['id']
        ))
        form_submission_id = form_data['id']

        query2 = '''
            UPDATE "SLMPInstallStatus" SET
                Approved = ?
            WHERE id = ?
        '''
        
        cursor.execute(query2, (
            -1, form_submission_id
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form endorsed successfully", "Request ID": form_submission_id}), 200
    except sqlite3.Error as e:
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        app.logger.error(f"Error processing form submission: {e}")
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500
    
@app.route('/find-reqid', methods=['GET'])
def findreqid():
    user = request.args.get('user')
    if not user:
        return jsonify({'error': 'User is required'}), 400
    
    app.logger.debug(f"Recieved request for SLMP for user {user}")

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
        app.logger.error(f"SQLite error: {e}")
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    
if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
