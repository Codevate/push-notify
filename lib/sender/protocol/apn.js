/**
 * Sender pour le protocole apn (iDevices)
 */

var deferred = require("deferred"),
apns = require("apn"),
sender = {};

/**
 * Connexion apn
 */
sender.connection = null;

/**
 * Initialisé
 */
sender.initialized = false;

/**
 * Initialisation du sender
 */
sender.initialize = function()
{
   if(this.initialized)
   {
      return ;
   }
   
   var options = {
         cert: './conf/apn/cert.pem',                 /* Certificate file */
         key:  './conf/apn/key.pem',                  /* Key file */
         gateway: 'gateway.push.apple.com',               /* gateway address */
         port: 2195                                       /* gateway port */
   };

   this.connection = new apns.Connection(options);
   
   this.initialized = true; 
};

/**
 * Envoi d'une notification
 * @param object data
 * @return promise
 */
sender.send = function(data)
{
   this.initialize();
   
   var d = deferred(), notification = new apns.Notification(), device = new apns.Device(data.token);
   
   if(typeof data.badge !== "undefined" && data.badge)
   {
      notification.badge = data.badge;
   }
   
   if(typeof data.sound !== "undefined" && data.sound)
   {
      notification.sound = data.sound;
   }
   
   if(typeof data.alert !== "undefined" && data.alert)
   {
      notification.alert = data.alert;
   }
   
   if(typeof data.payload !== "undefined" && data.payload)
   {
      notification.payload = data.payload;
   }
   
   notification.device = device;
   
   this.connection.sendNotification(notification);

   d.resolve();

   return d.promise;
};

exports.sender = sender;