## Configuration ESP32

   - Led pin 19
   - Photo resistor pin A0
   - Capteur Temperature  pin 23
   
   Il faut changer le ssid et le password dans le fichier net_misc pour que l'arduino se connecte à internet.
    
## To do

Pour pouvoir tester avec votre ESP, il faut effectuer quelques ajouts dans le fichier 'ui_lucioles.js'
* dans les variables 'chart1' et 'chart2' du fichier, il faut rajouter votre nom ainsi que votre adresse MAC dans l'attribut 'series' et une couleur dans l'attribut 'colors'
* il faut également rajouter votre nom et votre adresse MAC respectivement dans les variables 'forenames' et 'which_esps'    

## Install

    $ git clone https://github.com/YannickCardini/IOT
    $ cd IOT
    $ npm install

## Running the project

    $ node node_lucioles_v2.js

## BUG

   - Si votre esp bloque et affiche plusieurs fois : "Attempting MQTT connection..."
   - Il faut modifier -> if(client.connect("Thomas", "try", "try")) { // Attempt to connect  "Thomas" par un autre nom d'utilisateur
