
## Get Group from Matched Text / getgroupfrommatchedtext (internally `is.workflow.actions.text.match.getgroup`)


## description

### summary

Gets the text that matched a particular capture group or all of the capture groups from the output of a Match Text action.


### usage
```
getgroupfrommatchedtext get=("Group At Index" | "All Groups") groupindex=number
```

### arguments

---

### get: Enumeration [(Docs)](https://pfgithub.github.io/shortcutslang/gettingstarted#enum-select-field)
**Default Value**: `"Group At Index"`
**Allows Variables**: true



Accepts a string 
or variable
containing one of the options:

- `Group At Index`
- `All Groups`

---

### groupindex: Number [(Docs)](https://pfgithub.github.io/shortcutslang/gettingstarted#number-field)
**Placeholder**: `1`
**Default Value**: `1`
**Allows Variables**: true

**Only enabled if**: argument WFGetGroupType != `All Groups`

		Accepts a number 
		or variable
		with a number.

---

### source json (for developers)

```json
{
	"ActionClass": "WFGetGroupFromMatchedTextAction",
	"ActionKeywords": [
		"finding",
		"matching",
		"searching",
		"regular",
		"expression",
		"regexp"
	],
	"Category": "Text",
	"CreationDate": "2016-05-23T07:00:00.000Z",
	"Description": {
		"DescriptionSummary": "Gets the text that matched a particular capture group or all of the capture groups from the output of a Match Text action."
	},
	"IconName": "Text.png",
	"Input": {
		"Multiple": true,
		"Required": true,
		"Types": [
			"WFTextMatch"
		]
	},
	"InputPassthrough": false,
	"Name": "Get Group from Matched Text",
	"Output": {
		"Multiple": true,
		"OutputName": "Group from Matched Text",
		"Types": [
			"NSString"
		]
	},
	"Parameters": [
		{
			"Class": "WFEnumerationParameter",
			"DefaultValue": "Group At Index",
			"Items": [
				"Group At Index",
				"All Groups"
			],
			"Key": "WFGetGroupType",
			"Label": "Get"
		},
		{
			"Class": "WFNumberFieldParameter",
			"DefaultValue": 1,
			"Key": "WFGroupIndex",
			"Label": "Group Index",
			"Placeholder": "1",
			"RequiredResources": [
				{
					"WFParameterKey": "WFGetGroupType",
					"WFParameterRelation": "!=",
					"WFParameterValue": "All Groups",
					"WFResourceClass": "WFParameterRelationResource"
				}
			],
			"TextAlignment": "Right"
		}
	],
	"Subcategory": "Text Editing"
}
```
