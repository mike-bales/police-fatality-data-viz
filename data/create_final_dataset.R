civilians.df <- read.csv("~/Dropbox/Johns Hopkins/Summer 2016/Advanced Data Viz/police-fatality-data-viz/data/MPVDatasetDownload.csv", stringsAsFactors=FALSE)

civilians.df$death.date <- as.Date(civilians.df$death.date, format = "%m/%d/%y")
civilians.df$status <- "civilian"

names(leo.df) <- tolower(names(leo.df))

common.vars <- c("status","death.date","name","age","cause","summary")

police.violence <- rbind(civilians.df[,common.vars],leo.df[,common.vars])

names(police.violence)[2] <- "deathDate" 

write.csv(police.violence, file = "./polviol.csv", row.names = FALSE)
