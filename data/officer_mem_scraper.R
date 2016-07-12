odmp <- read_html('https://www.odmp.org/officer/22876-sergeant-stacey-allen-baumgartner')

bio <- list()

## Get "Bio & Incident Details" from officer memorial page ##
i = 0 
j = 1
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

