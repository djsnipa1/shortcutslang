
## Translate Text with Microsoft / translatetextwithmicrosoft (internally `is.workflow.actions.text.translate`)


## description

### summary

Translates the text passed into the action into another language.


### note

Powered by Microsoft Cognitive Services (microsoft.com/cognitive-services). Your text input will be sent to Microsoft to translate your request.


### usage
```
translatetextwithmicrosoft from=("string" | variable)] to=("string" | variable)]
```

### arguments

---

### from: Translate Language Picker [(Docs)](https://pfgithub.github.io/shortcutslang/gettingstarted#other-fields)
**Allows Variables**: true



		Accepts a string or variable containing the option. Check the shortcuts app for a list of available options. 

---

### to: Translate Language Picker [(Docs)](https://pfgithub.github.io/shortcutslang/gettingstarted#other-fields)
**Allows Variables**: true



		Accepts a string or variable containing the option. Check the shortcuts app for a list of available options. 

---

### source json (for developers)

```json
{
	"ActionClass": "WFTranslateTextAction",
	"ActionKeywords": [
		"microsoft",
		"bing",
		"translation",
		"language"
	],
	"Category": "Text",
	"CreationDate": "2015-02-19T08:00:00.000Z",
	"Description": {
		"DescriptionNote": "Powered by Microsoft Cognitive Services (microsoft.com/cognitive-services). Your text input will be sent to Microsoft to translate your request.",
		"DescriptionSummary": "Translates the text passed into the action into another language."
	},
	"IconName": "Translate.png",
	"Input": {
		"Multiple": true,
		"Required": true,
		"Types": [
			"NSString"
		]
	},
	"InputPassthrough": false,
	"Name": "Translate Text with Microsoft",
	"Output": {
		"Multiple": true,
		"OutputName": "Translated Text",
		"Types": [
			"NSString"
		]
	},
	"Parameters": [
		{
			"Class": "WFTranslateTextLanguagePickerParameter",
			"Key": "WFSelectedFromLanguage",
			"Label": "From",
			"LanguageDetection": true
		},
		{
			"Class": "WFTranslateTextLanguagePickerParameter",
			"Key": "WFSelectedLanguage",
			"Label": "To"
		}
	]
}
```
