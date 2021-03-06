
## Get Details of Locations / getdetailsoflocations (internally `is.workflow.actions.properties.locations`)



### usage
```
getdetailsoflocations get=("Phone Number" | "State" | "Altitude" | "Name" | "Longitude" | "Country" | "City" | "Street" | "URL" | "Latitude" | "ZIP Code")
```

### arguments

---

### get: Get Property [(Docs)](https://pfgithub.github.io/shortcutslang/gettingstarted#enum-select-field)
**Allows Variables**: true



Accepts a string 
or variable
containing one of the options:

- `Phone Number`
- `State`
- `Altitude`
- `Name`
- `Longitude`
- `Country`
- `City`
- `Street`
- `URL`
- `Latitude`
- `ZIP Code`

---

### source json (for developers)

```json
{
	"ActionClass": "WFContentItemPropertiesAction",
	"ActionKeywords": [
		"geocode",
		"latitude",
		"longitude"
	],
	"Category": "Location",
	"CreationDate": "2015-01-22T08:00:00.000Z",
	"IconName": "Location.png",
	"Name": "Get Details of Locations",
	"WFContentItemClass": "WFLocationContentItem"
}
```
