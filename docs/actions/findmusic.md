
## Find Music / findmusic (internally `is.workflow.actions.filter.music`)

> This action is not yet complete. Some arguments may be missing.

> This action requires that Shortcuts has permission to use WFAppleMusicAccessResource.



### usage
```
findmusic undefined=NotImplemented
```

### arguments

---

#### Filter * actions are not implemented yet.

---

### source json (for developers)

```json
{
	"ActionClass": "WFContentItemFilterAction",
	"AppIdentifier": "com.apple.Music",
	"Category": "Music",
	"CreationDate": "2015-01-22T08:00:00.000Z",
	"Input": {
		"Types": [
			"WFMPMediaContentItem",
			"WFAVAssetContentItem",
			"WFGenericFileContentItem"
		]
	},
	"Name": "Find Music",
	"RequiredResources": [
		"WFAppleMusicAccessResource"
	],
	"Subcategory": "Music",
	"WFContentItemClass": "WFMPMediaContentItem",
	"WFContentItemDefaultProperty": "Artist"
}
```
