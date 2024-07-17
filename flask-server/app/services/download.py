from flask import Blueprint, request, jsonify, send_file
import os

# Responsible for downloading attachment as pdf document

downloadFile = Blueprint('downloadFile', __name__)

# download attachment as pdf document
@downloadFile.route('/download-pdf', methods=['GET'])
def download_pdf():
    path = request.args.get('file_path')
    if not path:
        return jsonify({'error': 'File path is required'}), 400
    
    root_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    full_path = os.path.join(root_directory, path)

    if not os.path.exists(full_path):
        return jsonify({'error': 'File not found'}), 404

    try:
        return send_file(full_path, as_attachment=True)
    except Exception as e:
        return jsonify({'message': 'Error sending file', 'error': str(e)}), 500