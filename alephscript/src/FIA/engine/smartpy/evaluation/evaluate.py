import os
import glob
import yaml
import dlib

from face_utils import face_extraction
from time import time
from Image_evaluationResNet_wild import Deep_emotion
import numpy as np
from job import Job
from task import Task
from face import Face
import sys

#CONFIG_FILE = "/mnt/c/Users/ohioset1/Documents/EmotiOn/elmas2/SRC/sc_elmas/ALIEN/api_smartface/smart-v1/config/config_eval.yaml"
CONFIG_FILE = "/srv/elmas/SRC/sc_elmas/PYTHONS/SMARTPY/config/config_eval.yaml"

class Evaluate():
    """
    Esta es la clase principal que se encarga de inizializar los bloques de deteccion facial y de clasificacion de
    expresiones mediante un modelo Deep Learning.
    """
    def __init__(self):
        """
        Inicializacion de los modelos y variables asociadas.
        """
        # 1 - Cargar en memoria el archivo de configuracion.
        self.config = self.get_config_file()

        # 2 - Variables locales de config.
        self.verbose = self.config['general']['verbose']
        self.predictor_path = self.config['general']['predictor_path']

        if self.verbose == 1:
            print('[INFO] Local variables initialized')

        if self.verbose == 1:
            print('[INFO] Initializing face landmark model')
        # 3 - Initialize facial landmarks recovery model.
        self.detector = dlib.get_frontal_face_detector()
        self.sp = dlib.shape_predictor(self.predictor_path)

        # 4 - Initialize and load deep model
        self.DeepEmotion = Deep_emotion(self.config)

    """
    Esta es la clase principal que se encarga de inizializar los bloques de deteccion facial y de clasificacion de
    expresiones mediante un modelo Deep Learning.
    """
    def run(self, path, trackName, pathOut):
        """
        Inicializacion de los modelos y variables asociadas.
        """
        print("[OPERATION] Running",path, trackName, pathOut)
        self.path = path
        self.trackName = trackName
        self.pathOut = pathOut

        return self.evaluation()

    def get_config_file(self):
        """
        Este metodo lee el archivo de configuracion.
        """
        with open(CONFIG_FILE, 'r') as configfile:
            config = yaml.load(configfile)

        return config

    def build_output_JSON(self):
        """
        Este metodo nos genera una variable tipo diccionario con estructura JSON ajustada a las necesidades
        establecidas como outputs.
        """
        job = self.job
        self.output_json = {}
        self.output_json['item'] = str(job.item)
        self.output_json['goodRows'] = []

        self.faces_found = len(self.job.tasks)

        if self.faces_found > 0:
            for task in self.job.tasks:

                for index, face in enumerate(task.faces):
                    row = {}
                    # print("Going to save face", face.id, "from", face.file, "evaluated", face.evaluated)

                    line = {}
                    # print("[EVALUATOR] [BUILDING OUPUT] Line", face.file)
                    line['file'] = face.file
                    line['line'] = str(index)
                    line['timestamp'] = str(index)
                    line['face_id'] = str(face.id)
                    line['confidence'] = "0"
                    line['confidence_tag'] = "[0, 0, 0, 0, 0, 0]"
                    line['success'] = "1"
                    line['frame'] = str(task.frame)

                    # subject_lndmks = face.landmarks
                    # for lndmk_id in range(68):
                    #    line['x_' + str(lndmk_id)] = str(subject_lndmks[lndmk_id][0])
                    #    line['y_' + str(lndmk_id)] = str(subject_lndmks[lndmk_id][1])
                    row['line'] = line

                    # This lines are to support RTSP.feature.evaluator2 by saving the interference to json so onnx client just loads the json and makes prediction
                    # matrix = []
                    # lines = face.interference[0]
                    # for x, line in enumerate(lines):
                    #     points = []
                    #     for y, column in enumerate(line):
                    #         colorValue = []
                    #         colorValue.append(round(column[0], 30))
                    #         colorValue.append(round(column[1], 30))
                    #         colorValue.append(round(column[2], 30))
                    #         points.append(colorValue)
                    #     matrix.append(points)
                    # row["matrix"] = face.file.replace(".jpg", "").replace(".png", "").replace(".mp4", "")  + "_interference.json"
                    # self.saveJson(row["matrix"], matrix)

                    row['evaluated'] = []
                    for index, key in enumerate(face.evaluated):
                        row['evaluated'].append(key)

                    self.output_json['goodRows'].append(row)
        else:
            id_info = {}
            id_info['face_id'] = '0'
            id_info['confidence'] = '0'
            id_info['confidence_tag'] = 'None'
            id_info['success'] = 0

            for lndmk_id in range(68):
                id_info['x_' + str(lndmk_id)] = '0'
                id_info['y_' + str(lndmk_id)] = '0'

            self.output_json['goodRows'].append(id_info)

    def evaluation(self):
        """
        Este es el metodo principal que engloba deteccion facial + clasificacion emocional.
        """

        # 1 - Variables locales de config.
        print("Read", self.path + '/*')
        self.img_filelist = glob.glob(self.path + '/*')

        # 2 - Extraccion de los rostros de las imagenes a procesar.
        self.job = face_extraction(self.img_filelist, self.detector, self.sp, self.verbose, False, self.pathOut)
        self.job.item = self.job.item # "VIDEO-X-FRAMES-03-TO-06"

        for task in self.job.tasks:

            # print("Working for task:", task.file)
            print("task has faces:", len(task.faces))

            if (len(task.faces) == 0):
                continue

            for face in task.faces:
                matrix = []
                matrix.append(face.matrix)

                # print("Going to evaluate face", face.id, "from", face.file )

                self.DeepEmotion.evaluation(matrix)

                face.predictionInfered = self.DeepEmotion.predictionInferedList[0]

                # print("Evaluated result", face.predictionInfered)

                face.predictionMax = self.DeepEmotion.predictionMaxList[0]

                evaluated = []

                for index, infered in enumerate(face.predictionInfered[0]):
                    # print("Infered", infered)
                    branch = {}
                    branch["id"] = index
                    branch["key"] = self.getEmotionKey(index)
                    branch["set"] = str(round(infered, 3))

                    key = { "branch": branch, "result": str(infered > 0.1) }
                    evaluated.append(key)

                # print("Evaluated", evaluated)
                face.evaluated = evaluated

        # 4 - Crea y devuelve el JSON con los parametros de la prediccion.
        self.build_output_JSON()
        return self.output_json

    def getEmotionKey(self, index):

        if (index == 0):
            return "Basal"
        if (index == 1):
            return "Anger"
        if (index == 2):
            return "Disgust"
        if (index == 3):
            return "Fear"
        if (index == 4):
            return "Happiness"
        if (index == 5):
            return "Sadness"
        if (index == 6):
            return "Surprise"
        return "UNKNOWN"

    def saveJson(self, filename, data):

        # print("[OPERATION] saving json", filename)

        tic = time()
        with open(filename, 'w') as fp:
            json.dump(data, fp)
            duration = time() - tic
            print("[OPERATION] saved json, duration", filename, duration)

