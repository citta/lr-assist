The Live Report Assist Tool assists you in creating a live report thread on TeamLiquid.net. It is a HTML/JavaScript tool that runs on all mainstream browsers without previous configuration and installation.

MISSION STATEMENT

Live report threads are an important part of the SC2 community. Creating and updating a live report thread can be a tedious chore because it requires you to edit your post in multiple locations per update. The structure of your post can become confusing quickly and involves copy and pasting the same elements over and over again. This possibly deters community members from creating a live report thread which is unfortunate since these threads are often a hub for discussions.

The Live Report Assist Tool tries to assist you in this task whereever possible. You can set an input template and then put in map names, player names and scores in a user interface designed for live report threads. The tool will generate a processed output from your template which you can just copy and paste over to your post each time you update the scores.

FEATURES

- A user interface for live report threads. Supports "Recommended Games" polls and links to live report posts (textual description of games).
- This initial version supports the GSL/Swiss format, a popular format for SC2 tournaments and leagues, used e.g. in the World Championship Series. The tool will assign players to matches depending on their scores from previous matches.

WORKFLOW

1. Edit your template. Look at template.txt for an example. You will mostly need to only edit the upper part of the template (everything above the Results parts), as the other parts are all generated by the tool. The only part you will probably want to edit in the lower half is "advance to RO16!" with the appropriate next round.
2. Open gsl.html
3. Enter map names and map verbose names. The map verbose name is typically a link to the map, e.g. [url=http://www.teamliquid.net/tlpd/sc2-international/maps/479]Daybreak[/url]
4. Enter player names and player verbose names. The player verbose name is typically the TLPD'd name, e.g. [tlpd#players#1996#Z#hots]Stephano[/tlpd]
5. Create the "Recommended Games" polls on TeamLiquid.net (and backup the BBCodes in a text file as usually). Put the BBCodes into the "Recommended?" columns. Don't worry, the polls will only show up in your post, once the corresponding "Show" checkmark has been checked.
6. Click on the Apply button to create the post.
7. Update the scores. Click Apply every time you want your input processed.

BROWSER COMPATIBILITY

Tested on Chromium 26.0.1410.63 and Firefox 20.0.1. Should work on any other mainstream browser, too.

OTHER SOFTWARE

- Uses Silk Icons 1.3 http://www.famfamfam.com/lab/icons/silk/
- Uses FileSaver.js http://eligrey.com/demos/FileSaver.js/
