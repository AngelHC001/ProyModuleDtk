# ProyModuleDTK
Denominado como el Modulo de Carga de Archivos de Datametrika
El propósito general de este pequeño proyecto es la carga de constancias para su posterior visualización y descarga.

Al ser un proyecto con menor cantidad de usuarios y objetos complejos, tomé la decisión de estructurar los datos basados en archivos JSON.

Este modulo sirve a la ProyDatametrika en su sección 'Acceso a Constancias.'

Las mecánicas de este pequeño sistema consisten en:
- Crear y Borrar Carpetas.
- Introducir archivos en las carpetas creadas.
- Manejo de usuarios (Alta, Baja y cambio de contraseña.)

## Entorno de desarrollo
React + Vite: Framework JavaScript Basado en componentes. Conociendo las variantes que tiene esta biblioteca, El entorno elegido es React+Vite.

Bluehost: Webhost compartido manejado por Datametrika, no se requirió ningún ajuste especifico para alojar paginas no_Wordpress.

Backend PHP: Es en este proyecto donde se los archivos PHP forman
parte en una carpeta por separado sin que este se integre dentro
de React.

## Archivos para Pruebas locales
- Una carpeta doc-point con la estructura de almacenamiento, certificados de prueba, directorios JSON y variables globales (config.php)
- config.php se localiza en la raiz para pruebas locales, este archivo debe estar en doc-point en modo produccion. 
- El archivo ProyModuleDTK.pdf alojado contiene notas de desarrollador, dependencias y estructura del proyecto. Se recomienda crear un proyecto React+Vite vacio primero.
- El ManualModule.pdf es el manual de usuario de la página final, contiene capturas del trabajo realizado.

## Experiencias:
- Diseñe e implemente de una API REST para facilitar una comunicación fluida entre la interfaz de usuario y el servidor, permitiendo el intercambio estructurado mediante formato JSON.
- Comprendi como los protocolos de transferencia impactan en la respuesta del sistema hacia el usuario final.
- Desarrollé mecanismos básicos de autenticación y la validación de entrada de datos, no obstante  Seguridad Informatica es mi area de mejora.


