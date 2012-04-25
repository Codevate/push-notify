/**
 * Sender pour le protocole apn (iDevices)
 */

var deferred = require("deferred"),
    config = require("../../../config/config").config,
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
         cert: config.sender.apn.cert,                 /* Certificate file */
         key:  config.sender.apn.key,                  /* Key file */
         gateway: config.sender.apn.gateway,               /* gateway address */
         port: config.sender.apn.port                                       /* gateway port */
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