# Change Log
This project does not adhere to any specific versioning system, it will always be deployed as a "latest" version.
However, it does help to have a coherent, chronological change log.

## 7/11/2023
- Added ship editing.

## 7/10/2023
- Adjusted limits for some inputs. Most notably, removed the hard cap of 12 for level.
- Fix typo

## 6/22/2023
- Update to newest game version
- Use local files instead of CDN files for scripts etc., which should minimize obscure network errors or random blocked scripts. Should also make it viable to run the editor offline as long as all the correct files are downloaded.

## 4/23/2023
- Fix the label of the thickness field incorrectly displaying 'Height' instead of 'Thickness'

## 4/20/2023
- Fix the editor not correctly clearing its state after loading a new save when one was already loaded. This was causing things like flags to incorrectly get copied from the first save to the new save.
- Add tons of missing flags
- Display more details when encountering unhandled errors

## 3/21/2023
- Fix an array description not accounting for some modifiers
- Remove references of inventory editing (not planned)

## 3/14/2023
- Add suggestions/autocomplete support, enabled for color fields

## 3/12/2023
- Add tooltip support to groups and labels

## 3/11/2023
- Add more tail editing
- Reorder some groups/fields to make flow more cohesive
- Solve some element id conflicts
- Add wiki content

## 3/5/2023
- Remove unrelated properties from flags list
- Set empty flags to "undefined" instead of "null"
- Add background color when hovering over flags and a separator to improve readability
- Implement change log view in editor
- Rename 'about' modal to menu and separate data into tabs

## 3/4/2023
- Re-design the internals of the editor's input field systems
- Add missing id attributes to as many fields as possible
- Change some elements that behaved like a button to an actual button
- Adjust group vertical margins for mobile
- Add a dynamic, unobtrusive "notification" when the editor is broken due to game updates
- Bump --> 0.9.042

## 3/3/2023
Bump 0.9.039 --> 0.9.040 --> 0.9.041
