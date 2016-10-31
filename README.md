# PC Soft Webdev
Ejemplo con la integración al Webservice de Timbox

Se deberá importar la URL del WSDL en la sección de Webservices, para hacer uso de las instancias

- [Timbox Pruebas](https://staging.ws.timbox.com.mx/timbrado/wsdl)

- [Timbox Producción](https://sistema.timbox.com.mx/timbrado/wsdl)


Para almacenar las credenciales se puede usar un archivo .INI y recuperarlas de la siguiente forma

```
username is string = INIRead("WS","user_name","",fWebDir()+"\Configuraciones.ini")
password is string = INIRead("WS","password","",fWebDir()+"\Configuraciones.ini")
```

##Timbrar CFDI
Para consumir el método de timbrar_cfdi, es necesario enviar las credenciales asignadas, y enviar el xml del cfdi a timbrar convertido a cadena en base64, como se muestra en seguida:
```
xmlfilePath is string = fWebDir() + "\example.xml"
sxml is string  = fLoadText(xmlfilePath)

//Quitar saltos de linea
sxml = Replace(sxml,Charact(10),"")
sxml_base64 is string = Replace(Crypt(sxml, "",cryptNone,encodeBASE64),CR,"")
```

Para enviar a timbrar solo es necesario crear un objeto del tipo timbrar_cfdi_result para obtener la respuesta del servicio, y hacer el llamado al método timbrar_cfdi desde el objeto `Service`

```
//Crear el objeto cfdi_result para obtener la respuesta
response is service.timbrar_cfdi_result

//llamar el método timbar_cfdi del webservice
response = service.Timbrar_CFDI(user_name,password, sxml_base64)
IF ErrorOccurred THEN
	ErrorResponse is string = ErrorInfo(errFullDetails)
ELSE
	sxml = StringToUTF8(response.xml..Value)
END
```


##Cancelar CFDI
Para enviar un CFDI a cancelar es necesario enviar las credenciales asignadas, el RFC del Emisor, el UUID del CFDI a cancelar, el archivo PFX convertido a una cadena en base64 y el password del archivo PFX.

Para agregar un UUID basta con instanciar un objeto de tipo `uuid` de la siguiente forma:
```
//uuid a cancelar
suuid is string = "123D441C-ABC5-45E2-FRE3-E517FAAF8XYZ"
my_uuid is uuid
my_uuid.uuid = suuid
```

Para convertir el archivo PFX a una cadena en base64 se requiere hacer uso de la función `Crypt`:
```
//Leer y convertir el archivo pfx en base64
pfx_file_path is string = fWebDir() + "\archivo.pfx"
sBufPfxfile is string = fLoadText(pfx_file_path)
pfxBase64 is string = Crypt(sBufPfxfile,"",cryptNone,encodeBASE64)
pfxBase64 = Replace(pfxBase64,CR,"")
```

Teniendo toda la información necesaria se crea la petición de cancelación de la misma manera como se menciono antes:

```
//declaración del objetos cancela_cfdi_result para obtener la respuesta de la cancelación
response is service.cancelar_cfdi_result

//llamar el método cancelar_cfdi
response = service.Cancelar_CFDI(user_name, password, RFC, my_uuid, pfxBase64, "12345678a")	

IF ErrorOccurred THEN
	RESULT False
ELSE
	sCancelados is string = response.comprobantes_cancelados
	xmlcancelado is xmlDocument
	xmlcancelado = XMLOpen(sCancelados,fromString)
  //se obtiene el estatus y el acuse
  estatus is string = xmlcancelado.comprobante_cancelado.cancelado..Text
	acuse is string = response.acuse_cancelacion..Value	
END
```
