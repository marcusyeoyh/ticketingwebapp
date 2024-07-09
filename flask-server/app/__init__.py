from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

    # Register Blueprints
    from app.routes.user_routes import user_bp
    from app.routes.submit_slmp_install import submit_install
    from app.routes.slmp_install import slmp_install
    from app.routes.submit_slmp_transfer import submit_transfer
    from app.routes.slmp_transfer import slmp_transfer
    from app.routes.submit_slmp_delete import submit_delete
    from app.routes.slmp_delete import slmp_delete
    from app.services.download import downloadFile
    from app.utils.utils import utils
    
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(submit_install, url_prefix='/submitslmp/install')
    app.register_blueprint(slmp_install, url_prefix='/slmp/install')
    app.register_blueprint(submit_transfer, url_prefix='/submitslmp/transfer')
    app.register_blueprint(slmp_transfer, url_prefix='/slmp/transfer')
    app.register_blueprint(submit_delete, url_prefix='/submitslmp/delete')
    app.register_blueprint(slmp_delete, url_prefix='/slmp/delete')
    app.register_blueprint(downloadFile)
    app.register_blueprint(utils, url_prefix='/utils')
    
    return app
