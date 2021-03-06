
## Make HTML from Rich Text / makehtmlfromrichtext (internally `is.workflow.actions.gethtmlfromrichtext`)


## description

### summary

Converts the rich text passed as input to HTML text.


### output

HTML

### usage
```
makehtmlfromrichtext makefulldocument=(true | f alse | variable)
```

### arguments

---

### makefulldocument: Switch [(Docs)](https://pfgithub.github.io/shortcutslang/gettingstarted#switch-or-expanding-or-boolean-fields)
**Allows Variables**: true



Accepts a boolean
or a variable.

---

### source json (for developers)

```json
{
	"ActionClass": "WFHTMLFromRichTextAction",
	"ActionKeywords": [
		"page",
		"source",
		"web",
		"get"
	],
	"Category": "Text",
	"Description": {
		"DescriptionResult": "HTML",
		"DescriptionSummary": "Converts the rich text passed as input to HTML text."
	},
	"IconName": "RichText.png",
	"Input": {
		"Multiple": false,
		"Required": true,
		"Types": [
			"WFRichTextContentItem"
		]
	},
	"Name": "Make HTML from Rich Text",
	"Output": {
		"Multiple": false,
		"OutputName": "HTML from Rich Text",
		"Types": [
			"NSString"
		]
	},
	"Parameters": [
		{
			"Class": "WFSwitchParameter",
			"Description": "This indicates whether or not this action writes out an entire HTML document. If this is turned off, partial HTML will be returned if possible.",
			"Key": "WFMakeFullDocument",
			"Label": "Make Full Document"
		}
	],
	"ShortName": "Make HTML",
	"Subcategory": "Rich Text"
}
```
