from flask import Blueprint, request, jsonify
import sqlite3
import os
import time

submit_delete = Blueprint('submit_delete', __name__)

UPLOAD_FOLDER_USER = 'uploads/request-uploads/'
os.makedirs(UPLOAD_FOLDER_USER, exist_ok=True)

UPLOAD_FOLDER_ENDORSER = 'uploads/endorse-uploads/'
os.makedirs(UPLOAD_FOLDER_ENDORSER, exist_ok=True)

@submit_delete.route('/section1', methods=['POST'])
def submitsection1():
    try:
        form_data = request.form.to_dict()
        file = request.files.get('fileUpload')

        if file:
            specialFilepath = f"{form_data['ROID']}_{int(time.time())}_{file.filename}"
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
        ''', ('Delete', form_data['Date'], form_data['ROID']))
        unique_request_id = cursor.lastrowid

        query = '''
            INSERT INTO "SLMPDelete" (
                id, ROID, FullName, DivisionProgram, Date, RemovalReason, EndorserID, 
                SoftwareAssignee, MachineCATNumber, MachineName, SoftwareName, 
                VersionNumber, SoftwareInvenNumber, LicenseType, LicensingScheme, 
                LicenseValidity, AdditionalInfo, Remarks, FilePath
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        '''
        cursor.execute(query, (
            unique_request_id, form_data['ROID'], form_data['FullName'], form_data['DivisionProgram'], form_data['Date'], form_data['RemovalReason'],
            form_data['EndorserID'], form_data['SoftwareAssignee'], 
            form_data['MachineCATNumber'], form_data['MachineName'], form_data['SoftwareName'], 
            form_data['VersionNumber'], form_data['SoftwareInvenNumber'], form_data['LicenseType'], 
            form_data['LicensingScheme'], form_data['LicenseValidity'], form_data['AdditionalInfo'], 
            form_data['Remarks'], form_data['file_path']
        ))

        query2 = '''
            INSERT INTO "SLMPDeleteStatus" (
                id, Endorsed
            ) VALUES (?, ?)
        '''
        cursor.execute(query2, (unique_request_id, 0))

        query3 = '''
            INSERT INTO "SLMPDeleteEndorse" (
                id
            ) VALUES (?)
        '''
        cursor.execute(query3, (unique_request_id,))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form submitted successfully", "Request ID": unique_request_id}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500

@submit_delete.route('/section2', methods=['POST'])
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
            UPDATE "SLMPDeleteEndorse" SET
                FullName = ?,
                Date = ?,
                DivisionProgram = ?,
                Verification = ?,
                Supported = ?,
                Uninstalled = ?,
                Tracking = ?,
                AdditionalInfo = ?,
                Remarks = ?,
                FilePath = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['EndorseDate'], form_data['DivisionProgram'], form_data['Verification'],
            form_data['Supported'], form_data['Uninstalled'], form_data['Tracking'], 
            form_data['EndorseAdditionalInfo'], form_data['EndorseRemarks'], form_data['file_path'], 
            form_data['id']
        ))

        query2 = '''
            UPDATE "SLMPDeleteStatus" SET
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
    
@submit_delete.route('/section2-reject', methods=['POST'])
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
            UPDATE "SLMPDeleteEndorse" SET
                FullName = ?,
                Date = ?,
                DivisionProgram = ?,
                Verification = ?,
                Supported = ?,
                Uninstalled = ?,
                Tracking = ?,
                AdditionalInfo = ?,
                Remarks = ?,
                FilePath = ?
            WHERE id = ?
        '''

        cursor.execute(query, (
            form_data['FullName'], form_data['EndorseDate'], form_data['DivisionProgram'], form_data['Verification'],
            form_data['Supported'], form_data['Uninstalled'], form_data['Tracking'], 
            form_data['EndorseAdditionalInfo'], form_data['EndorseRemarks'], form_data['file_path'], 
            form_data['id']
        ))

        query2 = '''
            UPDATE "SLMPDeleteStatus" SET
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

@submit_delete.route('/amend', methods=['POST'])
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
            UPDATE "SLMPDelete" SET
                ROID = ?,
                FullName = ?,
                DivisionProgram = ?,
                Date = ?,
                EndorserID = ?,
                RemovalReason = ?,
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
            form_data['ROID'], form_data['FullName'], form_data['DivisionProgram'], form_data['Date'],
            form_data['EndorserID'], form_data['RemovalReason'], form_data['SoftwareAssignee'], 
            form_data['MachineCATNumber'], form_data['MachineName'], form_data['SoftwareName'], 
            form_data['VersionNumber'], form_data['SoftwareInvenNumber'], form_data['LicenseType'], 
            form_data['LicensingScheme'], form_data['LicenseValidity'], form_data['AdditionalInfo'], 
            form_data['Remarks'], form_data['FilePath'], form_data['id']
        ))   

        query2 = '''
            UPDATE "SLMPDeleteStatus" SET
                Endorsed = ?
            WHERE id = ?
        '''    
        cursor.execute(query2, (0,form_data['id']))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form submitted successfully", "Request ID": form_data['id']}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500

@submit_delete.route('/deleteReq', methods=['DELETE'])
def deletereq():
    try:
        reqID = request.args.get('reqID')
        
        db_path = os.path.join("databases", "SLMP.db")
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        query = '''
            DELETE FROM "SLMPDelete"
            WHERE id = ?
        '''

        cursor.execute(query, (
            reqID,
        ))

        query2 = '''
            DELETE FROM "SLMPDeleteStatus"
            WHERE id = ?
        '''
        
        cursor.execute(query2, (
            reqID,
        ))

        query4 = '''
            DELETE FROM "SLMPDeleteEndorse"
            WHERE id = ?
        '''
        
        cursor.execute(query4, (
            reqID,
        ))

        query5 = '''
            DELETE FROM "SLMPRequests"
            WHERE id = ?
        '''
        
        cursor.execute(query5, (
            reqID,
        ))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Form deleted successfully", "Request ID": reqID}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"message": "Error processing form submission", "error": str(e)}), 500