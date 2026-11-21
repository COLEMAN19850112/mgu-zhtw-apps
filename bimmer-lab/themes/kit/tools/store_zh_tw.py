import hashlib,sys
from pathlib import Path
T=Path(__file__).resolve().parent
EXPECTED={'build.py': '93aa41146a68927a1cb526acc186238db4708a7abb0a61762b091d12ca42573a', 'localize.py': '96bbaf50d8c34448f90f06c9ab9ddf143affed1ad941dbbd83eac4073dcdd2dd'}
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
