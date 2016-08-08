library(stringr)
library(rvest)

## Get URL for each officer

href <- c()

for (i in seq(0,450,25)) { 
  
tmp <- paste0('https://www.odmp.org/search?from=2013&to=2016&filter=nok9&o=',i) %>%
       read_html() %>%
       html_nodes('#secondary-layout-one-column-body td+ td a') %>%
       html_attr('href')
  
href <- c(href, tmp)
}

## Get "Bio & Incident Details" from officer memorial page ##

# Function to split memorial section and return a single element of choice
memsplit <- function(x) {
  strsplit(odmp %>% html_node('#memorial_featuredInfo_right') %>% html_text(), "\n\t\t\t\t\t\t")[[1]][x]
}

all_bio <- list()
for (k in 1:length(href)) {
odmp <- read_html(href[k])
bio <- data.frame(rank = memsplit(2), 
         name = memsplit(3),       
         department = memsplit(4),
         death.date = str_trim(strsplit(strsplit(memsplit(5), '\t\t\t\t\t')[[1]][1],':')[[1]][2]),
         summary = strsplit((odmp %>% html_node('#memorial_featuredBody_right p:nth-child(1)') %>% html_text()),'\n')[[1]][1],
         stringsAsFactors = FALSE
         )
         

i = 0 
j = length(bio) + 1
repeat {
      i = i + 1
  
      node <- html_node(odmp, paste0("p:nth-child(", i+1,")"))
      if (is.na(html_text(node))) {break}
      varPair <- strsplit(html_text(node),":")
      if (!is.na(varPair[[1]][2])) {
       bio[j] <- str_trim(varPair[[1]][2])
       names(bio)[j] <- varPair[[1]][1]
       j = j + 1 
      }
     } 
    all_bio[k] <- list(bio)
    }

leo.df <- Reduce(function(...) merge(..., all=TRUE), all_bio)

#format date
leo.df$death.date <- as.Date(leo.df$death.date, format = "%A, %B %d, %Y")

#create civilian or LEO status
leo.df$status <- "leo"
