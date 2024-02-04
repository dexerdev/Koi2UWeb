from dotenv import load_dotenv
import os
basedir = os.path.abspath(__file__)
load_dotenv(os.path.join(basedir, ".env"))

UrlAPI = os.environ.get("UrlAPI")