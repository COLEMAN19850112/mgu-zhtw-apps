import hashlib,sys
from pathlib import Path
T=Path(__file__).resolve().parent
EXPECTED={'build.py': '40f770c63d555faa2f8b8bdc39e3b15f6ec2b322ec1894c02b7ec2c03120fc0d', 'localize.py': '96bbaf50d8c34448f90f06c9ab9ddf143affed1ad941dbbd83eac4073dcdd2dd'}
if sys.argv[1:]!=['cluster_themes','--language','zh-TW']:raise SystemExit('Only cluster_themes --language zh-TW is supported')
for n,h in EXPECTED.items():
    if hashlib.sha256((T/n).read_bytes()).hexdigest()!=h:raise SystemExit('Builder compatibility failed: '+n)
if not (T.parent/'runtime/locales/zh-TW.json').is_file():raise SystemExit('Missing zh-TW catalog')
sys.path.insert(0,str(T))
import localize
original=localize.package_version
localize.package_version=lambda version,language:version if language=='zh-TW' else original(version,language)
import build
build.main()
