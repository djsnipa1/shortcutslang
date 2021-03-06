
## Scan QR/Bar Code / scanqrbarcode (internally `is.workflow.actions.scanbarcode`)

> This action requires that Shortcuts has permission to use WFUserInteractionResource,WFCameraAccessResource.


## description

### summary

Scans a QR code or bar code using the camera, and returns the text/URL that is found.


### usage
```
scanqrbarcode 
```

### arguments

---



---

### source json (for developers)

```json
{
	"ActionClass": "WFScanMachineReadableCodeAction",
	"Category": "Text",
	"Description": {
		"DescriptionSummary": "Scans a QR code or bar code using the camera, and returns the text/URL that is found."
	},
	"IconName": "QRCode.png",
	"LastModifiedDate": "2015-01-11T06:00:00.000Z",
	"Name": "Scan QR/Bar Code",
	"Output": {
		"Multiple": false,
		"OutputName": "QR/Bar Code",
		"Types": [
			"AVMetadataMachineReadableCodeObject"
		]
	},
	"RequiredResources": [
		"WFUserInteractionResource",
		"WFCameraAccessResource"
	],
	"ShortName": "Scan Bar Code",
	"UnsupportedEnvironments": [
		"Extension"
	],
	"UserInterfaces": [
		"UIKit"
	]
}
```
