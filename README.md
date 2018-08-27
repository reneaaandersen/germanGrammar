First of all do notice that this is built around danish/german word pairs because I myself is a danish speaker. 

This is a small project that I made to help myself pratice my german vocabulary and partially my german grammar. There are 3 main groups of quizes nouns, verbs and prepositions. 

For nouns you can chose to pratice translating from danish to german singular/plural to build your vocabulary or you can go a bit more advanced and also pratice singular nominative/genitive and plural nominative/dative which should cover most variance points.
For verbs there is the possibility to translate from danish to german infinitiv. You can also pratice infinitiv, 3rd person present, 3rd person past, konjunktive and the help verb + partizip II.
Prepositions is just a quiz where we can pratice what case is forced with the given preposition.

The .lists folder contains word lists that can be used to generate your own database of words. The words are all scraped from an XML snapshot from de.wiktionary.org and usually crossreferenced with de_50k.txt list which is a list of german words and their occurences in a bunch of subtitles.
- 500Adverbs.txt: 			A list of adverbs sorted by their appearence count in the subtitle list
- 2500GermanAdjectives.txt: A list of adjectives sorted by their appearence count in the subtitle list
- 2500GermanNouns.txt:		A list of nouns sorted by their appearence count in the subtitle list. Note that this one is formed as SQL queries, because I used it to insert into the word database.
- 3000GermanVerbs.txt: 		A list of verbs and conjugations sorted by their appearence count in the subtitle list
- allGermanAdjectives.txt:  The raw scrape of adjectives from the XML file
- allGermanNouns.txt:  		The raw scrape of nouns from the XML file
- allGermanVerbs.txt:  		The raw scrape of verbs from the XML file
- baseNouns.txt:			A list of nouns that are postfixes of other nouns. This list is nowhere near perfect, due to matching every noun as a postfix and some nouns like "ache" would match irrelevant words (like sprache, rache). 
- prepositions.txt: 		A list of prepositions sorted by their appearence count in the subtitle list
- SQLQueries.txt:			Some helpful queries if you use the given database (german.sql)

The database is quite incomplete as far as danish -> german word pairs and tags for words to put them into groups.