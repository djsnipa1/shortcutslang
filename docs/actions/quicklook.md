
## Quick Look / quicklook (internally `is.workflow.actions.previewdocument`)

> This action requires that Shortcuts has permission to use WFUserInteractionResource.


## description

### summary

Displays a preview of the input.


### usage
```
quicklook fullscreen=(true | f alse | variable)
```

### arguments

---

### fullscreen: Switch [(Docs)](https://pfgithub.github.io/shortcutslang/gettingstarted#switch-or-expanding-or-boolean-fields)
**Allows Variables**: true

**Only enabled if**: Device attributes match `{"WFDeviceAttributeIdiom":"Pad"}` This action is always enabled inside Shortcutslang.

Accepts a boolean
or a variable.

---

### source json (for developers)

```json
{
	"ActionClass": "WFQuickLookAction",
	"ActionKeywords": [
		"preview",
		"show",
		"file",
		"document",
		"quicklook",
		"quick",
		"look"
	],
	"Category": "Documents",
	"Description": {
		"DescriptionSummary": "Displays a preview of the input."
	},
	"IconName": "Quick Look.png",
	"Input": {
		"Multiple": true,
		"Required": true,
		"Types": [
			"public.data"
		]
	},
	"InputPassthrough": true,
	"Name": "Quick Look",
	"Parameters": [
		{
			"Class": "WFSwitchParameter",
			"Key": "WFQuickLookActionFullScreen",
			"Label": "Full Screen",
			"RequiredResources": [
				{
					"WFDeviceAttributes": {
						"WFDeviceAttributeIdiom": "Pad"
					},
					"WFResourceClass": "WFDeviceAttributesResource"
				}
			]
		}
	],
	"RequiredResources": [
		"WFUserInteractionResource"
	],
	"Subcategory": "Previewing",
	"UserInterfaces": [
		"WatchKit",
		"UIKit"
	]
}
```
