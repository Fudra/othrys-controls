# Othrys Controls

Ein Projekt, dass an der HTW Berlin im Rahmen des Kurses AudioVideo Technik des Studiengangs Angewandte Informatik entstanden ist.

## Beschreibung

Das Projekt stellt eine DJ-Anwendung  mit 3-Band-Equilizer dar, die mit der Web-Audio-Api arbeitet. 

Es können zwei Audiotracks per Drag'n'Drop in die Anwendung eingespielt werden, diese wiederum Kontrolliert und durch einfache
filter wie Hochpass, Bandpass und Lowpass manipuliert werden können.

Der Audio-Datenstrom wird Grafisch dargestellt.

## Unterstützende Technologien

### Server
Für die Projektumsetzung wurde ein einfacher Node Server aufgesetzt, der die Applikation ausliefert, und auch die Hochgeladenen Audiofiles entgegen nimmt.

### HTML
Für das Verfachen des HTML Codes wird die Render-Engine  JADE benutzt, die zur laufzeit gerendert und an den
Clienten ausgeliefert wird.

### CSS
Beim CSS wird auf SASS/ SCSS gesetzt um das CSS in Komponenten aufzuteilen.  Die einzelenen SCSS /SASS Dateien werden dann
per Gulp zusammengebaut.


## Installation / Start

Es wird eine Aktuelle Node, npm und bower Version benötigt.

Um alle Nötigen Dependencies zu installieren, auf der Commandozeile

    npm install
    bower install
    
ausführen.

Den Server wird mit

    npm start
    
gestartet.


    
