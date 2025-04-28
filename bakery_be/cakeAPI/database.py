from pymongo import MongoClient
from bson import ObjectId

client = MongoClient('mongodb://localhost:27017/')
db = client.QuanLyWebBanBanh

def get_object(collection, pk):
    try:
        return collection.find_one({'_id': ObjectId(pk)})
    except:
        return None