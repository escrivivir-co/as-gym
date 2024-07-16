class AlephScriptIDE:
    def __init__(self):
        self.current_state = "crear proyecto"
        self.project_name = ""
        self.calculator_operations = []

    def create_project(self):
        print("Estado actual: crear proyecto")

        # Solicitar el nombre del proyecto
        self.project_name = "Calculadora"

        print(f"Nombre del proyecto: {self.project_name}")

        # Solicitar las operaciones de la calculadora
        self.calculator_operations = ["sumar", "restar", "multiplicar", "dividir"]

        print("Operaciones de la calculadora:")
        for operation in self.calculator_operations:
            print(f"- {operation}")

        # Cambiar al estado "diseñar proyecto"
        self.current_state = "diseñar proyecto"
        print("Cambiando al estado: diseñar proyecto")

    def design_project(self):
        print("Estado actual: diseñar proyecto")

        # Lógica para diseñar el proyecto

        # Cambiar al estado "construir proyecto"
        self.current_state = "construir proyecto"
        print("Cambiando al estado: construir proyecto")

    def build_project(self):
        print("Estado actual: construir proyecto")

        # Lógica para construir el proyecto

        # Cambiar al estado "ejecutar proyecto"
        self.current_state = "ejecutar proyecto"
        print("Cambiando al estado: ejecutar proyecto")

    def run_project(self):
        print("Estado actual: ejecutar proyecto")

        # Lógica para ejecutar el proyecto
        print("El proyecto de la calculadora está en funcionamiento.")
        print("Puedes realizar cálculos utilizando las operaciones definidas.")


ide = AlephScriptIDE()
ide.create_project()
ide.design_project()
ide.build_project()
ide.run_project()