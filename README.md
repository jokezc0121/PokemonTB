# PokemonTB
# Pokémon Team Builder

Aplicación web full-stack para crear, validar, analizar, guardar y compartir equipos de **Pokémon Champions**.

> Pokémon y Pokémon Champions son marcas de Nintendo, Creatures Inc. y GAME FREAK. Este es un proyecto académico sin fines comerciales y sin afiliación oficial.

## Tabla de contenido

1. [Contexto](#1-contexto)
2. [Problema](#2-problema)
3. [Objetivos](#3-objetivos)


---

## 1. Contexto

Pokémon Champions es el juego de combate de The Pokémon Company lanzado el 8 de abril de 2026 para Nintendo Switch y, desde junio de 2026, para iOS y Android. Está centrado solo en el combate: equipos de seis Pokémon, formatos de Combate Individual y Combate Doble, Megaevoluciones y modos Clasificatorio, Casual y Privado. Desde 2026 es el software oficial del circuito competitivo (VGC) y del Campeonato Mundial. Sus reglas cambian por temporadas mediante regulaciones que definen qué Pokémon y Megaevoluciones están permitidos.

Armar un equipo exige cruzar tipos, estadísticas, habilidades, movimientos, objetos y la regulación vigente. El juego no ofrece un lugar para documentar un equipo ni comparar sus versiones.

---

## 2. Problema

**Dispersión de la información y verificación manual de reglas en la construcción de equipos por jugadores competitivos de Pokémon Champions del circuito VGC, durante las regulaciones de la temporada 2026.**

Los jugadores competitivos de Pokémon Champions del circuito VGC consultan en fuentes separadas (wikis, hojas de cálculo, capturas de pantalla y notas personales) los tipos, las estadísticas base, las habilidades, los movimientos, los objetos y la regulación vigente que necesitan para definir un equipo. No existe un modelo de datos común que relacione estos elementos con un equipo concreto, ni un registro estructurado de los equipos de cada jugador, de sus versiones y de sus archivos asociados. La verificación de las reglas de cada regulación, el cálculo de debilidades y coberturas de tipo, la identificación de la estadística base más baja y el registro de cambios dependen de procedimientos manuales. Se desconoce qué datos y reglas representan un equipo legal según el formato y la regulación, de qué fuentes obtenerlos y mantenerlos actualizados, y qué información conservar para consultar, comparar y compartir cada equipo.

**Pregunta de investigación:** ¿Cómo representar, validar y analizar de forma integrada un equipo de Pokémon Champions según su formato y la regulación vigente, y conservar su configuración, versiones y archivos asociados?

---

## 3. Objetivos

### Objetivo general

Diseñar e implementar una aplicación web full-stack, con cliente y API REST desacoplados y persistencia dual (base de datos y sistema de archivos), que permita a jugadores de Pokémon Champions construir, validar, analizar, guardar y compartir equipos según el formato y la regulación vigente.

### Objetivos específicos

#### OE1

Modelar en una base de datos los usuarios, el catálogo de Pokémon, las regulaciones, los equipos, sus versiones y los metadatos de archivos.

- **Responde a:** No hay un modelo de datos común.

#### OE2

Cargar el catálogo desde una fuente pública (PokéAPI) y registrar la lista de Pokémon permitidos por regulación.

- **Responde a:** Se desconoce de qué fuentes obtener y mantener los datos.

#### OE3

Implementar la creación y edición de equipos de hasta seis integrantes con su configuración completa, y su validación en el servidor contra el formato y la regulación.

- **Responde a:** Verificación manual de reglas.

#### OE4

Calcular el análisis de debilidades y cobertura de tipos y recomendar Pokémon según la estadística base más baja del equipo.

- **Responde a:** Cálculo manual de debilidades y estadísticas.

#### OE5

Guardar los equipos con historial de versiones y los archivos subidos o generados en un sistema de ficheros, con sus metadatos en la base de datos.

- **Responde a:** No hay registro de versiones ni de archivos.

#### OE6

Implementar autenticación y control de rutas públicas y privadas, y permitir importar, exportar y compartir equipos.

- **Responde a:** La información del equipo no es consultable ni compartible.

---

