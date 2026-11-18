# Record Switcher

<!-- prettier-ignore-start -->

Type a few letters in the Switch record menu under the title of a page edit screen to jump to another page. You don't need to go back to the page tree. The same menu appears when you edit a layout, a site, a section, a widget or a menu, and lists others of that kind. It works with Capell Admin and has nothing to set up or switch on.

For pages, suggestions come in three groups. Related pages that share a site and a parent come first, then other pages on this site, then pages on other sites. Typing narrows the list by page name, parent names or public address. Every result shows its site and address, so two pages with the same name are easy to tell apart. For the other kinds, the most recently updated come first. Either way, ten results show at a time, and arrow keys and Enter choose one.

Save before you switch, because the menu doesn't save the item you're leaving. Once you save, the title above the menu updates to the new name. You only see items you're allowed to edit, and the menu stays hidden when there's nothing else to switch to. Pick a result and its edit screen opens, ready for your next change.

## What it does

Record Switcher lets you open another record of the same type without returning to its list page. It works on supported admin edit pages and keeps the current record title visible above a Switch record control. The control is hidden when no accessible alternatives exist.

## Switch records

1. While editing a record, select **Switch record** below its title.
2. Choose one of the suggested records or type a Page name, ancestor name or public path. Other resources use their declared searchable attributes.
3. Select a result to open its edit page. With the keyboard, use the arrow keys and **Enter** to choose a result. **Escape** returns focus to the switch control; **Tab** moves on without selecting.

The switcher returns up to ten results at a time. Page suggestions are grouped as Related, This site and Other sites, in that order. Each result retains its site, accessible ancestors and public URL. Other record types prefer recently updated records unless their resource defines different ordering.

## Good to know

- There is no separate settings page or permission for Record Switcher. Access to the destination edit page is still controlled by that resource's normal policy and permissions.
- The control only navigates to another record. It does not save the record you are leaving, so save or cancel current changes before switching.
- A resource can opt out of the switcher. If the normal page heading appears instead, return to the resource list or ask an administrator whether switching is enabled for that record type.
- An empty search result means no matching option was returned; it does not delete, hide, or modify any record.

Results are checked against the resource query and edit policy before being offered. Selecting a result checks access again and resolves a fresh edit URL. A deleted or newly inaccessible record leaves you on the current page.

---

For developers: see the [README](../README.md).

<!-- prettier-ignore-end -->
