import numpy as np
import cv2
import onnxruntime

class Deep_emotion():
    """
    Clase encargada de implementar los métodos deep para la evaluación/inferencia del modelo.
    """
    def __init__(self, config):
        """
        Inicialización de la estructura y carga de los pesos del modelo deep a implementar.
        """
        self.num_classes = config['architecture']['num_classes']
        self.experiment = config['architecture']['experiment']
        self.batch_size = config['evaluation']['batch_size']
        self.mean_img_path = config['evaluation']['mean_img_path']
        self.weights_path = config['general']['weights_path']
        self.onnx_path = config['general']['onnx_path']
        self.verbose = config['general']['verbose']

        if self.experiment == 12 or self.experiment == 22:
            # if self.verbose == 1:
            #    print('[INFO] Cargando mean image')
            self.mean_image = cv2.imread(self.mean_img_path)
            self.mean_image = self.mean_image / 255

            self.sess = onnxruntime.InferenceSession(self.onnx_path)

    def image_generator(self, images_np, bs, experiment, mean_image):
        """
        Método generador de imágenes para alimentar al modelo

        :param images: list. Lista de imágenes calculadas.
        :param bs: integer. Batch size
        :param experiment: Integer. Opciones de última capa y preprocesado.
        :param mean_image: Imagen resultado de hacer la media de todo el dataset de training.
        """

        while True:
            # Se inicializan las imagenes y las anotaciones
            images = []

            # Se itera hasta llegar al límite de batch size o fin de imágenes
            for img in images_np:

                if len(images) >= bs:
                    break

                # Se extrae y se adapta la imagen en el rango [0-1]
                image = img
                image = cv2.resize(image, (224,224))
                image = image / 255

                # Se substrae la imagen media.
                if experiment == 12 or experiment == 22:
                    image = image - mean_image

                # Se actualiza el batch con la nueva imagen
                images.append(image)

                # Uncomment to work with RTSP.feature Evaluator2
                self.interferences = images

            # Se devuelve el array de imágenes a procesar ya preparado
            yield np.array(images)

    def evaluation(self, images):
        """
        Método Deep Learning para detección emocional.

        :param images: Array de uint8. OJO NO FUNCIONA CON UNA LISTA DE Imágenes de rostros cargados en memoria para su análisis emocional.
        """
        print("Predicting for number of faces:", len(images))

        testGEN = self.image_generator(images, self.batch_size, self.experiment, self.mean_image)

        input_name = self.sess.get_inputs()[0].name
        label_name = self.sess.get_outputs()[0].name

        self.predictionInferedList = self.sess.run([label_name], { input_name: next(testGEN).astype(np.float32) })

        self.predictionMaxList = np.argmax(self.predictionInferedList[0], axis=1)

