// Efecto de texto escrito para el terminal
document.addEventListener('DOMContentLoaded', function() {
    const text = "Iniciando Aleph MCP...\n\n> Conexión establecida con el Protocolo de Contexto del Modelo (MCP).\n> Herramientas expandidas cargadas correctamente.\n> Asistente de Novelista inicializado.\n> Sistema listo para comunicación bidireccional.\n\nAleph MCP es un protocolo avanzado que expande las capacidades de los agentes de IA en entornos de desarrollo, permitiendo una comunicación más rica y profunda entre los modelos de lenguaje y sus entornos.\n\n¿Listo para descubrir todo su potencial?";
    
    const typedTextElement = document.getElementById('typed-text');
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            if (text.charAt(i) === '\n') {
                typedTextElement.innerHTML += '<br>';
            } else {
                typedTextElement.innerHTML += text.charAt(i);
            }
            i++;
            
            // Velocidad variable para efecto más realista
            let speed = Math.floor(Math.random() * 10) + 20;
            // Pausa más larga después de un punto o salto de línea
            if (text.charAt(i-1) === '.' || text.charAt(i-1) === '\n') {
                speed = 300;
            }
            
            setTimeout(typeWriter, speed);
        }
    }
    
    // Retraso inicial para dar tiempo a que la página se cargue correctamente
    setTimeout(typeWriter, 500);
});

// Función para copiar código
function copyCode() {
    const codeBlock = document.querySelector('.code-block pre code');
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const copyButton = document.querySelector('.copy-button');
        const originalText = copyButton.textContent;
        
        copyButton.textContent = 'Copiado!';
        copyButton.style.backgroundColor = 'rgba(39, 201, 63, 0.2)';
        copyButton.style.borderColor = '#27c93f';
        
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.style.backgroundColor = '';
            copyButton.style.borderColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar el texto: ', err);
    });
}

// Animación de desplazamiento suave para los enlaces de navegación
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    for (const link of links) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Efecto parallax para el fondo de estrellas
window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const starsLayer = document.querySelector('.stars');
    const twinklingLayer = document.querySelector('.twinkling');
    
    starsLayer.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    twinklingLayer.style.transform = `translateY(${scrollPosition * 0.05}px)`;
});

// Detección de visibilidad para activar animaciones
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    const animatedElements = document.querySelectorAll('.feature, .step');
    animatedElements.forEach(el => {
        observer.observe(el);
        el.classList.add('animated');
    });
});