def main1(args):
    """
    Ejemplo de ejecucion por bloques.
    1- inicializacion de los modelos
    2- iteracion sobre las imagenes a procesar (face detection + clasificador de expresiones).
    """
    os.environ['CUDA_DEVICE_ORDER'] = 'PCI_BUS_ID'
    os.environ['CUDA_VISIBLE_DEVICES'] = '0'

    basePath = "/Users/aleph/Desktop/EMOTION/sc_elmas_27022020/myMaster5/software/smart-v1"
    if (len(args) == 4):
        path = args[1]
        trackName = args[2]
        pathOut = args[3]
    else:
        # path = "/mnt/c/Users/ohioset1/Documents/EmotiOn/elmas2/SRC/sc_elmas/ALIEN/"
        path = basePath + "/eval_imgs/"
        trackName = "face"
        pathOut = basePath + "/results"

    # print("[OPERATION] Running",path, trackName, pathOut)

    EvaluationModel = Evaluate(path, trackName, pathOut)

    tic = time()
    out_json = EvaluationModel.evaluation()
    duration = time() - tic
    # print('[OPERATION] crop & align time', duration)

    if not os.path.exists(EvaluationModel.save_path):
        print('[OPERATION] No faces found', EvaluationModel.save_path)
        return
    else:
        filename = os.path.join(path, trackName + '.json')

        print("[OPERATION] saving json", filename)
        tic = time()
        with open(filename, 'w') as fp:
            json.dump(out_json, fp)
            duration = time() - tic
            print("[OPERATION] saved json, duration", duration)

if __name__ == '__main__':
    main1(sys.argv)

