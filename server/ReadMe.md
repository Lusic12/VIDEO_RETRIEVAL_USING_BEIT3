```bash
python -m venv .venv

gdown --folder 1bCVkOIfUAS3nvLZwu3fu-hvCjKfsvGA- # download beit3 folder
gdown --folder 18TKTQI8fqozCG3_1mBo6we1YopWhvfp- # download trained beit3 weight
gdown 1l8OSeTIT6r0S4qyw5JW-M8_bnJmNei49 # download faiss index

cd beit3 && pip install -r requirements.txt
cd .. 
pip install faiss-cpu pymongo flask flask-cors redis
```