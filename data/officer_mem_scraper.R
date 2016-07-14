## Get URL for each officer on one search page

search.page <- read_html('https://www.odmp.org/search?name=&agency=&state=&from=2013&to=2016&cause=&filter=nok9')

nodes <- html_nodes(search.page, '#secondary-layout-one-column-body td+ td a')

href <- nodes %>% 
        html_attr('href') %>%
        lapply(read_html) %>%
        lapply(html_nodes('#secondary-layout-one-column-body td+ td a'))


officers <- list()

k = 1
repeat {
  node <- html_node(search.page, paste0('tr:nth-child(',k,') td+ td a'))
  if (is.na(html_attr(node,"href"))) {break}
  officers[[k]]<- list(ofc.page = html_attr(node, "href"), ofc.name = html_text(node))
  
  ##odmp <- 
  print(officers[k][1])
  k = k + 1
}
officers
  i=0
  j=3
  repeat {
    i = i + 1
    node <- html_node(odmp, paste0("p:nth-child(", i+1,")"))
    if (is.na(html_text(node))) {break}
    varPair <- strsplit(html_text(node),":")
    
    print(varPair)

    if (!is.na(varPair[1][2])) {
      officers[k][j] <- varPair[1][2]
      names(officers)[k][j] <- varPair[1][1]
      j = j + 1
    }
  } 


  
officers


## Get "Bio & Incident Details" from officer memorial page ##


bio <- list()

i = 0 
j = 1
repeat {
      i = i + 1
      odmp <- read_html('https://www.odmp.org/officer/22876-sergeant-stacey-allen-baumgartner')
      node <- html_node(odmp, paste0("p:nth-child(", i+1,")"))
      if (is.na(html_text(node))) {break}
      varPair <- strsplit(html_text(node),":")
      if (!is.na(varPair[[1]][2])) {
       bio[j] <- varPair[[1]][2]
       names(bio)[j] <- varPair[[1]][1]
       j = j + 1
      }
} 


 