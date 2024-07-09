from flask import Blueprint, request, jsonify
import sqlite3
import os
import time

submit_transfer = Blueprint('submit_transfer', __name__)

UPLOAD_FOLDER_USER = 'uploads/request-uploads/'
os.makedirs(UPLOAD_FOLDER_USER, exist_ok=True)

UPLOAD_FOLDER_ENDORSER = 'uploads/endorse-uploads/'
os.makedirs(UPLOAD_FOLDER_ENDORSER, exist_ok=True)

@submit_transfer.route('/section1', methods=['POST'])
def submitsection1():
    try:
        form_data = request.form.to_dict()
        file = request.files.get('fileUpload')

        if file:
            specialFilepath = f"{form_data["ROID"]}_{int(time.time())}_{file.filename}"
            file_path = os.path.join(UPLOAD_FOLDER_USER, specialFilepath)
            file.save(file_path)
            form_data['file_path'] = file_path
        else:
            form_data['file_path'] = None

        db_path = os.path.join("databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        cursor.execute('''
            INSERT INTO "SLMPRequests" (RequestType, CreatedAt, ROID) VALUES (?, ?, ?)
        ''', ('Transfer', form_data['Date'], form_data['ROID']))
        unique_request_id = cursor.lastrowid

        query = '''
            INSERT INTO "SLMPTransfer" (
                id, ROID, FullName, DivisionProgram, Date, EndorserID, ApproverID, 
                CurrentAssignee, CurrentCATNumber, CurrentMachineName, NewAssignee, 
                NewCATNumber, NewMachineName, SoftwareName, VersionNumber, 
                SoftwareInvenNumber, LicenseType, LicensingScheme, LicenseValidity, AdditionalInfo, Remarks, FilePath
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        '''
        cursor.execute(query, (
            unique_request_id, form_data['ROID'], form_data['FullName'], form_data['DivisionProgram'], form_data['Date'],
            form_data['EndorserID'], form_data['ApproverID'], form_data['CurrentAssignee'], 
            form_data['CurrentCATNumber'], form_data['CurrentMachineName'], form_data['NewAssignee'], 
            form_data['NewCATNumber'], form_data['NewMachineName'], form_data['SoftwareName'], 
            form_data['VersionNumber'], form_data['SoftwareInvenNumber'], form_data['LicenseType'], 
            form_data['LicensingScheme'], form_data['LicenseValidity'], form_data['AdditionalInfo'], 
            form_data['Remarks'], form_data['file_path']
        ))

        query2 = '''
            INSERT INTO "SLMPTransferStatus" (
                id, Approved, Endorsed, Accepted
            ) VALUES (?, ?, ?, ?)
        '''
        cursor.execute(query2, (unique_request_id, 0, 0, 0))

        query3 = '''
            INSERT INTO "SLMPTransferEndorse" (
                id
            ) VALUES (?)
        '''
        cursor.execute(query3, (unique_request_id,))

        query4 = '''
            INSERT INTO "SLMPTransferApprove" (
                id
            ) VALUES (?)
        '''
        cursor.execute(query4, (unique_request_id,))

        query5 = '''
            INSERT INTO "SLMPTransferAccept" (
                id
            ) VALUES (?)
        '''
        cursor.execute(query5, (unique_request_id,))        

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form submitted successfully", "Request ID": unique_request_id}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500
    
@submit_transfer.route('/section2', methods=['POST'])
def submitsection2():
    try:
        form_data = request.form.to_dict()
        file = request.files.get('EndorseAttachment')

        if file:
            specialFilepath = f"{form_data['FullName']}_{int(time.time())}_{file.filename}"
            file_path = os.path.join(UPLOAD_FOLDER_ENDORSER, specialFilepath)
            file.save(file_path)
            form_data['file_path'] = file_path
        else:
            form_data['file_path'] = None

        db_path = os.path.join("databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPTransferEndorse" SET
                EndorseFullName = ?,
                EndorseDate = ?,
                EndorseDivisionProgram = ?,
                EndorseVerification = ?,
                EndorseSupported = ?,
                EndorseUninstalled = ?,
                EndorseTrackingUpdated = ?,
                EndorseVSPUpdated = ?,
                EndorseAdditionalInfo = ?,
                EndorseRemarks = ?,
                EndorseFilePath = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['EndorseDate'], form_data['DivisionProgram'], form_data['Verification'],
            form_data['Supported'], form_data['Uninstalled'], form_data['Tracking'], form_data['VSPUpdated'], 
            form_data['EndorseAdditionalInfo'], form_data['EndorseRemarks'], form_data['file_path'], 
            form_data['id']
        ))

        query2 = '''
            UPDATE "SLMPTransferStatus" SET
                Endorsed = ?
            WHERE id = ?
        '''
        
        cursor.execute(query2, (
            1, form_data['id']
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form endorsed successfully", "Request ID": form_data['id']}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500
    
@submit_transfer.route('/section2-reject', methods=['POST'])
def rejectsection2():
    try:
        form_data = request.form.to_dict()
        file = request.files.get('EndorseAttachment')

        if file:
            specialFilepath = f"{form_data['FullName']}_{int(time.time())}_{file.filename}"
            file_path = os.path.join(UPLOAD_FOLDER_ENDORSER, specialFilepath)
            file.save(file_path)
            form_data['file_path'] = file_path
        else:
            form_data['file_path'] = None

        db_path = os.path.join("databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPTransferEndorse" SET
                EndorseFullName = ?,
                EndorseDate = ?,
                EndorseDivisionProgram = ?,
                EndorseVerification = ?,
                EndorseSupported = ?,
                EndorseUninstalled = ?,
                EndorseTrackingUpdated = ?,
                EndorseVSPUpdated = ?,
                EndorseAdditionalInfo = ?,
                EndorseRemarks = ?,
                EndorseFilePath = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['EndorseDate'], form_data['DivisionProgram'], form_data['Verification'],
            form_data['Supported'], form_data['Uninstalled'], form_data['Tracking'], form_data['VSPUpdated'], 
            form_data['EndorseAdditionalInfo'], form_data['EndorseRemarks'], form_data['file_path'], 
            form_data['id']
        ))

        query2 = '''
            UPDATE "SLMPTransferStatus" SET
                Endorsed = ?
            WHERE id = ?
        '''
        
        cursor.execute(query2, (
            -1, form_data['id']
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form endorsed successfully", "Request ID": form_data['id']}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500
    
@submit_transfer.route('/section3', methods=['POST'])
def submitsection3():
    try:
        form_data = request.form.to_dict()

        db_path = os.path.join("databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPTransferApprove" SET
                ApproveFullName = ?,
                ApproveDivisionProgram = ?,
                ApproveRemarks = ?,
                ApproveDate = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['DivisionProgram'], form_data['ApproveRemarks'], form_data['ApproveDate'],
            form_data['id']
        ))

        query2 = '''
            UPDATE "SLMPTransferStatus" SET
                Approved = ?
            WHERE id = ?
        '''
        
        cursor.execute(query2, (
            1, form_data['id']
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form endorsed successfully", "Request ID": form_data['id']}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500
    
@submit_transfer.route('/section3-reject', methods=['POST'])
def rejectsection3():
    try:
        form_data = request.form.to_dict()

        db_path = os.path.join("databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPTransferApprove" SET
                ApproveFullName = ?,
                ApproveDivisionProgram = ?,
                ApproveRemarks = ?,
                ApproveDate = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['DivisionProgram'], form_data['ApproveRemarks'], form_data['ApproveDate'],
            form_data['id']
        ))

        query2 = '''
            UPDATE "SLMPTransferStatus" SET
                Approved = ?
            WHERE id = ?
        '''
        
        cursor.execute(query2, (
            -1, form_data['id']
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form endorsed successfully", "Request ID": form_data['id']}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500

@submit_transfer.route('/amend', methods=['POST'])
def amendform():
    try:
        form_data = request.form.to_dict()
        file = request.files.get('FileUpload')

        if file:
            specialFilepath = f"{form_data["ROID"]}_{int(time.time())}_{file.filename}"
            file_path = os.path.join(UPLOAD_FOLDER_USER, specialFilepath)
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


        db_path = os.path.join("databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPTransfer" SET
                ROID = ?,
                FullName = ?,
                DivisionProgram = ?,
                Date = ?,
                EndorserID = ?,
                ApproverID = ?,
                CurrentAssignee = ?,
                CurrentCATNumber = ?,
                CurrentMachineName = ?,
                NewAssignee = ?,
                NewCATNumber = ?,
                NewMachineName = ?,
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
            form_data['ROID'], form_data['FullName'], form_data['DivisionProgram'], form_data['Date'],
            form_data['EndorserID'], form_data['ApproverID'], form_data['CurrentAssignee'], 
            form_data['CurrentCATNumber'], form_data['CurrentMachineName'], form_data['NewAssignee'], 
            form_data['NewCATNumber'], form_data['NewMachineName'], form_data['SoftwareName'], 
            form_data['VersionNumber'], form_data['SoftwareInvenNumber'], form_data['LicenseType'], 
            form_data['LicensingScheme'], form_data['LicenseValidity'], form_data['AdditionalInfo'], 
            form_data['Remarks'], form_data['FilePath'], form_data['id']
        ))   

        query2 = '''
            UPDATE "SLMPTransferStatus" SET
                Endorsed = ?,
                Approved = ?,
                Accepted = ?
            WHERE id = ?
        '''    
        cursor.execute(query2, (0,0,0,form_data['id']))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form submitted successfully", "Request ID": form_data['id']}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500
    
@submit_transfer.route('/section4', methods=['POST'])
def submitsection4():
    try:
        form_data = request.form.to_dict()

        db_path = os.path.join("databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPTransferAccept" SET
                AcceptFullName = ?,
                AcceptDivisionProgram = ?,
                AcceptRemarks = ?,
                AcceptDate = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['DivisionProgram'], form_data['Remarks'], form_data['Date'],
            form_data['id']
        ))

        query2 = '''
            UPDATE "SLMPTransferStatus" SET
                Accepted = ?
            WHERE id = ?
        '''
        
        cursor.execute(query2, (
            1, form_data['id']
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form endorsed successfully", "Request ID": form_data['id']}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500
    
@submit_transfer.route('/section4-reject', methods=['POST'])
def rejectsection4():
    try:
        form_data = request.form.to_dict()

        db_path = os.path.join("databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            UPDATE "SLMPTransferAccept" SET
                AcceptFullName = ?,
                AcceptDivisionProgram = ?,
                AcceptRemarks = ?,
                AcceptDate = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['DivisionProgram'], form_data['Remarks'], form_data['Date'],
            form_data['id']
        ))

        query2 = '''
            UPDATE "SLMPTransferStatus" SET
                Accepted = ?
            WHERE id = ?
        '''
        
        cursor.execute(query2, (
            -1, form_data['id']
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form endorsed successfully", "Request ID": form_data['id']}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500