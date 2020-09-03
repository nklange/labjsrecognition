library(rjson)

items <- read.delim("items.txt",header=F,col.names = "Items")
itemsn <- toJSON(items, indent=0, method="C" )
write(itemsn, "items.json")
