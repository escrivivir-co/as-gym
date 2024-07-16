class Face():

    def __init__(self):
        self.file = ""
        self.id = 0
        self.landmarks = []
        self.matrix = []
        self.predictionMax = 0
        self.predictionInfered = []
        self.evaluated = []
        self.interference = {}
