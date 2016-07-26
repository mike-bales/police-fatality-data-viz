civilians.df <- read.csv("~/Dropbox/Johns Hopkins/Summer 2016/Advanced Data Viz/police-fatality-data-viz/data/MPVDatasetDownload.csv", stringsAsFactors=FALSE)

civilians.df$death.date <- as.Date(civilians.df$death.date, format = "%m/%d/%y")
civilians.df$status <- "civilian"

police.violence <- rbind(civilians.df[,c("status","death.date")],leo.df[,c("status","death.date")])

write.csv(police.violence, file = "./polviol.csv", row.names = FALSE)
