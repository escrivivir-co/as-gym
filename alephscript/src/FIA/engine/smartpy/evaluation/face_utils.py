
import os
import cv2
import dlib
import glob
import numpy as np
from imutils import face_utils
from job import Job
from task import Task
from face import Face

def face_extraction(img_filelist, detector, sp, verbose = 1, show = False, path = "../results"):
    """
    Este método se encarga de encontrar las caras presentes en una o varias imágenes y devuelve
    los resultados de la búsqueda facial en formato (224,224,3) para ser analizadas posteriormente. 

    :param img_filelist: list. Lista de las imágenes contenidas en el directorio de búsqueda.
    :param detector: dlib object. Detector encargado de encontrar regiones de una imagen con un rostro. 
    :param sp: objeto dlib. Shape predictor se encarga de obtener los landmarks de la zona de interés indicada por detector.
    :param verbose: integer. 1 si se quiere recibir información acerca de los pasos ejecutados, 0 en silencio
    :param show: boolean. True/False si se quiere mostrar por pantalla el resultado (solo disponible en IDE)
    """
    save_path = path

    print("[INFO] Cola de landmarking:", len(img_filelist), "to:", path)

    job = Job()
    job.tasks = []
    for ii, f in enumerate(img_filelist):

        # Skip some known formats
        if (".json" in f):
            continue

        # if verbose == 1:
        print("[INFO] Imagen procesada:", ii, f)

        img = cv2.imread(f)
        dets = detector(img, 1)

        task = Task()
        task.file = f
        task.faces = []
        print("[LOG] [FACE_UTILS] Faces found", len(dets))
        for i, d in enumerate(dets):

            face = Face()
            face.id = str(i)
            # Se encuentran todos los landmarks para ser devueltos
            face.landmarks = (face_utils.shape_to_np(sp(img, d)))

            # Se encuentran los 5 landmarks principales encargados de alinear la cara encontrada.
            faces = dlib.full_object_detections()
            faces.append(sp(img, d))
            images = dlib.get_face_chips(img, faces, size=224)

            # Se guarda la imágen intermedia en memoria
            if not os.path.exists(save_path):
                os.mkdir(save_path)
            # Se guarda la imagen en formato .jpg
            fileName = os.path.join(save_path, f.split('/')[-1].split('.')[0] + '_' + str(i) + '.jpg')
            # print("[LOG] [FACE_UTILS]", fileName)
            cv2.imwrite(fileName, images[0])

            face.file = fileName

            if show:
                cv2.imshow("cropped_aligned", images[0])
                cv2.waitKey(0)
                cv2.destroyAllWindows()

            face.matrix = images[0]
            task.faces.append(face)
        job.tasks.append(task)

    return job

def calculate_mean_image(img_filelist, save_path, save = True, show = False):
    """
    This method inputs a list of face image files and calculates its mean image.
    
    :param img_filelist: list of strings. List of paths to fetch facial images
    :param save_path: string. Path to store the resulting mean image.
    :param save: boolean. In case you want to save the resulting image to memory.
    :param show: boolean. If set True, you get visual evidences of the resulting mean image after storing it to memory.
    """
    
    # This could be changed. In here we assume that we have stored our images in multiple folders (different labels in my case)
    img_filelist = glob.glob(save_path + '*/*')
    value = np.zeros((224,224,3))
    
    # Resize and add up.
    for ii, file in enumerate(img_filelist):
        im = cv2.imread(file)
        im = cv2.resize(im, (224,224))
        value += im
        # print(ii)
    
    # Take the mean.
    value = value / len(img_filelist)
    mean_img = value.astype(np.uint8)
    
    # Save the resulting image
    if save:
        if not os.path.exists(save_path):
            os.mkdir(save_path)    
        cv2.imwrite(save_path + 'mean_image.jpg',mean_img)
    
    # Show results
    if show:
        cv2.imshow("mean image", mean_img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        
    return mean_img