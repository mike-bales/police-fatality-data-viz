## Get URL for each officer on one search page

search.page <- read_html('https://www.odmp.org/search?name=&agency=&state=&from=2013&to=2016&cause=&filter=nok9')

nodes <- html_nodes(search.page, '#secondary-layout-one-column-body td+ td a')

href <- nodes %>% 
        html_attr('href') %>%



## Get "Bio & Incident Details" from officer memorial page ##
all_bio <- list()
for (k in 1:length(href)) {
odmp <- read_html(href[k])
bio <- list(rank = odmp %>% html_node('h4') %>% html_text(), 
            name = odmp %>% html_node('h3') %>% html_text(),       
            memorial = odmp %>% html_node('#memorial_featuredInfo_right') %>% html_text())

i = 0 
j = length(bio) + 1
repeat {
      i = i + 1
  
      node <- html_node(odmp, paste0("p:nth-child(", i+1,")"))
      if (is.na(html_text(node))) {break}
      varPair <- strsplit(html_text(node),":")
      if (!is.na(varPair[[1]][2])) {
       bio[j] <- varPair[[1]][2]
       names(bio)[j] <- varPair[[1]][1]
       j = j + 1
      }
     } 
    all_bio[k] <-list(bio)
    }

all_bio 
