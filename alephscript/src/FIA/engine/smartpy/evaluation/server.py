import flask
from flask import request, jsonify
from evaluate import Evaluate
import os
import json
from time import time
import copy
from waitress import serve

app = flask.Flask(__name__)
# app.config["DEBUG"] = True --> Use for debug

EvaluationModel = Evaluate()

@app.route('/', methods=['GET'])
def home():
    return '''<h1>Python modules runner</h1>
<p>A prototype API for executing IA trained models.</p>'''


# A route to run SmartRecognition, send a POST object, see below (L43)
@app.route('/eval', methods=['POST'])
def eval_sr():
    """
    Ejemplo de ejecucion por bloques.
    1- inicializacion de los modelos
    2- iteracion sobre las imagenes a procesar (face detection + clasificador de expresiones).
    """
    os.environ['CUDA_DEVICE_ORDER'] = 'PCI_BUS_ID'
    os.environ['CUDA_VISIBLE_DEVICES'] = '0'

    args = request.get_json(silent=True)

    print(args)
    basePath = "/srv/elmas/SRC/sc_elmas/PYTHONS/SMARTPY"
    if (args is None):
        # path = "/mnt/c/Users/ohioset1/Documents/EmotiOn/elmas2/SRC/sc_elmas/ALIEN/"
        # path = basePath + "/eval_imgs/"
        # trackName = "face"
        # pathOut = basePath + "/results"
        return jsonify({"success": False, "name": "", "file": "", "error": "no params given"})
    else:
        try:
            # The directory to read
            path = args["input"]   
            # A word without extension to use for output 
            trackName = args["name"]
            # The directory to write
            pathOut = args["output"]
            # Bool, create or not the json file or return in api response
            save = args["save"]    
        except:
            return jsonify({"success": False, "name": trackName,"error": "Bad params, expected: {input: 'the dir with the images', name: 'any valid fs name', output: 'the out dir, will created if not exists', save: 'a bool, create json results file or return in query'}"})

    tic = time()
 
    evaluator = copy.copy(EvaluationModel)
    out_json = None;
    error = None;
    try:
        out_json = evaluator.run(path, trackName, pathOut)
    except TypeError:
        error = "Error, it seems that the input folder contains already processed files, please remove them and retry..."
        print (error)
    except:
        print("An error ocurred")

    if (out_json is None):
        return jsonify({"success": False, "name": trackName,"error": error})
    else:
        duration = time() - tic
        print('[OPERATION] crop & align time', duration)
        result = { "goodRows": [] }
        if not os.path.exists(evaluator.pathOut):
            print('[OPERATION] No faces found', evaluator.pathOut)
            filename = ""
            success = False
            error = "No faces found"
        else:
            filename = os.path.join(path, trackName + '.json')
            success = True
            error = ""
            if (save):
                filename = os.path.join(path, trackName + '.json')
                print("[OPERATION] saving json", filename)
                tic = time()
                with open(filename, 'w') as fp:
                    json.dump(out_json, fp)
                    duration = time() - tic
                    print("[OPERATION] saved json, duration", duration)
            else:
                print("[OPERATION] NOT saving json because it is disabled by configuration.", filename)                
                result = out_json
        return jsonify({"name": trackName, "success": success, "file": filename, "error": error, "result": json.dumps(out_json)})

# app.run() --> Use for debug
serve(app, host='0.0.0.0', port=5000)
