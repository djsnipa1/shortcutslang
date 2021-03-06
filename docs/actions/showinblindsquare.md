
## Show in BlindSquare / showinblindsquare (internally `is.workflow.actions.showinblindsquare`)

> This action requires that Shortcuts has permission to use WFURLOpenResource,[object Object].


## description

### summary

Opens BlindSquare showing information about the place passed as input, so you can save it as a favorite, start tracking it, or start simulation mode.


### usage
```
showinblindsquare startsimulation=(true | f alse | variable)
```

### arguments

---

### startsimulation: Switch [(Docs)](https://pfgithub.github.io/shortcutslang/gettingstarted#switch-or-expanding-or-boolean-fields)
**Allows Variables**: true



Accepts a boolean
or a variable.

---

### source json (for developers)

```json
{
	"ActionClass": "WFShowInBlindSquareAction",
	"AppIdentifier": "com.mipsoft.blindsquare",
	"Category": "Location",
	"CreationDate": "2015-08-20T07:00:00.000Z",
	"Description": {
		"DescriptionSummary": "Opens BlindSquare showing information about the place passed as input, so you can save it as a favorite, start tracking it, or start simulation mode."
	},
	"Input": {
		"Multiple": false,
		"Required": true,
		"Types": [
			"CLLocation",
			"MKMapItem"
		]
	},
	"InputPassthrough": true,
	"Name": "Show in BlindSquare",
	"Parameters": [
		{
			"Class": "WFSwitchParameter",
			"DefaultValue": false,
			"Key": "WFBlindSquareSimulation",
			"Label": "Start Simulation"
		}
	],
	"RequiredResources": [
		"WFURLOpenResource",
		{
			"AppIdentifier": "com.mipsoft.blindsquare",
			"WFResourceClass": "WFAppInstalledResource"
		}
	],
	"ShortName": "Show BlindSquare",
	"Subcategory": "Maps"
}
```
